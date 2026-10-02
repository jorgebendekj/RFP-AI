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
