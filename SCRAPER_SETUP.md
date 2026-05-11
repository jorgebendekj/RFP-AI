# SICOES Scraper Setup Guide

## How it works (architecture in one diagram)

```
┌─────────────────────────┐         ┌──────────────────────────┐
│ GitHub Actions (daily)  │         │ Vercel /api/sicoes/scan  │
│ ─ Real Chromium browser │  ──►    │ ─ Reads InstantDB cache  │
│ ─ Solves Cloudflare     │   ▲     │ ─ Filters by keywords    │
│ ─ Scrapes SICOES        │   │     │ ─ Scores w/ Claude       │
│ ─ Writes InstantDB      │   │     │ ─ Returns to user (fast) │
└────────────┬────────────┘   │     └────────────┬─────────────┘
             │                │                  │
             ▼                │                  ▼
        ┌──────────────────────────┐
        │ InstantDB                │
        │ ─ siceosTenders          │  ← cache of all vigente tenders
        │ ─ siceosScrapeMetadata   │  ← last run timestamp + counts
        └──────────────────────────┘
```

## One-time setup

### 1. Add InstantDB admin token to GitHub Secrets

This is the **only** secret the scraper needs.

1. Go to https://github.com/jorgebendekj/RFP-AI/settings/secrets/actions
2. Click **New repository secret**
3. Name: `INSTANTDB_ADMIN_TOKEN`
4. Value: paste the same token you have in your local `.env.local` (the line `INSTANTDB_ADMIN_TOKEN=...`)
5. Click **Add secret**

That's it for secrets. No ScrapingBee, no captcha-solving service.

### 2. Run the workflow manually for the first time

You need to populate the cache once before users can scan.

1. Go to https://github.com/jorgebendekj/RFP-AI/actions
2. In the left sidebar, click **Scrape SICOES**
3. On the right, click the **Run workflow** dropdown → **Run workflow** button (green)
4. Wait ~5–10 minutes for the run to finish
5. Click the run to see live logs — you should see:
   ```
   [scraper] Search form ready, waiting for Turnstile + initial AJAX...
   [scraper] "software" → 12 rows, +12 new
   [scraper] "construccion" → 8 rows, +8 new
   ...
   [scraper] Scrape complete: 87 unique vigente tenders
   [scraper] Inserted 87 new cached tenders
   [scraper] DONE in 245s
   ```

### 3. Verify it worked

Go to **rfp-ai.vercel.app/dashboard** and click **Escanear SICOES**. You should see real CUCEs in seconds (no waiting — it reads from cache).

## Daily automation

The workflow runs automatically every day at **10:00 UTC = 06:00 Bolivia time**. You don't have to touch anything.

If you want to change the time, edit `.github/workflows/scrape-sicoes.yml`:
```yaml
- cron: "0 10 * * *"   # minute hour day month weekday (UTC)
```

## How to check the scraper is healthy

- **GitHub Actions tab**: green checkmark = last run succeeded
- **Vercel dashboard**: the scan results now show `Caché actualizado <date>` in the log pane
- **Manual trigger**: at any time, go to Actions → Scrape SICOES → Run workflow

## Running locally (optional, for debugging)

```powershell
# One-time
npm install
npx playwright install chromium

# Each time
$env:INSTANTDB_ADMIN_TOKEN = "your-token-from-.env.local"
npm run scrape:sicoes
```

You'll see Chromium launch (headless) and scrape SICOES. Takes ~3–5 min locally depending on connection.

## Troubleshooting

| Symptom | What to do |
|---|---|
| Workflow fails with "INSTANTDB_ADMIN_TOKEN required" | Did you add the GitHub Secret in step 1? Check the exact spelling. |
| Workflow runs but 0 tenders | SICOES might be down. Check sicoes.gob.bo manually. Re-run the workflow. |
| Dashboard says "Caché vacío" | The workflow hasn't run yet. Trigger it manually (step 2). |
| Dashboard says "0 licitaciones que coincidan" | Your keywords don't match anything currently vigente. Edit them in Configuración. |
| Caché is older than 2 days | GitHub Actions might be failing. Check the Actions tab. |

## Cost

- GitHub Actions: **$0** (free tier = 2,000 min/month; one run takes ~5 min)
- Playwright: **$0** (open source)
- InstantDB: **$0** (free tier easily covers this)
- Anthropic API (relevance scoring): paid as-you-go, ~$0.001 per user scan with Haiku

**Total operational cost: free for scraping, ~$0.03 per 30 user scans.**
