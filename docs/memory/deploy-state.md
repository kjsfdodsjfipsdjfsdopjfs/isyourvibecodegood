---
name: isyourvibecodegood deployment state
description: Deploy state for isyourvibecodegood.com — LIVE on Railway, QA passed, DNS propagating
type: project
---

## isyourvibecodegood.com — Deployment State

**Status:** LIVE on Railway domain, custom domain DNS propagating (2026-03-19)
**QA:** Passed — health score 93/100 (2 issues found & fixed)

**GitHub:** kjsfdodsjfipsdjfsdopjfs/isyourvibecodegood (public repo, main branch, 7 commits)
**Railway:** project "worthy-manifestation"
- Railway domain: isyourvibecodegood-production.up.railway.app (working, 200)
- Custom domain: isyourvibecodegood.com (port 3000, waiting for DNS propagation)
- Env vars: PORT=3000, PRESHIP_ADMIN_TOKEN set
- Region: europe-west4

**DNS chain:** GoDaddy (registrar) → Cloudflare (DNS) → Railway (hosting)

**QA Fixes shipped (2026-03-19):**
- Mobile form stacked layout (was truncating "ROAST ME" button)
- GA4 scripts migrated to next/script
- Accessibility: added sr-only label to URL input

**Git push auth:** `GIT_ASKPASS=/bin/echo git -c "credential.helper=/Users/rodrigoreis/bin/gh auth git-credential" push origin main`
