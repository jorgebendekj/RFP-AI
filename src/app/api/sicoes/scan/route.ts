import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/instantAdmin";
import { id } from "@instantdb/admin";

/**
 * SICOES scan endpoint — reads from the InstantDB tender cache populated by
 * the daily Playwright scraper (.github/workflows/scrape-sicoes.yml), filters
 * by the user's keywords, scores relevance with Claude Haiku, and returns
 * a sorted list of opportunities.
 *
 * Why a cache? SICOES uses Cloudflare Turnstile which blocks server-side
 * fetches. The daily Playwright scraper runs on GitHub Actions, uses a real
 * Chromium browser to solve Turnstile, and stores results in InstantDB.
 * This endpoint is now fast (no scraping), free (no ScrapingBee), and reliable.
 */

interface CachedTender {
  id: string;
  cuce: string;
  entidad: string;
  tipoContratacion: string;
  modalidad: string;
  objeto: string;
  fechaPublicacion: string;
  fechaPresentacion: string;
  estado: string;
  url: string;
  form100Url?: string;
  scrapedAt: number;
}

interface ScoredEntry {
  cuce: string;
  relevancia: number;
  justificacion: string;
}

type Anthropic = InstanceType<Awaited<typeof import("@anthropic-ai/sdk")>["default"]>;

// ─── Cache reader + keyword filter ───────────────────────────────────────────

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, ""); // strip accents
}

function matchesKeywords(tender: CachedTender, keywords: string[]): boolean {
  if (keywords.length === 0) return true;
  const haystack = normalize(`${tender.objeto} ${tender.entidad} ${tender.tipoContratacion}`);
  return keywords.some((kw) => {
    const k = normalize(kw.trim());
    return k.length > 0 && haystack.includes(k);
  });
}

async function readCachedTenders(): Promise<{
  tenders: CachedTender[];
  metadata: { lastRun: number; tenderCount: number; keywordCount: number } | null;
}> {
  const [tendersRes, metaRes] = await Promise.all([
    adminDb.query({ siceosTenders: {} }),
    adminDb.query({ siceosScrapeMetadata: {} }),
  ]);
  const tenders = (tendersRes.siceosTenders as unknown as CachedTender[]) || [];
  const metaList = (metaRes.siceosScrapeMetadata as unknown as Array<{
    lastRun: number;
    tenderCount: number;
    keywordCount: number;
  }>) || [];
  return { tenders, metadata: metaList[0] || null };
}

// ─── AI relevance scoring ────────────────────────────────────────────────────

async function scoreRelevance(
  anthropic: Anthropic,
  tenders: CachedTender[],
  companyType: string,
  keywords: string[]
): Promise<{ scored: ScoredEntry[]; summary: string }> {
  if (tenders.length === 0) {
    return {
      scored: [],
      summary: "No se encontraron licitaciones vigentes para tus palabras clave.",
    };
  }

  const list = tenders
    .slice(0, 30)
    .map(
      (t, i) =>
        `${i + 1}. CUCE: ${t.cuce}
   Entidad: ${t.entidad}
   Tipo: ${t.tipoContratacion} · ${t.modalidad}
   Objeto: ${t.objeto}
   Fecha presentación: ${t.fechaPresentacion}`
    )
    .join("\n\n");

  const resp = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Sos un experto en licitaciones públicas de Bolivia. Analizá estas licitaciones REALES extraídas del portal SICOES (sicoes.gob.bo) y puntuá la relevancia para una empresa de tipo "${companyType}" con estas palabras clave de interés: ${keywords.join(", ")}.

LICITACIONES VIGENTES EN CACHÉ:
${list}

Para cada licitación asigná:
- relevancia: número 0-100
  · 80-100: Muy relevante, directamente relacionada
  · 50-79: Relevante, puede participar con buenas chances
  · 20-49: Marginalmente relevante
  · 0-19: No relevante
- justificacion: 1-2 oraciones explicando por qué es o no es relevante

Devolvé SOLO JSON válido sin texto adicional:
{
  "scored": [
    {"cuce": "XX-XXXX-XX-XXXXXXX-X-X", "relevancia": 85, "justificacion": "..."}
  ],
  "summary": "Resumen ejecutivo de 2-3 oraciones sobre las mejores oportunidades para este perfil de empresa"
}`,
      },
    ],
  });

  const text = resp.content[0].type === "text" ? resp.content[0].text : "{}";
  const match = text.match(/\{[\s\S]*\}/);
  try {
    return JSON.parse(match ? match[0] : text);
  } catch {
    return {
      scored: tenders.map((t) => ({
        cuce: t.cuce,
        relevancia: 50,
        justificacion: "Licitación vigente en SICOES",
      })),
      summary: "Licitaciones vigentes encontradas en SICOES.",
    };
  }
}

// ─── Route handler ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const AnthropicSDK = (await import("@anthropic-ai/sdk")).default;
  const anthropic = new AnthropicSDK({ apiKey: process.env.ANTHROPIC_API_KEY! });

  try {
    const body = (await req.json()) as {
      userId: string;
      userEmail: string;
      companyType: string;
      keywords: string[];
      department?: string;
    };
    const { userId, userEmail, companyType, keywords, department } = body;

    if (!userId || !companyType) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }

    // ── Phase 1: Read cached tenders from InstantDB ───────────────────────────
    const { tenders: cached, metadata } = await readCachedTenders();

    if (cached.length === 0) {
      return NextResponse.json(
        {
          error:
            "El caché de SICOES está vacío. El scraper diario (GitHub Actions) " +
            "todavía no se ejecutó. Andá a github.com/jorgebendekj/RFP-AI/actions, " +
            "abrí el workflow 'Scrape SICOES' y hacé clic en 'Run workflow' para " +
            "poblarlo manualmente la primera vez.",
          source: "SICOES caché · vacío",
        },
        { status: 503 }
      );
    }

    // ── Phase 2: Filter cached tenders by user keywords + department ──────────
    let filtered = cached.filter((t) => matchesKeywords(t, keywords));
    if (department) {
      const dept = normalize(department);
      filtered = filtered.filter(
        (t) =>
          normalize(t.entidad).includes(dept) ||
          normalize(t.objeto).includes(dept)
      );
    }

    if (filtered.length === 0) {
      return NextResponse.json(
        {
          error: `No se encontraron licitaciones que coincidan con tus palabras clave (${keywords.join(", ")}). Caché tiene ${cached.length} licitaciones vigentes en total — probá ajustar tus palabras clave en Configuración.`,
          source: `SICOES caché · ${cached.length} licitaciones · actualizado ${metadata ? new Date(metadata.lastRun).toLocaleString("es-BO") : "—"}`,
        },
        { status: 404 }
      );
    }

    // ── Phase 3: AI scoring ──────────────────────────────────────────────────
    const { scored, summary } = await scoreRelevance(
      anthropic as unknown as Anthropic,
      filtered,
      companyType,
      keywords
    );

    // ── Phase 4: Merge ───────────────────────────────────────────────────────
    const tenders = filtered
      .map((t, i) => {
        const score = scored.find((s) => s.cuce === t.cuce);
        return {
          id: `${t.cuce.replace(/-/g, "")}-${i}`,
          codigo: t.cuce,
          descripcion: t.objeto,
          entidad: t.entidad,
          monto: undefined as string | undefined,
          fecha: t.fechaPresentacion,
          departamento: department,
          tipo: [t.tipoContratacion, t.modalidad].filter(Boolean).join(" · "),
          relevancia: score?.relevancia ?? 40,
          justificacion:
            score?.justificacion ?? "Licitación vigente encontrada en SICOES",
          url: t.url,
        };
      })
      .filter((t) => t.relevancia >= 15)
      .sort((a, b) => b.relevancia - a.relevancia)
      .slice(0, 20);

    const result = {
      tenders,
      summary,
      scannedAt: new Date().toISOString(),
      totalFound: filtered.length,
      cacheAge: metadata
        ? `Caché actualizado ${new Date(metadata.lastRun).toLocaleString("es-BO")} · ${metadata.tenderCount} licitaciones`
        : null,
      source: "SICOES · sicoes.gob.bo (vía caché diario)",
    };

    // ── Persist scan history (non-critical) ───────────────────────────────────
    try {
      await adminDb.transact(
        adminDb.tx.siceosScans[id()].update({
          userId,
          userEmail: userEmail || "",
          status: "done",
          tenders,
          summary,
          createdAt: Date.now(),
          companyType,
        })
      );
    } catch {
      /* non-critical */
    }

    return NextResponse.json(result);
  } catch (e: unknown) {
    console.error("[sicoes/scan]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error interno del servidor" },
      { status: 500 }
    );
  }
}
