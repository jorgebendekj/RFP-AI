import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/instantAdmin";
import { id } from "@instantdb/admin";

const SICOES_BASE = "https://sicoes.gob.bo";
const SICOES_INDEX = `${SICOES_BASE}/portal/index.php`;
const SICOES_SEARCH = `${SICOES_BASE}/portal/contrataciones/busqueda/convocatorias.php`;
const SICOES_OPERACION = `${SICOES_BASE}/portal/contrataciones/operacion.php`;

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

// ─── Browser-like headers ─────────────────────────────────────────────────────

const BROWSER_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "es-BO,es;q=0.9,en-US;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
  "Upgrade-Insecure-Requests": "1",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Cache-Control": "max-age=0",
};

// ─── Cookie helpers ───────────────────────────────────────────────────────────

function parseCookieHeader(raw: string): string {
  return raw
    .split(/,(?=\s*\w+=)/)
    .map((c) => c.split(";")[0].trim())
    .filter(Boolean)
    .join("; ");
}

function mergeCookies(existing: string, incoming: string): string {
  const map = new Map<string, string>();
  for (const part of (existing + "; " + incoming).split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const k = part.slice(0, eq).trim();
    const v = part.slice(eq + 1).trim();
    if (k) map.set(k, v);
  }
  return Array.from(map.entries())
    .map(([k, v]) => (v ? `${k}=${v}` : k))
    .join("; ");
}

function extractToken(html: string): string {
  const m =
    html.match(/id=["']token["'][^>]*value=["']([^"']+)["']/i) ||
    html.match(/name=["']token["'][^>]*value=["']([^"']+)["']/i) ||
    html.match(/value=["']([^"']+)["'][^>]*(?:id|name)=["']token["']/i);
  return m ? m[1] : "";
}

// ─── Session bootstrap ────────────────────────────────────────────────────────

interface SicoesSession {
  cookie: string;
  token: string;
  convUrl: string;
}

/**
 * Establishes a SICOES session:
 * 1. GET index.php → PHPSESSID + token (from hidden input)
 * 2. GET convocatorias.php?token=... → page-specific token for form submission
 *
 * NOTE: From cloud IPs (Vercel/AWS) Cloudflare Turnstile blocks session
 * establishment → operacion.php redirects 302. This is handled by ScrapingBee fallback.
 */
async function bootstrapSession(): Promise<SicoesSession> {
  let cookie = "";
  let token = "";

  try {
    // Step 1: GET index.php — PHPSESSID + token hidden input
    const r1 = await fetch(SICOES_INDEX, {
      headers: BROWSER_HEADERS,
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    const sc1 = r1.headers.get("set-cookie");
    if (sc1) cookie = parseCookieHeader(sc1);
    const html1 = await r1.text();
    token = extractToken(html1);

    if (!token) {
      console.warn("[sicoes] No token found in index.php");
      return { cookie, token: "", convUrl: `${SICOES_SEARCH}?tipo=convNacional` };
    }

    // Step 2: GET convocatorias page — get page-specific form token
    const convUrl1 = `${SICOES_SEARCH}?tipo=convNacional&token=${token}`;
    const r2 = await fetch(convUrl1, {
      headers: {
        ...BROWSER_HEADERS,
        "Sec-Fetch-Site": "same-origin",
        Cookie: cookie,
        Referer: SICOES_INDEX,
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    const sc2 = r2.headers.get("set-cookie");
    if (sc2) cookie = mergeCookies(cookie, parseCookieHeader(sc2));
    const html2 = await r2.text();
    const token2 = extractToken(html2);
    if (token2) token = token2;

    const convUrl = `${SICOES_SEARCH}?tipo=convNacional&token=${token}`;
    console.log(
      `[sicoes] session OK | token=${token.slice(0, 8)}... | cookie=${cookie.length}c`
    );
    return { cookie, token, convUrl };
  } catch (err) {
    console.error("[sicoes] bootstrap error:", err);
    return { cookie, token, convUrl: `${SICOES_SEARCH}?tipo=convNacional` };
  }
}

// ─── Direct AJAX scrape (works from residential IPs) ─────────────────────────

/**
 * Calls SICOES operacion.php directly (DataTables AJAX endpoint).
 * Requires a valid PHP session with Cloudflare Turnstile verified.
 * Works from residential IPs; blocked from cloud providers (Vercel/AWS).
 *
 * CORRECT field names discovered from the SICOES form HTML:
 *  - objetoContrato (NOT objeto_contratacion)
 *  - r1=11 for "Sólo Vigentes" (NOT ver=1)
 *  - bienes=B, obras=O, servicios=S, consultoria=C (NOT "on")
 *  - operacion=convNacional (required by AJAX handler)
 */
async function searchDirect(
  keyword: string,
  session: SicoesSession
): Promise<{ data: unknown[] } | null> {
  try {
    const body = new URLSearchParams({
      token: session.token,
      entidad: "",
      objetoContrato: keyword,
      publicacionDesde: "",
      publicacionHasta: "",
      presentacionPropuestasDesde: "",
      presentacionPropuestasHasta: "",
      cuce1: "",
      cuce2: "",
      cuce3: "",
      cuce4: "",
      cuce5: "",
      cuce6: "",
      r1: "11",         // Sólo Vigentes
      subasta: "",       // Todos
      bienes: "B",
      obras: "O",
      servicios: "S",
      consultoria: "C",
      tipo: "Simple",
      operacion: "convNacional",
      nroRegistros: "100",
      draw: "1",
      start: "0",
      length: "100",
      captcha: "",
      autocorrector: "",
    });

    const resp = await fetch(SICOES_OPERACION, {
      method: "POST",
      headers: {
        ...BROWSER_HEADERS,
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json, text/javascript, */*; q=0.01",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
        Origin: SICOES_BASE,
        Referer: session.convUrl,
        Cookie: session.cookie,
      },
      body: body.toString(),
      redirect: "manual", // Don't follow 302 — detect failure
      signal: AbortSignal.timeout(25000),
    });

    // 302 = session invalid (Cloudflare blocked) — fallback to ScrapingBee
    if (resp.status === 302 || resp.status === 301) {
      console.warn(`[sicoes] direct search blocked (${resp.status}) for "${keyword}"`);
      return null;
    }

    if (!resp.ok) {
      console.warn(`[sicoes] direct search HTTP ${resp.status} for "${keyword}"`);
      return null;
    }

    const text = await resp.text();
    console.log(`[sicoes] direct "${keyword}" → ${text.length} bytes`);

    try {
      const json = JSON.parse(text) as { data?: unknown[] };
      return { data: json.data ?? [] };
    } catch {
      // Maybe returned HTML — try to find CUCEs
      const cuces = (text.match(/\d{2}-\d{3,6}-\d{2}-\d{5,9}-\d+-\d+/g) || []).length;
      console.log(`[sicoes] direct "${keyword}" → HTML fallback, ${cuces} CUCE-like matches`);
      return null; // Let ScrapingBee try
    }
  } catch (err) {
    console.error(`[sicoes] direct "${keyword}" error:`, err);
    return null;
  }
}

// ─── ScrapingBee fallback (handles Cloudflare Turnstile) ─────────────────────

/**
 * Uses ScrapingBee to render SICOES in a real Chrome browser.
 * The JS scenario:
 *  1. Fills the search form with the keyword
 *  2. Makes XHR calls to operacion.php for ALL keywords in one browser session
 *  3. Returns combined JSON results
 *
 * Set SCRAPINGBEE_API_KEY in env vars to enable.
 * Sign up: https://www.scrapingbee.com (1000 free credits)
 * Cost: 25 credits per JS render; 5 keywords = 25 credits per full scan.
 */
async function scrapeWithScrapingBee(
  keywords: string[],
  apiKey: string
): Promise<RawTender[]> {
  try {
    // Build JS that runs inside the browser session (Turnstile already solved)
    // Makes synchronous XHR to operacion.php for each keyword and collects HTML rows
    const keywordsJson = JSON.stringify(keywords.slice(0, 5));

    const jsScenario = {
      instructions: [
        // Wait for page to fully load (Turnstile solves itself)
        { wait_for: { selector: "input[name='objetoContrato']" } },
        { wait: 2000 },
        // Execute XHR searches for all keywords and put results in page body
        {
          evaluate: `
(function() {
  var keywords = ${keywordsJson};
  var results = [];
  keywords.forEach(function(kw) {
    try {
      var token = document.querySelector('input[name="token"]');
      var tokenVal = token ? token.value : '';
      var body = [
        'token=' + encodeURIComponent(tokenVal),
        'objetoContrato=' + encodeURIComponent(kw),
        'r1=11', 'subasta=', 'bienes=B', 'obras=O', 'servicios=S', 'consultoria=C',
        'tipo=Simple', 'operacion=convNacional',
        'nroRegistros=100', 'draw=1', 'start=0', 'length=100',
        'entidad=', 'captcha=', 'autocorrector='
      ].join('&');
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/portal/contrataciones/operacion.php', false);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.send(body);
      if (xhr.status === 200) {
        try {
          var parsed = JSON.parse(xhr.responseText);
          results.push({ keyword: kw, data: parsed.data || [], total: parsed.recordsTotal });
        } catch(e) {
          results.push({ keyword: kw, data: [], error: 'parse_error' });
        }
      } else {
        results.push({ keyword: kw, data: [], error: 'http_' + xhr.status });
      }
    } catch(e) {
      results.push({ keyword: kw, data: [], error: String(e) });
    }
  });
  document.body.innerHTML = '<pre id="__sb_results__">' + JSON.stringify(results) + '</pre>';
})();
          `.trim(),
        },
        { wait: 1000 },
      ],
    };

    const params = new URLSearchParams({
      api_key: apiKey,
      url: `${SICOES_SEARCH}?tipo=convNacional`,
      render_js: "true",
      wait: "1000",
      premium_proxy: "true",
      js_scenario: JSON.stringify(jsScenario),
      timeout: "50000",
    });

    console.log(`[sb] Calling ScrapingBee for ${keywords.length} keywords...`);
    const resp = await fetch(`https://app.scrapingbee.com/api/v1/?${params}`, {
      signal: AbortSignal.timeout(55000),
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      console.error(`[sb] ScrapingBee error ${resp.status}: ${errText.slice(0, 200)}`);
      return [];
    }

    const html = await resp.text();
    console.log(`[sb] Response: ${html.length} bytes`);

    // Extract our JSON result from the page
    const jsonMatch = html.match(/<pre[^>]*id=["']__sb_results__["'][^>]*>([\s\S]*?)<\/pre>/i);
    if (!jsonMatch) {
      console.warn("[sb] Could not find __sb_results__ in response");
      // Fallback: try to parse the HTML directly (form was submitted normally)
      return parseSICOESTable(html);
    }

    const allResults = JSON.parse(jsonMatch[1]) as Array<{
      keyword: string;
      data: unknown[];
      total?: number;
      error?: string;
    }>;

    const seen = new Set<string>();
    const tenders: RawTender[] = [];

    for (const result of allResults) {
      console.log(
        `[sb] "${result.keyword}" → ${result.data.length} rows | total=${result.total} | err=${result.error || "none"}`
      );
      for (const row of result.data) {
        const tender = parseOperacionRow(row, result.keyword);
        if (tender && !seen.has(tender.cuce) && isVigente(tender.estado)) {
          seen.add(tender.cuce);
          tenders.push(tender);
        }
      }
    }

    console.log(`[sb] Total unique vigente tenders: ${tenders.length}`);
    return tenders;
  } catch (err) {
    console.error("[sb] ScrapingBee error:", err);
    return [];
  }
}

/**
 * Parse a row from operacion.php JSON response.
 * The DataTables data array may contain HTML strings for each cell.
 * We extract plain text and URLs from them.
 */
function parseOperacionRow(row: unknown, _keyword: string): RawTender | null {
  // row can be array-of-strings or object
  let cells: string[] = [];

  if (Array.isArray(row)) {
    cells = row.map((c) => String(c ?? ""));
  } else if (row && typeof row === "object") {
    cells = Object.values(row as Record<string, unknown>).map((c) => String(c ?? ""));
  } else {
    return null;
  }

  if (cells.length < 9) return null;

  // Find CUCE (matches the pattern in any cell)
  let cuceRaw = "";
  let cuceHref = "";
  for (const cell of cells.slice(0, 3)) {
    const cuceMatch = cell.match(/(\d{2}-\d{3,6}-\d{2}-\d{5,9}-\d+-\d+)/);
    if (cuceMatch) {
      cuceRaw = cuceMatch[1];
      const hrefMatch = cell.match(/href=["']([^"']+)["']/i);
      if (hrefMatch) cuceHref = hrefMatch[1];
      break;
    }
  }

  if (!cuceRaw || !cuceRaw.match(/^\d{2}-\d{3,6}-\d{2}-\d{5,9}-\d+-\d+$/)) return null;

  const tenderUrl = cuceHref ? resolveUrl(cuceHref) : SICOES_SEARCH;

  // Find form100 URL (usually in a cell with "FORM 100")
  let form100Url: string | undefined;
  for (const cell of cells) {
    if (cell.includes("FORM 100") || cell.includes("formulario")) {
      const hm = cell.match(/href=["']([^"']+)["']/i);
      if (hm) { form100Url = resolveUrl(hm[1]); break; }
    }
  }

  return {
    cuce: cuceRaw,
    entidad: htmlText(cells[1] ?? ""),
    tipoContratacion: htmlText(cells[2] ?? ""),
    modalidad: htmlText(cells[3] ?? ""),
    objeto: htmlText(cells[4] ?? ""),
    fechaPublicacion: htmlText(cells[6] ?? ""),
    fechaPresentacion: htmlText(cells[7] ?? ""),
    estado: htmlText(cells[8] ?? ""),
    url: tenderUrl,
    form100Url,
  };
}

// ─── HTML table parser (fallback for rendered pages) ─────────────────────────

function parseSICOESTable(html: string): RawTender[] {
  const tenders: RawTender[] = [];
  const clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");

  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch: RegExpExecArray | null;

  while ((trMatch = trRegex.exec(clean)) !== null) {
    const rowHtml = trMatch[1];
    const cells: string[] = [];
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let tdMatch: RegExpExecArray | null;
    while ((tdMatch = tdRegex.exec(rowHtml)) !== null) {
      cells.push(tdMatch[1]);
    }

    if (cells.length < 9) continue;
    const cuceRaw = htmlText(cells[0]);
    if (!cuceRaw.match(/^\d{2}-\d{3,6}-\d{2}-\d{5,9}-\d+-\d+$/)) continue;

    const cuceHref = extractHref(cells[0]);
    const tenderUrl = cuceHref ? resolveUrl(cuceHref) : SICOES_SEARCH;
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

    if (tender.objeto && tender.entidad) tenders.push(tender);
  }

  return tenders;
}

// ─── Main SICOES scraper ──────────────────────────────────────────────────────

async function scrapeSICOES(
  keywords: string[],
  department?: string
): Promise<RawTender[]> {
  const sbKey = process.env.SCRAPINGBEE_API_KEY;
  const seen = new Set<string>();
  let allTenders: RawTender[] = [];

  if (sbKey) {
    // ── ScrapingBee path: all keywords in one browser session ──────────────
    allTenders = await scrapeWithScrapingBee(keywords, sbKey);
  } else {
    // ── Direct path: works from residential IPs (local dev) ────────────────
    console.log("[sicoes] ScrapingBee not configured — trying direct scraping");
    const session = await bootstrapSession();
    const searchTerms = keywords.slice(0, 5);

    for (const term of searchTerms) {
      const result = await searchDirect(term, session);
      if (result === null) {
        // Session invalid (Cloudflare blocked) — skip remaining keywords
        console.warn("[sicoes] Direct scraping blocked — set SCRAPINGBEE_API_KEY for Vercel");
        break;
      }
      // result.data could be DataTables JSON rows — parse them
      for (const row of result.data) {
        const t = parseOperacionRow(row, term);
        if (t && !seen.has(t.cuce) && isVigente(t.estado)) {
          seen.add(t.cuce);
          allTenders.push(t);
        }
      }
    }
  }

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

// ─── FORM 100 Monto Fetcher ───────────────────────────────────────────────────

async function fetchMonto(url: string): Promise<string | undefined> {
  try {
    const resp = await fetch(url, {
      headers: BROWSER_HEADERS,
      signal: AbortSignal.timeout(8000),
    });
    if (!resp.ok) return undefined;
    const html = await resp.text();
    const clean = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "");

    const labelPatterns = [
      /precio\s+referencial[^<\d]*(Bs\.?\s*[\d.,]+)/i,
      /monto\s+base[^<\d]*(Bs\.?\s*[\d.,]+)/i,
      /presupuesto[^<\d]*(Bs\.?\s*[\d.,]+)/i,
    ];
    for (const p of labelPatterns) {
      const m = clean.match(p);
      if (m?.[1]) return `Bs. ${m[1].replace(/Bs\.?\s*/i, "").trim()}`;
    }

    const bsPattern = /Bs\.?\s*([\d.]+,\d{2})/g;
    const amounts: string[] = [];
    let bm: RegExpExecArray | null;
    while ((bm = bsPattern.exec(clean)) !== null) amounts.push(bm[1]);
    if (amounts.length > 0) {
      const largest = amounts
        .map((a) => ({
          raw: a,
          num: parseFloat(a.replace(/\./g, "").replace(",", ".")),
        }))
        .sort((a, b) => b.num - a.num)[0];
      return `Bs. ${largest.raw}`;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

// ─── AI Relevance Scoring ─────────────────────────────────────────────────────

type Anthropic = InstanceType<Awaited<typeof import("@anthropic-ai/sdk")>["default"]>;

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

// ─── Route Handler ────────────────────────────────────────────────────────────

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

    // ── Phase 1: Scrape real SICOES data ──────────────────────────────────────
    const rawTenders = await scrapeSICOES(keywords, department);

    if (rawTenders.length === 0) {
      const sbConfigured = !!process.env.SCRAPINGBEE_API_KEY;
      return NextResponse.json(
        {
          error: sbConfigured
            ? "No se encontraron licitaciones VIGENTES en SICOES para las palabras clave configuradas. " +
              "Intentá con otras palabras clave."
            : "No se encontraron licitaciones. " +
              "SICOES requiere ScrapingBee para funcionar desde servidores cloud (Vercel). " +
              "Configurá SCRAPINGBEE_API_KEY en las variables de entorno de Vercel. " +
              "Registro gratuito: https://www.scrapingbee.com",
          source: "SICOES · sicoes.gob.bo",
        },
        { status: 404 }
      );
    }

    // ── Phase 2: Score with Claude Haiku ──────────────────────────────────────
    const { scored, summary } = await scoreRelevance(
      anthropic as unknown as Anthropic,
      rawTenders,
      companyType,
      keywords
    );

    // ── Phase 2.5: Fetch FORM 100 montos for top tenders ─────────────────────
    const topCuces = new Set(
      [...scored]
        .sort((a, b) => b.relevancia - a.relevancia)
        .slice(0, 10)
        .map((s) => s.cuce)
    );
    const montoMap = new Map<string, string>();
    await Promise.all(
      rawTenders
        .filter((t) => topCuces.has(t.cuce) && (t.form100Url || t.url))
        .map(async (t) => {
          const fetchUrl = t.form100Url ?? t.url;
          if (!fetchUrl || fetchUrl.includes("convocatorias.php")) return;
          const monto = await fetchMonto(fetchUrl);
          if (monto) montoMap.set(t.cuce, monto);
        })
    );

    // ── Phase 3: Merge & return ────────────────────────────────────────────────
    const tenders = rawTenders
      .map((t, i) => {
        const score = scored.find((s) => s.cuce === t.cuce);
        return {
          id: `${t.cuce.replace(/-/g, "")}-${i}`,
          codigo: t.cuce,
          descripcion: t.objeto,
          entidad: t.entidad,
          monto: montoMap.get(t.cuce),
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
      totalFound: rawTenders.length,
      source: "SICOES · sicoes.gob.bo",
    };

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
