# SEO + AI Search Strategy — SICOES Monitor (Bolivia first)

_Date: 2026-10-02. Method: codebase audit + live web searches. Findable (MCP) was not authorized in this session, so no keyword-volume data was pulled; volumes below are qualitative and must be validated (see "Next steps")._

## 1. Market decision: Bolivia first
**Recommendation: Bolivia (confirmed).** Reasons:
1. **Product-market fit is built in.** The scraper, RUPE/ANPE vocabulary, departments and sector presets are all SICOES-specific; no other country is supported.
2. **Clear intent, low-to-medium competition.** Queries like "licitaciones Bolivia", "SICOES convocatorias", "alertas licitaciones Bolivia" are answered today by a handful of small sites (sicoeshoy.bo, licitaciones.com.bo, alertalicitaciones.com, infosiscon.com), none of which are major authorities.
3. **Informational gap.** "Cómo registrarse en el RUPE", "qué es ANPE", "modalidades de contratación" are answered mostly by government PDFs, Scribd, and generic blogs — an opportunity for clear, answer-first guides that AI engines can cite.
4. **Second wave (later):** Peru (SEACE), Paraguay, Ecuador (SERCOP), Colombia (SECOP). Do not start until Bolivia ranks and the scraper abstraction exists.

## 2. Audit findings (before this change)
| Area | State |
|---|---|
| Technical | Good: metadata, canonical, OG, robots, sitemap, JSON-LD (SoftwareApplication, WebSite, FAQPage) |
| Programmatic pages | 17 (9 departments + 8 sectors) + `/licitaciones` |
| Content | **No blog/guides** — only transactional pages; no informational queries captured |
| AI-search readiness | No `llms.txt`; robots didn't explicitly welcome AI crawlers; no Organization schema; no quotable answer block |
| Trust / E-E-A-T | No visible support contact, no "independent site" disclosure |
| Internal linking | Homepage didn't link to departments/sectors/guides |
| Duplication | FAQ duplicated between JSON-LD and visible HTML (drift risk) |

## 3. What was implemented
- **Blog** `/blog` + 6 answer-first guides (Article + FAQPage + BreadcrumbList schema each): What is SICOES, RUPE registration, modalidades (ANPE / Licitación Pública), how to find tenders, alert tools comparison criteria, how to win tenders.
- **Homepage:** quotable definition block, department links, guides section, 8-question FAQ (single source feeding both visible UI and FAQPage JSON-LD), Blog nav link.
- **AI search:** `public/llms.txt`; robots rules explicitly allowing GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, etc.; Organization + ContactPoint schema.
- **Sitemap:** blog index + posts.
- **Support:** shared `SiteFooter` on every public page with `mailto:jbendek@ribentek.com`, plus "independent, not affiliated with the State" disclosure.
- Shared constants in `src/lib/site.ts`.

## 4. Target keyword map (validate volumes in Findable/GSC)
| Intent | Keyword cluster | Page |
|---|---|---|
| Navigational/transactional | licitaciones Bolivia, convocatorias SICOES, SICOES vigentes | `/licitaciones`, dept/sector pages |
| Alerts | alertas licitaciones Bolivia, monitor SICOES | Home, `/blog/herramientas-de-alertas…` |
| Informational | qué es SICOES, qué es RUPE, cómo registrarse RUPE | blog |
| Informational | ANPE Bolivia, licitación pública monto, contratación menor | blog |
| Commercial | cómo ganar licitaciones Bolivia, licitaciones PYMES | blog |

## 5. AI-search (GEO) tactics applied and next
Applied: answer-first "Respuesta rápida" at top of every article; short, factual, entity-rich sentences (SICOES, RUPE, ANPE, sicoes.gob.bo, Bolivia); FAQ schema; llms.txt; crawler access; author/publisher entity (Ribentek).
Next (highest impact first):
1. **Get cited elsewhere** — AI engines weight third-party mentions: Bolivian business press, Cámara de Comercio/CAINCO/CNI directories, LinkedIn posts, Reddit/Facebook groups of contratistas, Wikipedia-style entity pages for Ribentek.
2. **Fresh data pages** — publish weekly "licitaciones de la semana" (auto-generated from the cache) and monthly stats (tenders by department/sector). Original data is the strongest citation magnet.
3. **Tender detail pages** (`/licitaciones/[cuce]`) with `GovernmentService`/`Offer`-style structured data → long-tail traffic. Largest scale lever.
4. **More guides:** garantía de seriedad de propuesta, DBC explicado, formularios A-1/B-2 (the repo already has RUPE-form logic), contratación directa, SABS/Normas Básicas, calendar of deadlines, per-sector guides (construcción, salud, TI).
5. **Search Console + Bing Webmaster** verification and sitemap submission; IndexNow for Bing/ChatGPT search.
6. **Real social proof** — replace placeholder-style stats ("144+") with live counts from the cache; add testimonials/case studies when available.
7. **Performance** — Core Web Vitals check; the homepage uses heavy inline styles, move to Tailwind classes over time.
8. **Measure AI visibility monthly:** ask ChatGPT, Claude, Perplexity, Gemini, Copilot ~20 fixed Spanish prompts ("¿cómo recibo alertas de licitaciones en Bolivia?") and log whether sicoesmonitor.com is cited (Findable can automate this once authorized).

## 6. Caveats
- Legal thresholds (Bs 20.000 / 50.000 / 200.000 / 1.000.000 / 70.000.000) come from public references found via web search of the Normas Básicas del SABS; they are labelled as "may change — verify". Have someone with procurement-law knowledge review before promoting.
- Competitor notes are limited to what search snippets showed (sicoeshoy.bo was not reachable from the sandbox).
- Publication dates are set to the day of this change.

---

# Update 2026-10-02 — Findable data (Bolivia, loc 2068 / es)

Findable project: "Sicoes Monitor" (note: its default market is US/en — always pass `locationCode 2068, languageCode es`). Rank tracker (manual, 24 keywords, mobile) created; keywords saved with tag `bolivia-core`; competitors and context stored in the project.

## Baseline
- `sicoesmonitor.com`: ~1,047 organic visits/mo, 34 ranking keywords. Nearly all sit at **positions 13–25** (striking distance of page 1).
- Top terms: `sicoes` 301k/mo (pos 23, KD 19), `sicoes bolivia` 12.1k (pos 15), `convocatoria(s) sicoes` 4.4k (pos 16), `sicoes cochabamba` 2.9k (pos 17), `sicoes la paz` 2.4k (pos 18), `sicoes santa cruz` 1.6k (pos 14), `sicoes sacaba` 1k, `sicoes requerimiento de personal 2026` 1k (pos 17).
- `licitaciones bolivia` is only ~110/mo — **the audience searches "sicoes", not "licitaciones"**.

## Key insights
1. **Head-term intent is largely job seekers/consultants** ("requerimiento de personal", "empleos", "consultor individual") and people seeking the official portal. Our current scraper only covers `convNacional` tenders, so this demand is not yet served with live data.
2. **SERPs are weak**: Facebook groups, YouTube, TikTok, Scribd and **infosiscon.com** (thousands of programmatic pages). Low KD (0–30) everywhere. AI Overviews appear on every query checked.
3. **City/municipality long tail is cheap**: `sicoes sacaba/el alto/quillacollo/tiquipaya/vinto/viacha/sucre` all KD 0–10.

## Implemented in this iteration
- Titles/H-structure aligned to real queries: "SICOES {Departamento}: convocatorias vigentes 2026", home title "SICOES Bolivia: convocatorias y alertas diarias con IA".
- New `/licitaciones/municipio/{slug}` pages (7) + sitemap + homepage links.
- New guides: *SICOES requerimiento de personal 2026* and *sicoes.gob.bo: cómo ingresar y buscar convocatorias*; retitled the SICOES pillar guide for "sicoes bolivia".
- Audit fixes (Findable crawl): titles/descriptions shortened, thin dept pages enriched with context + internal links, `/login` noindex with metadata.
- Corrected a legal-threshold claim (national/international tender cap differs by source: Bs 40M vs 70M) — now flagged as "verify".

## Next (ordered by expected impact)
1. **Extend the scraper to "Requerimiento de Personal"** (`tipo=c`-style personnel listings) and publish live pages `/empleos-sicoes/{ciudad}` — targets the 300k+/mo head demand. Add a "personal" alert type to convert job seekers.
2. **Per-tender detail pages** (`/licitaciones/{cuce}`) to compete with infosiscon's programmatic long tail.
3. **Entity pages** (e.g. Gobierno Autónomo Municipal de X) — infosiscon ranks heavily on these.
4. Re-run the rank tracker in ~2 weeks (`run_rank_tracker`) and compare to the baseline above; check Search Console for CTR on pos 13–20 terms.
5. Off-site: Facebook group/page presence (they own the SERP), TikTok/YouTube explainers on RUPE/SICOES.

---

# Update 2026-10-11 — Measurement (Search Console connected) and iteration

## What changed since 2026-10-02 (Search Console, `sc-domain:sicoesmonitor.com`)
| Metric | Sep 1 – Oct 4 (daily avg) | Oct 5 – 8 (daily avg) |
|---|---|---|
| Impressions | ~490 / day | ~3,100 / day (**~6x**) |
| Clicks | ~5 / day | ~20 / day (**~3-4x**) |
| Avg position | ~7.7 | ~7.7 (stable) |

- Findable domain overview: 34 → **46** ranking keywords; est. organic traffic 1,047 → 1,095 (the model lags real GSC data).
- The new guides were indexed within ~3 days and already rank **top 4-7**: DBC pages (pos 4.5, "que es dbc en bolivia" pos 4.4), errores (pos 4.0), modalidades (pos 4.9), requerimiento de personal (pos 6.3).
- Biggest pages by clicks: `/licitaciones/departamento/la-paz` (75 clicks / 6.1k impr.), santa-cruz (27), `/licitaciones` (17), cochabamba (17), RUPE guide (14), personal guide (14).
- **Best-converting cluster = personnel queries**: "sicoes requerimiento de personal 2026" CTR 2.8%, "... la paz" 3.5%, "... cochabamba" 4.1%.
- **Problem: low CTR** on high-impression broad queries ("sicoes" 2,550 impr. → 1 click; "sicoes bolivia" 1,455 → 1; `/blog/que-es-sicoes-bolivia` 4,963 impr. at 0.2% CTR). Causes: titles >60 chars truncated in the SERP (audit: 24 pages), generic descriptions, AI Overviews on top.
- AI-search proxy (web-search-grounded answers): our pages are cited for "qué es SICOES", "alertas de licitaciones", "cómo registrarse en el RUPE" (via the pillar guide); **not cited** for "qué es ANPE", "RUPE vs SIGEP", "cómo postular en SICOES" → content gaps, now filled.
- Rank tracker run failed on a Findable billing error (`topup_credits not found`) — GSC used instead.

## Implemented in this iteration
- `seoTitle` (≤58 chars) for all guides; shorter, intent-matched titles on location pages ("SICOES La Paz: convocatorias vigentes hoy (2026)"); meta descriptions now include the live tender count; template separator `|`.
- **6 new guides** (2,300–3,570 words): ¿Qué es el ANPE?, Contratación menor, RUPE vs SIGEP, Cómo postular en SICOES, Convocatorias de personal por ciudad (hub for the best-converting cluster), Licitaciones por departamento (hub).
- AI-search assets: `/llms-full.txt` (all guides as Markdown), RSS `/blog/feed.xml` (+ `<link rel=alternate>`), llms.txt updated.
- Cross-links from every department/municipio page to the new guides.

## Next
1. Re-check GSC in 14 days: CTR on `/blog/que-es-sicoes-bolivia`, location pages, and the 6 new guides.
2. Connect GA4 in Findable to see conversions (login events) by landing page.
3. Build the live "Requerimiento de Personal" scraper (data-backed city pages) — the highest-converting query cluster; needs testing against sicoes.gob.bo from the GitHub Action environment.
4. Per-tender detail pages and entity pages (infosiscon's moat).
5. Off-site mentions (Facebook groups/pages own the SERP for "sicoes").
