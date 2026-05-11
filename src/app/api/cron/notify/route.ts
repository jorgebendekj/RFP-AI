import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/instantAdmin";

/**
 * Daily email notification cron — runs at 9:00 AM Bolivia (13:00 UTC) via
 * Vercel Cron (see vercel.json). Sends each enabled user a personalized email
 * with the SICOES tenders matching their keywords + AI-generated highlights.
 *
 * Reads from the InstantDB cache populated by the GitHub Actions Playwright
 * scraper (scripts/scrape-sicoes.ts). Never hallucinates data.
 *
 * Vercel Cron sends GET requests with a Bearer token (CRON_SECRET).
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

interface UserSetting {
  id: string;
  userId: string;
  userEmail?: string;
  companyType: string;
  keywords: string[];
  enabled?: boolean;
  notifyEnabled?: boolean;
}

type Anthropic = InstanceType<Awaited<typeof import("@anthropic-ai/sdk")>["default"]>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function matchesKeywords(tender: CachedTender, keywords: string[]): boolean {
  if (keywords.length === 0) return true;
  const haystack = normalize(`${tender.objeto} ${tender.entidad} ${tender.tipoContratacion}`);
  return keywords.some((kw) => {
    const k = normalize(kw.trim());
    return k.length > 0 && haystack.includes(k);
  });
}

interface ScoredTender extends CachedTender {
  relevancia: number;
  justificacion: string;
}

async function scoreForUser(
  anthropic: Anthropic,
  tenders: CachedTender[],
  companyType: string,
  keywords: string[]
): Promise<{ scored: ScoredTender[]; summary: string }> {
  if (tenders.length === 0) return { scored: [], summary: "" };

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
        content: `Sos un experto en licitaciones públicas de Bolivia. Analizá estas licitaciones REALES extraídas hoy del portal SICOES y puntuá la relevancia para una empresa de tipo "${companyType}" con palabras clave: ${keywords.join(", ")}.

LICITACIONES VIGENTES:
${list}

Para cada una asigná:
- relevancia: 0-100
- justificacion: 1 oración

Devolvé SOLO JSON sin texto adicional:
{
  "scored": [{"cuce":"XX-...", "relevancia": 85, "justificacion": "..."}],
  "summary": "2-3 oraciones destacando las mejores oportunidades de hoy para este perfil"
}`,
      },
    ],
  });

  const text = resp.content[0].type === "text" ? resp.content[0].text : "{}";
  const match = text.match(/\{[\s\S]*\}/);
  let parsed: { scored: Array<{ cuce: string; relevancia: number; justificacion: string }>; summary: string };
  try {
    parsed = JSON.parse(match ? match[0] : text);
  } catch {
    parsed = {
      scored: tenders.map((t) => ({ cuce: t.cuce, relevancia: 50, justificacion: "Licitación vigente." })),
      summary: "Licitaciones vigentes encontradas hoy en SICOES.",
    };
  }

  const scored: ScoredTender[] = tenders
    .map((t) => {
      const s = parsed.scored.find((x) => x.cuce === t.cuce);
      return {
        ...t,
        relevancia: s?.relevancia ?? 40,
        justificacion: s?.justificacion ?? "Licitación vigente en SICOES",
      };
    })
    .filter((t) => t.relevancia >= 20)
    .sort((a, b) => b.relevancia - a.relevancia)
    .slice(0, 15);

  return { scored, summary: parsed.summary || "" };
}

// ─── Email HTML ─────────────────────────────────────────────────────────────

function buildEmailHtml(
  email: string,
  companyType: string,
  tenders: ScoredTender[],
  summary: string
): string {
  const dateStr = new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const tendersHtml = tenders
    .map((t) => {
      const relColor = t.relevancia >= 70 ? "#00D68F" : t.relevancia >= 40 ? "#FFB547" : "#4A6075";
      return `
      <tr>
        <td style="padding:14px;border-bottom:1px solid #1A2E45;vertical-align:top;">
          <div style="color:#00E5C3;font-weight:600;font-size:11px;letter-spacing:0.05em;margin-bottom:6px;">${t.cuce}</div>
          <div style="color:#E0EAF4;font-size:14px;line-height:1.4;margin-bottom:6px;">${t.objeto}</div>
          <div style="color:#4A6075;font-size:12px;margin-bottom:4px;">${t.entidad}</div>
          <div style="color:#4A6075;font-size:11px;">${t.tipoContratacion} · ${t.modalidad} · Cierre: ${t.fechaPresentacion}</div>
          ${t.justificacion ? `<div style="color:#FFB547;font-size:11px;font-style:italic;margin-top:6px;">★ ${t.justificacion}</div>` : ""}
        </td>
        <td style="padding:14px;border-bottom:1px solid #1A2E45;text-align:center;vertical-align:top;width:60px;">
          <div style="color:${relColor};font-weight:700;font-size:16px;">${t.relevancia}</div>
          <div style="color:#4A6075;font-size:9px;letter-spacing:0.1em;margin-top:2px;">REL.</div>
        </td>
        <td style="padding:14px;border-bottom:1px solid #1A2E45;vertical-align:top;width:80px;text-align:right;">
          <a href="${t.url}" style="color:#00E5C3;font-size:12px;text-decoration:none;border:1px solid #00E5C3;padding:6px 10px;border-radius:4px;display:inline-block;">Ver →</a>
        </td>
      </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#050A0E;color:#E0EAF4;font-family:'Courier New',monospace;margin:0;padding:0;">
  <div style="max-width:720px;margin:0 auto;padding:32px 16px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-block;padding:14px 28px;background:#0D1B2A;border:1px solid #00E5C3;border-radius:8px;">
        <span style="color:#00E5C3;font-weight:700;letter-spacing:0.15em;font-size:18px;">📡 SICOES MONITOR</span>
      </div>
      <div style="color:#4A6075;margin-top:10px;font-size:12px;letter-spacing:0.05em;">Reporte diario · ${dateStr}</div>
    </div>

    <div style="background:#0D1B2A;border:1px solid #1A2E45;border-radius:8px;padding:18px;margin-bottom:20px;">
      <div style="color:#4A6075;font-size:10px;letter-spacing:0.1em;margin-bottom:6px;">PERFIL</div>
      <div style="color:#E0EAF4;font-size:14px;">${email} · <span style="color:#00E5C3;text-transform:uppercase;">${companyType}</span></div>
    </div>

    ${summary ? `
    <div style="background:#0D1B2A;border:1px solid #1A2E45;border-left:3px solid #00E5C3;border-radius:8px;padding:18px;margin-bottom:20px;">
      <div style="color:#00E5C3;font-size:10px;letter-spacing:0.1em;margin-bottom:8px;">DESTACADOS DEL DÍA · ANÁLISIS IA</div>
      <div style="color:#E0EAF4;font-size:14px;line-height:1.6;">${summary}</div>
    </div>` : ""}

    <div style="background:#0D1B2A;border:1px solid #1A2E45;border-radius:8px;overflow:hidden;margin-bottom:20px;">
      <div style="padding:14px;background:#0A1520;border-bottom:1px solid #1A2E45;">
        <div style="color:#00E5C3;font-size:12px;letter-spacing:0.08em;font-weight:600;">${tenders.length} LICITACIONES RELEVANTES PARA TI</div>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        <tbody>${tendersHtml}</tbody>
      </table>
    </div>

    <div style="text-align:center;color:#4A6075;font-size:11px;line-height:1.6;">
      <p style="margin:0 0 4px 0;">SICOES Monitor · Bolivia</p>
      <p style="margin:0 0 4px 0;">Enviado automáticamente todos los días a las 9:00 AM hora Bolivia</p>
      <p style="margin:0;">Editá tus palabras clave o pausá las notificaciones desde <a href="https://rfp-ai.vercel.app/dashboard" style="color:#00E5C3;text-decoration:none;">tu dashboard</a></p>
    </div>
  </div>
</body>
</html>`;
}

function buildEmptyEmailHtml(email: string, companyType: string, totalCached: number): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="background:#050A0E;color:#E0EAF4;font-family:'Courier New',monospace;margin:0;padding:32px 16px;">
  <div style="max-width:680px;margin:0 auto;text-align:center;">
    <div style="color:#00E5C3;font-weight:700;letter-spacing:0.15em;font-size:18px;margin-bottom:24px;">📡 SICOES MONITOR</div>
    <div style="background:#0D1B2A;border:1px solid #1A2E45;border-radius:8px;padding:32px;color:#E0EAF4;">
      <p style="font-size:16px;margin:0 0 16px 0;">Hola ${email},</p>
      <p style="margin:0 0 16px 0;">Hoy no encontramos licitaciones VIGENTES en SICOES que coincidan con tus palabras clave para <strong style="color:#00E5C3;">${companyType}</strong>.</p>
      <p style="color:#4A6075;font-size:13px;margin:0 0 16px 0;">El portal SICOES tiene ${totalCached} licitaciones vigentes en total hoy, pero ninguna matchea tus filtros.</p>
      <p style="margin:0;"><a href="https://rfp-ai.vercel.app/dashboard" style="color:#00E5C3;">Ajustá tus palabras clave</a> para recibir más oportunidades.</p>
    </div>
  </div>
</body></html>`;
}

// ─── Cron handler (GET — Vercel cron sends GET requests) ────────────────────

export async function GET(req: NextRequest) {
  // Verify Vercel cron Authorization header
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const { Resend } = await import("resend");

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const resend = new Resend(process.env.RESEND_API_KEY!);

  // Resend sender — uses Resend's verified shared sender if no custom domain.
  // To use your own domain, verify it at resend.com/domains and update this.
  const FROM = process.env.RESEND_FROM || "SICOES Monitor <onboarding@resend.dev>";

  try {
    // ── Phase 1: Read all enabled+notifyEnabled users ──────────────────────────
    const settingsRes = await adminDb.query({
      siceosSettings: { $: { where: { enabled: true, notifyEnabled: true } } },
    });
    const settings = (settingsRes.siceosSettings as unknown as UserSetting[]) || [];

    if (settings.length === 0) {
      return NextResponse.json({ ok: true, notified: 0, message: "No active users" });
    }

    // ── Phase 2: Read the SICOES cache once (shared across all users) ─────────
    const cacheRes = await adminDb.query({ siceosTenders: {} });
    const cache = (cacheRes.siceosTenders as unknown as CachedTender[]) || [];

    if (cache.length === 0) {
      return NextResponse.json({
        ok: false,
        notified: 0,
        message: "Cache empty — scraper has not run yet. Trigger GitHub Actions workflow manually.",
      });
    }

    // ── Phase 3: Per-user filter + AI score + send ────────────────────────────
    let notified = 0;
    const errors: string[] = [];

    for (const setting of settings) {
      try {
        const recipientEmail = setting.userEmail;
        if (!recipientEmail) continue;

        const keywords = Array.isArray(setting.keywords) ? setting.keywords : [];
        const matched = cache.filter((t) => matchesKeywords(t, keywords));

        let html: string;
        let subject: string;
        const dateShort = new Date().toLocaleDateString("es-BO");

        if (matched.length === 0) {
          html = buildEmptyEmailHtml(recipientEmail, setting.companyType, cache.length);
          subject = `📡 SICOES Monitor · ${dateShort} · sin coincidencias hoy`;
        } else {
          const { scored, summary } = await scoreForUser(
            anthropic as unknown as Anthropic,
            matched,
            setting.companyType,
            keywords
          );

          if (scored.length === 0) {
            html = buildEmptyEmailHtml(recipientEmail, setting.companyType, cache.length);
            subject = `📡 SICOES Monitor · ${dateShort} · sin licitaciones relevantes`;
          } else {
            html = buildEmailHtml(recipientEmail, setting.companyType, scored, summary);
            subject = `📡 SICOES Monitor · ${dateShort} · ${scored.length} licitaciones`;
          }
        }

        await resend.emails.send({
          from: FROM,
          to: recipientEmail,
          subject,
          html,
        });
        notified++;
      } catch (e) {
        errors.push(`${setting.userEmail || setting.userId}: ${e instanceof Error ? e.message : "error"}`);
      }
    }

    return NextResponse.json({
      ok: true,
      total: settings.length,
      notified,
      cacheSize: cache.length,
      errors,
    });
  } catch (e) {
    console.error("[cron/notify]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error interno" },
      { status: 500 }
    );
  }
}

// Keep POST for backward compat / manual triggering with curl
export const POST = GET;
