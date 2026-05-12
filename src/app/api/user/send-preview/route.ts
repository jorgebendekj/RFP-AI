import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/instantAdmin";

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
  scrapedAt: number;
}

interface ScoredTender extends CachedTender {
  relevancia: number;
  justificacion: string;
}

type Anthropic = InstanceType<Awaited<typeof import("@anthropic-ai/sdk")>["default"]>;

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

async function scoreAndSummarize(
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
        `${i + 1}. CUCE: ${t.cuce}\n   Entidad: ${t.entidad}\n   Tipo: ${t.tipoContratacion} · ${t.modalidad}\n   Objeto: ${t.objeto}\n   Fecha presentación: ${t.fechaPresentacion}`
    )
    .join("\n\n");

  const resp = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Sos un experto en licitaciones públicas de Bolivia. Analizá estas licitaciones REALES del portal SICOES y puntuá relevancia para una empresa de tipo "${companyType}" con palabras clave: ${keywords.join(", ")}.

LICITACIONES:
${list}

Devolvé SOLO JSON:
{"scored":[{"cuce":"...","relevancia":85,"justificacion":"..."}],"summary":"2-3 oraciones sobre las mejores oportunidades para este perfil"}`,
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
      return { ...t, relevancia: s?.relevancia ?? 40, justificacion: s?.justificacion ?? "Licitación vigente" };
    })
    .filter((t) => t.relevancia >= 20)
    .sort((a, b) => b.relevancia - a.relevancia)
    .slice(0, 15);

  return { scored, summary: parsed.summary || "" };
}

function buildEmailHtml(email: string, companyType: string, tenders: ScoredTender[], summary: string, isPreview: boolean): string {
  const dateStr = new Date().toLocaleDateString("es-BO", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const tendersHtml = tenders.map((t) => {
    const relColor = t.relevancia >= 70 ? "#00D68F" : t.relevancia >= 40 ? "#FFB547" : "#4A6075";
    return `<tr>
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
  }).join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="background:#050A0E;color:#E0EAF4;font-family:'Courier New',monospace;margin:0;padding:0;">
  <div style="max-width:720px;margin:0 auto;padding:32px 16px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-block;padding:14px 28px;background:#0D1B2A;border:1px solid #00E5C3;border-radius:8px;">
        <span style="color:#00E5C3;font-weight:700;letter-spacing:0.15em;font-size:18px;">📡 SICOES MONITOR</span>
      </div>
      <div style="color:#4A6075;margin-top:10px;font-size:12px;letter-spacing:0.05em;">${isPreview ? "Vista previa · " : "Reporte diario · "}${dateStr}</div>
    </div>

    ${isPreview ? `<div style="background:#0D1B2A;border:1px solid rgba(0,229,195,0.4);border-radius:8px;padding:14px 18px;margin-bottom:20px;text-align:center;">
      <div style="color:#00E5C3;font-size:13px;">✓ Notificaciones activadas — recibirás este reporte <strong>cada día a las 9:00 AM (hora Bolivia)</strong></div>
    </div>` : ""}

    <div style="background:#0D1B2A;border:1px solid #1A2E45;border-radius:8px;padding:18px;margin-bottom:20px;">
      <div style="color:#4A6075;font-size:10px;letter-spacing:0.1em;margin-bottom:6px;">PERFIL</div>
      <div style="color:#E0EAF4;font-size:14px;">${email} · <span style="color:#00E5C3;text-transform:uppercase;">${companyType}</span></div>
    </div>

    ${summary ? `<div style="background:#0D1B2A;border:1px solid #1A2E45;border-left:3px solid #00E5C3;border-radius:8px;padding:18px;margin-bottom:20px;">
      <div style="color:#00E5C3;font-size:10px;letter-spacing:0.1em;margin-bottom:8px;">DESTACADOS DEL DÍA · ANÁLISIS IA</div>
      <div style="color:#E0EAF4;font-size:14px;line-height:1.6;">${summary}</div>
    </div>` : ""}

    <div style="background:#0D1B2A;border:1px solid #1A2E45;border-radius:8px;overflow:hidden;margin-bottom:20px;">
      <div style="padding:14px;background:#0A1520;border-bottom:1px solid #1A2E45;">
        <div style="color:#00E5C3;font-size:12px;letter-spacing:0.08em;font-weight:600;">${tenders.length} LICITACIONES RELEVANTES PARA TI</div>
      </div>
      <table style="width:100%;border-collapse:collapse;"><tbody>${tendersHtml}</tbody></table>
    </div>

    <div style="text-align:center;color:#4A6075;font-size:11px;line-height:1.6;">
      <p style="margin:0 0 4px 0;">SICOES Monitor · Bolivia</p>
      <p style="margin:0;">Editá tus palabras clave o pausá las notificaciones desde <a href="https://rfp-ai.vercel.app/dashboard" style="color:#00E5C3;text-decoration:none;">tu dashboard</a></p>
    </div>
  </div>
</body></html>`;
}

function buildNoMatchHtml(email: string, companyType: string, total: number, isPreview: boolean): string {
  const dateStr = new Date().toLocaleDateString("es-BO", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="background:#050A0E;color:#E0EAF4;font-family:'Courier New',monospace;margin:0;padding:32px 16px;">
  <div style="max-width:680px;margin:0 auto;text-align:center;">
    <div style="color:#00E5C3;font-weight:700;letter-spacing:0.15em;font-size:18px;margin-bottom:8px;">📡 SICOES MONITOR</div>
    <div style="color:#4A6075;font-size:12px;margin-bottom:24px;">${isPreview ? "Vista previa · " : "Reporte diario · "}${dateStr}</div>
    ${isPreview ? `<div style="background:#0D1B2A;border:1px solid rgba(0,229,195,0.4);border-radius:8px;padding:14px 18px;margin-bottom:20px;">
      <div style="color:#00E5C3;font-size:13px;">✓ Notificaciones activadas — recibirás este reporte <strong>cada día a las 9:00 AM (hora Bolivia)</strong></div>
    </div>` : ""}
    <div style="background:#0D1B2A;border:1px solid #1A2E45;border-radius:8px;padding:32px;color:#E0EAF4;">
      <p style="font-size:16px;margin:0 0 16px 0;">Hola ${email},</p>
      <p style="margin:0 0 16px 0;">Hoy no hay licitaciones VIGENTES en SICOES que coincidan con tus palabras clave para <strong style="color:#00E5C3;">${companyType}</strong>.</p>
      <p style="color:#4A6075;font-size:13px;margin:0 0 16px 0;">SICOES tiene ${total} licitaciones vigentes en total — probá ajustar tus palabras clave.</p>
      <p style="margin:0;"><a href="https://rfp-ai.vercel.app/dashboard" style="color:#00E5C3;">Actualizar palabras clave</a></p>
    </div>
  </div>
</body></html>`;
}

// Sends a preview/welcome email immediately when a user enables notifications.
// Called fire-and-forget from the dashboard saveSettings flow.
export async function POST(req: NextRequest) {
  const { userId, userEmail, companyType, keywords } = (await req.json()) as {
    userId: string;
    userEmail: string;
    companyType: string;
    keywords: string[];
  };

  if (!userId || !userEmail || !companyType) {
    return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
  }

  const FROM = process.env.RESEND_FROM || "SICOES Monitor <onboarding@resend.dev>";

  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const { Resend } = await import("resend");
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, maxRetries: 4 });
  const resend = new Resend(process.env.RESEND_API_KEY!);

  try {
    const cacheRes = await adminDb.query({ siceosTenders: {} });
    const cache = (cacheRes.siceosTenders as unknown as CachedTender[]) || [];

    if (cache.length === 0) {
      return NextResponse.json({ ok: false, reason: "cache_empty" });
    }

    const kws = Array.isArray(keywords) ? keywords : [];
    const matched = cache.filter((t) => matchesKeywords(t, kws));
    const dateShort = new Date().toLocaleDateString("es-BO");

    let html: string;
    let subject: string;

    if (matched.length === 0) {
      html = buildNoMatchHtml(userEmail, companyType, cache.length, true);
      subject = `📡 SICOES Monitor · ${dateShort} · notificaciones activadas`;
    } else {
      const { scored, summary } = await scoreAndSummarize(
        anthropic as unknown as Anthropic,
        matched,
        companyType,
        kws
      );
      html = buildEmailHtml(userEmail, companyType, scored.length > 0 ? scored : [], summary, true);
      subject = scored.length > 0
        ? `📡 SICOES Monitor · ${dateShort} · ${scored.length} licitaciones (vista previa)`
        : `📡 SICOES Monitor · ${dateShort} · notificaciones activadas`;
    }

    await resend.emails.send({ from: FROM, to: userEmail, subject, html });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[user/send-preview]", e);
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
