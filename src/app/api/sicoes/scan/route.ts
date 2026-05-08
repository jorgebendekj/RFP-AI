import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/instantAdmin";
import { id } from "@instantdb/admin";

export async function POST(req: NextRequest) {
  // Lazy import to avoid build-time env var validation
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

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

    const keywordsList = Array.isArray(keywords) ? keywords : [];
    const deptFilter = department
      ? `Filtrar principalmente por departamento: ${department}.`
      : "Todos los departamentos de Bolivia.";

    const prompt = `Eres un experto en contrataciones estatales de Bolivia. Tu tarea es analizar el portal SICOES (Sistema de Contrataciones del Estado) y encontrar licitaciones relevantes para una empresa de tipo "${companyType}".

Palabras clave de interés: ${keywordsList.join(", ")}.
${deptFilter}

Simula una búsqueda realista en SICOES (sicoes.gob.bo) y genera una lista de licitaciones plausibles actualmente publicadas en el portal. Basa los datos en el tipo real de licitaciones que aparecen en SICOES para empresas de ${companyType} en Bolivia, ${new Date().toLocaleDateString("es-BO", { month: "long", year: "numeric" })}.

Devuelve ÚNICAMENTE un JSON válido con esta estructura exacta:
{
  "tenders": [
    {
      "id": "uuid-unico",
      "codigo": "CUCE-2026-...",
      "descripcion": "descripción detallada de la licitación",
      "entidad": "nombre de la entidad pública convocante",
      "monto": "Bs. X.XXX.XXX,00",
      "fecha": "DD/MM/YYYY",
      "departamento": "departamento de Bolivia",
      "tipo": "ANPE|DBC|CD|LPE",
      "relevancia": número del 0 al 100,
      "justificacion": "Por qué esta licitación es relevante para el perfil de la empresa",
      "url": "https://sicoes.gob.bo/portal/contrataciones/busqueda/convocatorias.php?tipo=1"
    }
  ],
  "summary": "Resumen ejecutivo de los hallazgos principales y recomendaciones de prioridad"
}

Genera entre 6 y 12 licitaciones relevantes. La relevancia debe reflejar qué tan bien encaja con el perfil (0-100). Solo responde con el JSON, sin texto adicional.`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    let parsed: { tenders: unknown[]; summary: string };
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text) as {
        tenders: unknown[];
        summary: string;
      };
    } catch {
      return NextResponse.json(
        { error: "Error al parsear respuesta de IA" },
        { status: 500 }
      );
    }

    const result = { ...parsed, scannedAt: new Date().toISOString() };

    // Store scan in InstantDB (non-critical)
    try {
      await adminDb.transact(
        adminDb.tx.siceosScans[id()].update({
          userId,
          userEmail: userEmail || "",
          status: "done",
          tenders: parsed.tenders,
          summary: parsed.summary,
          createdAt: Date.now(),
          companyType,
        })
      );
    } catch {
      // Non-critical: continue even if storage fails
    }

    return NextResponse.json(result);
  } catch (e: unknown) {
    console.error("[sicoes/scan]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error interno" },
      { status: 500 }
    );
  }
}
