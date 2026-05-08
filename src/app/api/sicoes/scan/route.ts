import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/instantAdmin";
import { id } from "@instantdb/admin";

const SICOES_SEARCH = "https://sicoes.gob.bo/portal/contrataciones/busqueda/convocatorias.php";
const SICOES_BASE = "https://sicoes.gob.bo";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RawTender {
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
}

interface ScoredEntry {
  cuce: string;
  relevancia: number;
  justificacion: string;
}

// ─── SICOES Scraper ───────────────────────────────────────────────────────────

async function scrapeSICOES(
  keywords: string[],
  department?: string
): Promise<RawTender[]> {
  const allTenders: RawTender[] = [];
  const seen = new Set<string>();

  // 1. Get session cookie from SICOES
  let sessionCookie = "";
  try {
    const init = await fetch(`${SICOES_SEARCH}?tipo=convNacional`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "es-ES,es;q=0.9",
      },
      signal: AbortSignal.timeout(12000),
    });
    const setCookie = init.headers.get("set-cookie");
    if (setCookie) {
      sessionCookie = setCookie
        .split(",")
        .map((c) => c.split(";")[0].trim())
        .join("; ");
    }
  } catch {
    // proceed without session cookie
  }

  // 2. Search each keyword — limit to 5 to avoid slow responses
  const searchTerms = keywords.slice(0, 5);

  for (const term of searchTerms) {
    try {
      // Build form-encoded body matching SICOES PHP form
      const body = new URLSearchParams({
        objeto_contratacion: term,
        ver: "1",         // 1 = Solo Vigentes
        subasta: "",
        bienes: "on",
        obras: "on",
        servicios_generales: "on",
        servicios_consultoria: "on",
        buscar: "Buscar",
      });

      const resp = await fetch(`${SICOES_SEARCH}?tipo=convNacional`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "es-ES,es;q=0.9",
          Referer: `${SICOES_SEARCH}?tipo=convNacional`,
          ...(sessionCookie ? { Cookie: sessionCookie } : {}),
        },
        body: body.toString(),
        signal: AbortSignal.timeout(20000),
      });

      if (!resp.ok) continue;

      const html = await resp.text();
      const parsed = parseSICOESTable(html);

      for (const t of parsed) {
        // Only accept Vigente + not duplicate
        if (!seen.has(t.cuce) && isVigente(t.estado)) {
          seen.add(t.cuce);
          allTenders.push(t);
        }
      }
    } catch (err) {
      console.error(`[sicoes] keyword "${term}":`, err);
    }
  }

  // 3. Filter by department if specified (match in entidad name)
  if (department) {
    const dept = department.toLowerCase();
    return allTenders.filter(
      (t) =>
        t.entidad.toLowerCase().includes(dept) ||
        t.objeto.toLowerCase().includes(dept)
    );
  }

  return allTenders;
}

// ─── HTML Parser ─────────────────────────────────────────────────────────────

function parseSICOESTable(html: string): RawTender[] {
  const tenders: RawTender[] = [];

  // Strip script/style tags first for cleaner parsing
  const clean = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");

  // Extract all <tr> blocks
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch: RegExpExecArray | null;

  while ((trMatch = trRegex.exec(clean)) !== null) {
    const rowHtml = trMatch[1];

    // Extract all <td> cells in this row
    const cells: string[] = [];
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let tdMatch: RegExpExecArray | null;
    while ((tdMatch = tdRegex.exec(rowHtml)) !== null) {
      cells.push(tdMatch[1]);
    }

    // SICOES table has at least 9 columns: CUCE, Entidad, TipoContratacion,
    // Modalidad, Objeto, Subasta, FechaPub, FechaPres, Estado, ...
    if (cells.length < 9) continue;

    const cuceRaw = htmlText(cells[0]);

    // Validate CUCE pattern: 2digits - 4digits - 2digits - 5+digits - digit - digit
    if (!cuceRaw.match(/^\d{2}-\d{3,6}-\d{2}-\d{5,9}-\d+-\d+$/)) continue;

    // Extract href from CUCE cell (direct link to this tender)
    const cuceHref = extractHref(cells[0]);
    const tenderUrl = cuceHref
      ? resolveUrl(cuceHref)
      : `${SICOES_SEARCH}?tipo=convNacional`;

    // Extract FORM 100 URL from Formularios column (usually col 10)
    const form100Url = cells[10] ? extractHref(cells[10]) || undefined : undefined;

    const tender: RawTender = {
      cuce: cuceRaw,
      entidad: htmlText(cells[1]),
      tipoContratacion: htmlText(cells[2]),
      modalidad: htmlText(cells[3]),
      objeto: htmlText(cells[4]),
      fechaPublicacion: htmlText(cells[6]),
      fechaPresentacion: htmlText(cells[7]),
      estado: htmlText(cells[8]),
      url: tenderUrl,
      form100Url: form100Url ? resolveUrl(form100Url) : undefined,
    };

    if (tender.objeto && tender.entidad) {
      tenders.push(tender);
    }
  }

  return tenders;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function htmlText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();
}

function extractHref(html: string): string | null {
  const m = html.match(/href=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

function resolveUrl(href: string): string {
  if (href.startsWith("http")) return href;
  return `${SICOES_BASE}${href.startsWith("/") ? href : "/" + href}`;
}

function isVigente(estado: string): boolean {
  const e = estado.toLowerCase();
  return e.includes("vigente") || e === "" || e === "v";
}

// ─── AI Relevance Scoring ─────────────────────────────────────────────────────

async function scoreRelevance(
  anthropic: Anthropic,
  tenders: RawTender[],
  companyType: string,
  keywords: string[]
): Promise<{ scored: ScoredEntry[]; summary: string }> {
  if (tenders.length === 0) {
    return {
      scored: [],
      summary: "No se encontraron licitaciones vigentes en SICOES.",
    };
  }

  // Format tenders for the prompt — send max 30
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
    // claude-haiku-4-5: más eficiente y cost-effective para análisis estructurado
    // vs claude-sonnet-4-5 que es 4x más caro y no necesario para scoring
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Sos un experto en licitaciones públicas de Bolivia. Analizá estas licitaciones REALES extraídas del portal SICOES (sicoes.gob.bo) y puntuá la relevancia para una empresa de tipo "${companyType}" con estas palabras clave de interés: ${keywords.join(", ")}.

LICITACIONES VIGENTES EXTRAÍDAS DE SICOES:
${list}

Para cada licitación asigná:
- relevancia: número 0-100 (qué tan relevante es para el tipo de empresa y palabras clave)
  · 80-100: Muy relevante, directamente relacionada
  · 50-79: Relevante, puede participar con buenas chances
  · 20-49: Marginalmente relevante
  · 0-19: No relevante
- justificacion: 1-2 oraciones explicando por qué es o no es relevante

Devolvé SOLO JSON válido sin texto adicional:
{
  "scored": [
    {"cuce": "XX-XXXX-XX-XXXXXXX-X-X", "relevancia": 85, "justificacion": "Explica brevemente"}
  ],
  "summary": "Resumen ejecutivo de 2-3 oraciones sobre las mejores oportunidades encontradas hoy en SICOES para este perfil de empresa"
}`,
      },
    ],
  });

  const text = resp.content[0].type === "text" ? resp.content[0].text : "{}";
  const match = text.match(/\{[\s\S]*\}/);
  try {
    return JSON.parse(match ? match[0] : text);
  } catch {
    // Fallback: assign 50 to all
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

// Declare Anthropic type for parameters
type Anthropic = Awaited<ReturnType<typeof import("@anthropic-ai/sdk")["default"]["prototype"]["constructor"]["prototype"]["messages"]["create"]>> extends { stop_reason: string }
  ? never
  : InstanceType<Awaited<typeof import("@anthropic-ai/sdk")>["default"]>;

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Lazy import — avoids build-time env check
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

    // ── Phase 1: Scrape real SICOES data ──────────────────────────────────────
    const rawTenders = await scrapeSICOES(keywords, department);

    if (rawTenders.length === 0) {
      return NextResponse.json(
        {
          error:
            "No se encontraron licitaciones VIGENTES en SICOES para las palabras clave configuradas. " +
            "Verificá que SICOES esté disponible o intentá con otras palabras clave.",
          source: "SICOES · sicoes.gob.bo",
        },
        { status: 404 }
      );
    }

    // ── Phase 2: Score relevance with Claude Haiku ────────────────────────────
    const { scored, summary } = await scoreRelevance(
      anthropic as unknown as Anthropic,
      rawTenders,
      companyType,
      keywords
    );

    // ── Phase 3: Merge real data + AI scoring ─────────────────────────────────
    const tenders = rawTenders
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
          // Prefer the direct CUCE link → FORM 100 → fallback general
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
      totalFound: rawTenders.length,
      source: "SICOES · sicoes.gob.bo",
    };

    // ── Store scan (non-critical) ─────────────────────────────────────────────
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
