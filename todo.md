# Todo (current sprint)

- [x] Create GitHub OAuth App (Settings → Developer settings → OAuth Apps) for Decap CMS login
- [x] `wrangler login` + deploy the OAuth Worker (`oauth-worker/`) to Cloudflare, set client ID/secret as Worker secrets
- [x] Update `public/admin/config.yml` `backend.base_url` with the real Worker URL
- [x] Confirm with Anthony before flipping repo Pages source (branch-deploy → GitHub Actions) — flipped 2026-09-14
- [x] Push to `main`, confirm the Actions workflow builds+deploys — succeeded 2026-09-14 (run 34810576550)
- [ ] Log into `/admin`, publish a first real post, confirm it appears on `/blog/`
