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
