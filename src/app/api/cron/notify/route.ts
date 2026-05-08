import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/instantAdmin";

export async function POST(req: NextRequest) {
  // Verify Vercel cron secret
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Lazy-load to avoid top-level env var requirement during build
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const { Resend } = await import("resend");

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const resend = new Resend(process.env.RESEND_API_KEY!);

  try {
    const result = await adminDb.query({
      siceosSettings: {
        $: { where: { enabled: true, notifyEnabled: true } },
      },
    });

    const activeSettings = (result as { siceosSettings?: Record<string, unknown>[] }).siceosSettings || [];
    let notified = 0;
    const errors: string[] = [];

    for (const setting of activeSettings) {
      try {
        const keywordsList = Array.isArray(setting.keywords)
          ? (setting.keywords as string[])
          : [];

        const prompt = `Eres un experto en contrataciones estatales de Bolivia. Genera un resumen diario de licitaciones SICOES para el ${new Date().toLocaleDateString("es-BO")} para una empresa de tipo "${setting.companyType}" con palabras clave: ${keywordsList.join(", ")}.

Devuelve JSON:
{
  "tenders": [
    {
      "id": "uuid",
      "codigo": "CUCE-2026-...",
      "descripcion": "descripción",
      "entidad": "entidad pública",
      "monto": "Bs. X.XXX.XXX,00",
      "fecha": "DD/MM/YYYY",
      "tipo": "ANPE|DBC|CD|LPE",
      "relevancia": 0-100,
      "url": "https://sicoes.gob.bo/..."
    }
  ],
  "highlights": "2-3 oraciones sobre las licitaciones más importantes del día"
}

Genera 4-6 licitaciones. Solo JSON.`;

        const response = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 2048,
          messages: [{ role: "user", content: prompt }],
        });

        const text =
          response.content[0].type === "text" ? response.content[0].text : "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text) as {
          tenders: Array<{
            codigo: string;
            descripcion: string;
            entidad: string;
            monto?: string;
            relevancia: number;
            url?: string;
          }>;
          highlights: string;
        };

        const emailHtml = buildEmailHtml(
          (setting.userEmail as string) || (setting.userId as string),
          setting.companyType as string,
          parsed.tenders || [],
          parsed.highlights || ""
        );

        const recipientEmail = setting.userEmail as string;
        if (recipientEmail) {
          await resend.emails.send({
            from: "SICOES Monitor <notificaciones@sicoes-monitor.com>",
            to: recipientEmail,
            subject: `📡 SICOES Monitor · ${new Date().toLocaleDateString("es-BO")} · ${(parsed.tenders || []).length} licitaciones`,
            html: emailHtml,
          });
          notified++;
        }
      } catch (e: unknown) {
        errors.push(
          `${setting.userId}: ${e instanceof Error ? e.message : "error"}`
        );
      }
    }

    return NextResponse.json({ notified, errors, total: activeSettings.length });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error interno" },
      { status: 500 }
    );
  }
}

function buildEmailHtml(
  email: string,
  companyType: string,
  tenders: Array<{
    codigo: string;
    descripcion: string;
    entidad: string;
    monto?: string;
    relevancia: number;
    url?: string;
  }>,
  highlights: string
): string {
  const tendersHtml = tenders
    .sort((a, b) => b.relevancia - a.relevancia)
    .map(
      (t) => `
      <tr>
        <td style="padding:12px;border-bottom:1px solid #1A2E45;">
          <div style="color:#00E5C3;font-weight:600;font-size:12px;margin-bottom:4px;">${t.codigo}</div>
          <div style="color:#E0EAF4;margin-bottom:4px;">${t.descripcion}</div>
          <div style="color:#4A6075;font-size:12px;">${t.entidad}</div>
        </td>
        <td style="padding:12px;border-bottom:1px solid #1A2E45;color:#00D68F;font-weight:600;white-space:nowrap;">${t.monto || "—"}</td>
        <td style="padding:12px;border-bottom:1px solid #1A2E45;text-align:center;">
          <div style="color:${t.relevancia >= 70 ? "#00D68F" : t.relevancia >= 40 ? "#FFB547" : "#4A6075"};font-weight:700;">${t.relevancia}%</div>
        </td>
        <td style="padding:12px;border-bottom:1px solid #1A2E45;">
          ${t.url ? `<a href="${t.url}" style="color:#00E5C3;font-size:12px;">Ver →</a>` : ""}
        </td>
      </tr>`
    )
    .join("");

  const dateStr = new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#050A0E;color:#E0EAF4;font-family:'Courier New',monospace;margin:0;padding:0;">
  <div style="max-width:680px;margin:0 auto;padding:32px 16px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-block;padding:12px 24px;background:#0D1B2A;border:1px solid #1A2E45;border-radius:8px;">
        <span style="color:#00E5C3;font-weight:700;letter-spacing:0.1em;font-size:18px;">📡 SICOES MONITOR</span>
      </div>
      <div style="color:#4A6075;margin-top:8px;font-size:13px;">Reporte diario · ${dateStr}</div>
    </div>

    <div style="background:#0D1B2A;border:1px solid #1A2E45;border-radius:8px;padding:20px;margin-bottom:24px;">
      <div style="color:#4A6075;font-size:11px;letter-spacing:0.08em;margin-bottom:8px;">PERFIL</div>
      <div style="color:#E0EAF4;">${email} · <span style="color:#00E5C3;">${companyType}</span></div>
    </div>

    ${highlights ? `
    <div style="background:#0D1B2A;border:1px solid #1A2E45;border-left:3px solid #00E5C3;border-radius:8px;padding:20px;margin-bottom:24px;">
      <div style="color:#00E5C3;font-size:11px;letter-spacing:0.08em;margin-bottom:8px;">DESTACADOS DEL DÍA</div>
      <div style="color:#E0EAF4;font-size:14px;line-height:1.6;">${highlights}</div>
    </div>` : ""}

    <div style="background:#0D1B2A;border:1px solid #1A2E45;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#0A1520;">
            <th style="padding:12px;text-align:left;color:#4A6075;font-size:11px;letter-spacing:0.08em;">LICITACIÓN</th>
            <th style="padding:12px;text-align:left;color:#4A6075;font-size:11px;letter-spacing:0.08em;">MONTO</th>
            <th style="padding:12px;text-align:center;color:#4A6075;font-size:11px;letter-spacing:0.08em;">REL.</th>
            <th style="padding:12px;"></th>
          </tr>
        </thead>
        <tbody>${tendersHtml}</tbody>
      </table>
    </div>

    <div style="text-align:center;color:#4A6075;font-size:12px;">
      <p>SICOES Monitor · Bolivia · Solo para uso autorizado</p>
      <p style="margin-top:4px;">Enviado automáticamente a las 8:00 AM hora Bolivia</p>
    </div>
  </div>
</body>
</html>`;
}
