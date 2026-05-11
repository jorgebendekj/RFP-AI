/**
 * SICOES Scraper — runs daily via GitHub Actions (or locally).
 *
 * Uses Playwright (real Chromium) to bypass Cloudflare Turnstile that blocks
 * server-side fetches. Scrapes all unique keywords across all configured users,
 * stores results in InstantDB → the Vercel /api/sicoes/scan endpoint reads from
 * this cache to give users instant filtered+scored results.
 *
 * Run locally:
 *   INSTANTDB_ADMIN_TOKEN=xxx npx tsx scripts/scrape-sicoes.ts
 *
 * Run in CI:
 *   See .github/workflows/scrape-sicoes.yml
 */

import { chromium, type Page, type Response as PWResponse } from "playwright";
import { init, id } from "@instantdb/admin";

const APP_ID = "5fe5517c-1f4b-400c-ab57-c3300f8c8ced";
const SICOES_BASE = "https://sicoes.gob.bo";
const SICOES_URL = `${SICOES_BASE}/portal/contrataciones/busqueda/convocatorias.php?tipo=convNacional`;

// Default keywords covering all 8 supported company types — guarantees the
// cache is populated even before any user has configured their settings.
const DEFAULT_KEYWORDS = [
  // Tecnología
  "software", "sistema informatico", "desarrollo web", "aplicacion", "hardware",
  // Construcción
  "construccion", "obra civil", "infraestructura", "edificio", "carretera",
  // Salud
  "salud", "medicamento", "equipo medico", "hospital",
  // Educación
  "educacion", "capacitacion", "formacion", "material didactico",
  // Energía
  "energia", "panel solar", "electrico", "iluminacion",
  // Logística
  "logistica", "transporte", "vehiculo", "combustible",
  // Consultoría
  "consultoria", "auditoria", "asesoria", "estudio",
];

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

// ─── InstantDB setup ────────────────────────────────────────────────────────

const ADMIN_TOKEN = process.env.INSTANTDB_ADMIN_TOKEN;
if (!ADMIN_TOKEN) {
  console.error("[scraper] FATAL: INSTANTDB_ADMIN_TOKEN env var is required");
  process.exit(1);
}
const db = init({ appId: APP_ID, adminToken: ADMIN_TOKEN });

// ─── HTML parsing helpers (mirrors src/app/api/sicoes/scan/route.ts) ────────

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
    while ((tdMatch = tdRegex.exec(rowHtml)) !== null) cells.push(tdMatch[1]);

    if (cells.length < 9) continue;
    const cuceRaw = htmlText(cells[0]);
    if (!cuceRaw.match(/^\d{2}-\d{3,6}-\d{2}-\d{5,9}-\d+-\d+$/)) continue;

    const cuceHref = extractHref(cells[0]);
    const tenderUrl = cuceHref ? resolveUrl(cuceHref) : SICOES_URL;
    const form100Url = cells[10] ? extractHref(cells[10]) || undefined : undefined;

    tenders.push({
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
    });
  }
  return tenders;
}

// ─── Keyword aggregation from InstantDB users ───────────────────────────────

async function getAllKeywords(): Promise<string[]> {
  const set = new Set<string>(DEFAULT_KEYWORDS.map((k) => k.toLowerCase()));
  try {
    const res = await db.query({ siceosSettings: {} });
    const settings = (res.siceosSettings as Array<{ keywords?: string[] }>) || [];
    settings.forEach((s) =>
      (s.keywords || []).forEach((k) => {
        if (k && k.length > 1) set.add(k.toLowerCase().trim());
      })
    );
    console.log(`[scraper] Aggregated ${set.size} unique keywords from ${settings.length} user(s)`);
  } catch (e) {
    console.warn("[scraper] Could not load user keywords, using defaults only:", e);
  }
  return Array.from(set);
}

// ─── Single-keyword search via Playwright ───────────────────────────────────

async function searchKeyword(page: Page, keyword: string): Promise<RawTender[]> {
  // Clear previous search
  await page.fill('input[name="objetoContrato"]', "");
  await page.fill('input[name="objetoContrato"]', keyword);

  // Ensure "Sólo Vigentes" radio is selected (r1=11)
  await page.evaluate(() => {
    const radio = document.querySelector('input[name="r1"][value="11"]') as HTMLInputElement | null;
    if (radio && !radio.checked) radio.click();
  });

  // Click search button — busqueda.js intercepts and triggers DataTables AJAX
  await Promise.all([
    page.waitForResponse(
      (r: PWResponse) => r.url().includes("/operacion.php") && r.request().method() === "POST",
      { timeout: 20000 }
    ).catch(() => null),
    page.click(".busquedaForm:has-text('Buscar')").catch(() => page.click(".busquedaForm")),
  ]);

  // Give DataTables time to render the rows into the DOM
  await page.waitForTimeout(2500);

  const html = await page.content();
  return parseSICOESTable(html);
}

// ─── Main scrape orchestration ──────────────────────────────────────────────

async function main() {
  const t0 = Date.now();
  console.log(`[scraper] Starting at ${new Date().toISOString()}`);

  const keywords = await getAllKeywords();

  const browser = await chromium.launch({
    headless: true,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
  });

  const allTenders = new Map<string, RawTender>();
  let keywordsSucceeded = 0;
  let keywordsFailed = 0;

  try {
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      viewport: { width: 1920, height: 1080 },
      locale: "es-BO",
      timezoneId: "America/La_Paz",
    });

    const page = await context.newPage();

    console.log(`[scraper] Navigating to ${SICOES_URL}`);
    await page.goto(SICOES_URL, { waitUntil: "domcontentloaded", timeout: 60000 });

    // Wait for the search form (which means the page loaded past Turnstile)
    await page.waitForSelector('input[name="objetoContrato"]', { timeout: 45000 });
    console.log("[scraper] Search form ready, waiting for Turnstile + initial AJAX...");

    // Initial listarBusqueda() runs on document ready — wait for it to settle
    await page.waitForTimeout(6000);

    for (const keyword of keywords) {
      try {
        const tenders = await searchKeyword(page, keyword);
        let added = 0;
        for (const t of tenders) {
          if (!isVigente(t.estado)) continue;
          if (allTenders.has(t.cuce)) continue;
          allTenders.set(t.cuce, t);
          added++;
        }
        console.log(`[scraper] "${keyword}" → ${tenders.length} rows, +${added} new`);
        keywordsSucceeded++;
      } catch (err) {
        console.error(`[scraper] "${keyword}" failed:`, err instanceof Error ? err.message : err);
        keywordsFailed++;
      }
    }
  } finally {
    await browser.close();
  }

  const tendersArray = Array.from(allTenders.values());
  console.log(`[scraper] Scrape complete: ${tendersArray.length} unique vigente tenders`);
  console.log(`[scraper] Keywords succeeded=${keywordsSucceeded} failed=${keywordsFailed}`);

  if (tendersArray.length === 0) {
    console.error("[scraper] No tenders scraped — aborting DB update to preserve previous cache");
    process.exit(1);
  }

  // ── Replace cache in InstantDB ────────────────────────────────────────────
  console.log("[scraper] Updating InstantDB cache...");
  try {
    const oldRes = await db.query({ siceosTenders: {} });
    const oldTenders = (oldRes.siceosTenders as Array<{ id: string }>) || [];
    if (oldTenders.length > 0) {
      // Delete in batches to avoid huge transactions
      const batchSize = 100;
      for (let i = 0; i < oldTenders.length; i += batchSize) {
        const batch = oldTenders.slice(i, i + batchSize);
        await db.transact(batch.map((t) => db.tx.siceosTenders[t.id].delete()));
      }
      console.log(`[scraper] Cleared ${oldTenders.length} old cached tenders`);
    }

    // Insert new tenders in batches
    const scrapedAt = Date.now();
    const txOps = tendersArray.map((t) =>
      db.tx.siceosTenders[id()].update({
        cuce: t.cuce,
        entidad: t.entidad,
        tipoContratacion: t.tipoContratacion,
        modalidad: t.modalidad,
        objeto: t.objeto,
        fechaPublicacion: t.fechaPublicacion,
        fechaPresentacion: t.fechaPresentacion,
        estado: t.estado,
        url: t.url,
        form100Url: t.form100Url || "",
        scrapedAt,
      })
    );
    const insertBatch = 50;
    for (let i = 0; i < txOps.length; i += insertBatch) {
      await db.transact(txOps.slice(i, i + insertBatch));
    }
    console.log(`[scraper] Inserted ${tendersArray.length} new cached tenders`);

    // Update metadata (single record, upsert pattern)
    const metaRes = await db.query({ siceosScrapeMetadata: {} });
    const meta = (metaRes.siceosScrapeMetadata as Array<{ id: string }>) || [];
    const metadataPayload = {
      lastRun: scrapedAt,
      tenderCount: tendersArray.length,
      keywordCount: keywords.length,
      keywordsSucceeded,
      keywordsFailed,
      durationMs: Date.now() - t0,
    };
    if (meta.length > 0) {
      await db.transact(db.tx.siceosScrapeMetadata[meta[0].id].update(metadataPayload));
    } else {
      await db.transact(db.tx.siceosScrapeMetadata[id()].update(metadataPayload));
    }
  } catch (err) {
    console.error("[scraper] InstantDB update failed:", err);
    process.exit(1);
  }

  console.log(`[scraper] DONE in ${Math.round((Date.now() - t0) / 1000)}s`);
}

main().catch((err) => {
  console.error("[scraper] Uncaught fatal:", err);
  process.exit(1);
});
