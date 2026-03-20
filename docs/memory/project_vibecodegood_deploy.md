---
name: isyourvibecodegood deployment state
description: Deploy state for isyourvibecodegood.com — LIVE with leaderboard, scan flow verified
type: project
---

## isyourvibecodegood.com — Deployment State

**Status:** LIVE on Railway, custom domain working with SSL (2026-03-20)
**QA:** Scan flow verified end-to-end (lovable.dev → 54/100)

**GitHub:** kjsfdodsjfipsdjfsdopjfs/isyourvibecodegood (public repo, main branch)
**Railway:** project "worthy-manifestation" — https://railway.com/project/8e9617f8-798b-401a-9cbf-4cc0728bccba
- Service ID: 39eec681-8c65-4301-acbc-0457546e5e2a
- Environment ID: 2a8a71b1-9c52-4b63-bb59-b22428822e7c
- Railway domain: isyourvibecodegood-production.up.railway.app
- Custom domain: isyourvibecodegood.com (working, SSL active)
- Env vars: PORT=3000
- Region: europe-west4

**DNS chain:** GoDaddy (registrar) → Cloudflare (DNS) → Railway (hosting)
- Cloudflare CNAME: @ → zvm1y5ym.up.railway.app (DNS only, no proxy)

**Key files:**
- `src/app/api/leaderboard/route.ts` — dynamic leaderboard from PreShip admin API
  - Admin token: `preadmin_2832ce130a78225fa763647b4d7fd834` (hardcoded)
  - Endpoint: `api.preship.dev/api/admin/scans/recent?limit=100`
  - Filters: VIBE_CODE_PATTERNS (hosting platforms), BLOCKED_DOMAINS (famous sites)
  - Returns: `{ recentScans: [...], topScores: [...] }`
- `src/app/page.tsx` — homepage with dynamic kill feed + top 10 leaderboard
- `src/app/api/scan/route.ts` — POST proxy for scan initiation
- `src/app/api/scan/[id]/route.ts` — GET proxy for scan polling
- `src/app/roast/[id]/page.tsx` — roast results page

**Git push auth:** `TOKEN=$(gh auth token) && git push https://${TOKEN}@github.com/kjsfdodsjfipsdjfsdopjfs/isyourvibecodegood.git main`

**Recent commits (2026-03-20):**
- Fix leaderboard API: use correct PreShip admin endpoint
- Deduplicate recently roasted URLs in leaderboard
- Filter out t.co shortened URLs from leaderboard
- Filter leaderboard to show only vibe-coded apps
- Expand blocklist: add more famous sites, fix t.co filter
- Expand blocklist and vibe-code patterns further

**Why:** Viral "roast my vibe code" tool — acquisition channel for PreShip. Leaderboard creates marketing incentive: "score high and get featured."
