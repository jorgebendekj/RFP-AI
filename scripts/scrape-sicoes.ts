/**
 * SICOES Scraper — runs daily via GitHub Actions (or locally).
 *
 * Uses `patchright` (a Playwright fork with anti-detection patches) to bypass
 * Cloudflare Turnstile that blocks server-side fetches AND vanilla Playwright.
 * Scrapes all unique keywords across all configured users, stores results in
 * InstantDB → the Vercel /api/sicoes/scan endpoint reads from this cache for
 * instant filtered+scored results.
 *
 * Run locally:
 *   $env:INSTANTDB_ADMIN_TOKEN = "xxx"; npx tsx scripts/scrape-sicoes.ts
 *
 * Run in CI: see .github/workflows/scrape-sicoes.yml
 */

import { chromium, type Page, type Response as PWResponse } from "patchright";
import { init, id } from "@instantdb/admin";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const APP_ID = "5fe5517c-1f4b-400c-ab57-c3300f8c8ced";
const SICOES_BASE = "https://sicoes.gob.bo";
const SICOES_URL = `${SICOES_BASE}/portal/contrataciones/busqueda/convocatorias.php?tipo=convNacional`;

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

const ADMIN_TOKEN = process.env.INSTANTDB_ADMIN_TOKEN;
if (!ADMIN_TOKEN) {
  console.error("[scraper] FATAL: INSTANTDB_ADMIN_TOKEN env var is required");
  process.exit(1);
}
const db = init({ appId: APP_ID, adminToken: ADMIN_TOKEN });

// ─── Debug helpers ──────────────────────────────────────────────────────────

const DEBUG_DIR = path.join(process.cwd(), "scraper-debug");

async function ensureDebugDir() {
  await fs.mkdir(DEBUG_DIR, { recursive: true }).catch(() => {});
}

async function dumpDebug(page: Page, name: string) {
  try {
    await ensureDebugDir();
    const url = page.url();
    const title = await page.title().catch(() => "");
    const html = await page.content().catch(() => "");
    await page.screenshot({
      path: path.join(DEBUG_DIR, `${name}.png`),
      fullPage: true,
    }).catch(() => {});
    await fs.writeFile(path.join(DEBUG_DIR, `${name}.html`), html);
    await fs.writeFile(
      path.join(DEBUG_DIR, `${name}.txt`),
      `URL: ${url}\nTITLE: ${title}\n\nFirst 500 chars of body:\n${html.slice(0, 500)}`
    );
    console.log(`[scraper] DEBUG dumped to scraper-debug/${name}.*`);
    console.log(`[scraper] DEBUG url=${url} title="${title}" html_len=${html.length}`);
  } catch (e) {
    console.error("[scraper] dumpDebug failed:", e);
  }
}

// ─── HTML parsing ───────────────────────────────────────────────────────────

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

// ─── Keyword aggregation ────────────────────────────────────────────────────

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

// ─── Single-keyword search ──────────────────────────────────────────────────

async function searchKeyword(page: Page, keyword: string): Promise<RawTender[]> {
  await page.fill('input[name="objetoContrato"]', "");
  await page.fill('input[name="objetoContrato"]', keyword);

  await page.evaluate(() => {
    const radio = document.querySelector('input[name="r1"][value="11"]') as HTMLInputElement | null;
    if (radio && !radio.checked) radio.click();
  });

  await Promise.all([
    page.waitForResponse(
      (r: PWResponse) => r.url().includes("/operacion.php") && r.request().method() === "POST",
      { timeout: 20000 }
    ).catch(() => null),
    page.click(".busquedaForm").catch(() => null),
  ]);

  await page.waitForTimeout(2500);
  const html = await page.content();
  return parseSICOESTable(html);
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const t0 = Date.now();
  console.log(`[scraper] Starting at ${new Date().toISOString()}`);
  console.log(`[scraper] Using patchright (Playwright with anti-detection patches)`);

  const keywords = await getAllKeywords();

  // patchright is a drop-in replacement for playwright with stealth patches:
  // - Removes navigator.webdriver
  // - Patches Chrome runtime detection
  // - Realistic user-agent and headers
  // - Bypasses most Cloudflare bot checks
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--disable-gpu",
    ],
  });

  const allTenders = new Map<string, RawTender>();
  let keywordsSucceeded = 0;
  let keywordsFailed = 0;

  let page: Page | null = null;
  try {
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      viewport: { width: 1920, height: 1080 },
      locale: "es-BO",
      timezoneId: "America/La_Paz",
      extraHTTPHeaders: {
        "Accept-Language": "es-BO,es;q=0.9,en;q=0.8",
      },
    });

    page = await context.newPage();

    // ── Step 1: Land on index.php to get a valid session + token ─────────────
    // SICOES will redirect any direct access to convocatorias.php → index.php
    // unless we include a valid token in the URL. The token lives in a hidden
    // <input id="token"> on every page (see SICOES portal.js → irLink()).
    console.log(`[scraper] Step 1: Navigating to portal index to obtain token...`);
    const indexResp = await page.goto(`${SICOES_BASE}/portal/index.php`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    console.log(`[scraper] index.php → status=${indexResp?.status()} url=${page.url()}`);

    // Give Cloudflare Turnstile time to solve invisibly
    console.log("[scraper] Waiting 6s for Turnstile to solve...");
    await page.waitForTimeout(6000);

    // Extract the token from the hidden input
    const token = await page.evaluate(() => {
      const el = document.querySelector('input#token, input[name="token"]') as HTMLInputElement | null;
      return el?.value || "";
    });

    if (!token || token.length < 20) {
      console.error(`[scraper] ✗ Could not extract token from index.php (got: "${token}")`);
      console.error("[scraper] Cloudflare may have served a challenge page instead of the real index.");
      await dumpDebug(page, "01-no-token");
      throw new Error("Token extraction failed");
    }
    console.log(`[scraper] ✓ Token extracted: ${token.slice(0, 16)}...`);

    // ── Step 2: Navigate to convocatorias.php WITH the token ─────────────────
    const searchUrl = `${SICOES_URL}&token=${token}`;
    console.log(`[scraper] Step 2: Navigating to search page with token...`);
    const convResp = await page.goto(searchUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    console.log(`[scraper] convocatorias.php → status=${convResp?.status()} url=${page.url()}`);

    // If we got redirected back to index.php, the token didn't work
    if (page.url().includes("/index.php")) {
      console.error("[scraper] ✗ Redirected back to index.php — token rejected by server");
      await dumpDebug(page, "02-token-rejected");
      throw new Error("Server rejected the token");
    }

    // Wait for the search form to be ready
    try {
      await page.waitForSelector('input[name="objetoContrato"]', { timeout: 30000 });
      console.log(`[scraper] ✓ Search form detected. URL: ${page.url()}`);
    } catch (selectorErr) {
      console.error("[scraper] ✗ Search form did NOT appear within 30s.");
      await dumpDebug(page, "02-form-not-found");
      throw selectorErr;
    }

    // Initial listarBusqueda() AJAX needs to settle
    console.log("[scraper] Waiting 5s for initial AJAX...");
    await page.waitForTimeout(5000);

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
        if (keywordsFailed === 1) await dumpDebug(page, `02-keyword-fail-${keyword}`);
      }
    }
  } catch (err) {
    console.error("[scraper] Top-level error:", err);
    if (page) await dumpDebug(page, "99-fatal");
    await browser.close();
    process.exit(1);
  } finally {
    await browser.close().catch(() => {});
  }

  const tendersArray = Array.from(allTenders.values());
  console.log(`[scraper] Scrape complete: ${tendersArray.length} unique vigente tenders`);
  console.log(`[scraper] Keywords succeeded=${keywordsSucceeded} failed=${keywordsFailed}`);

  if (tendersArray.length === 0) {
    console.error("[scraper] No tenders scraped — aborting DB update to preserve previous cache");
    process.exit(1);
  }

  // Replace cache
  console.log("[scraper] Updating InstantDB cache...");
  try {
    const oldRes = await db.query({ siceosTenders: {} });
    const oldTenders = (oldRes.siceosTenders as Array<{ id: string }>) || [];
    if (oldTenders.length > 0) {
      const batchSize = 100;
      for (let i = 0; i < oldTenders.length; i += batchSize) {
        const batch = oldTenders.slice(i, i + batchSize);
        await db.transact(batch.map((t) => db.tx.siceosTenders[t.id].delete()));
      }
      console.log(`[scraper] Cleared ${oldTenders.length} old cached tenders`);
    }

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
