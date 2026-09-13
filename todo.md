# Todo (current sprint)

- [x] Create GitHub OAuth App (Settings → Developer settings → OAuth Apps) for Decap CMS login
- [x] `wrangler login` + deploy the OAuth Worker (`oauth-worker/`) to Cloudflare, set client ID/secret as Worker secrets
- [x] Update `public/admin/config.yml` `backend.base_url` with the real Worker URL
- [ ] Confirm with Anthony before flipping repo Pages source (branch-deploy → GitHub Actions)
- [ ] Push to a feature branch first, confirm the Actions workflow builds+deploys before touching `main`'s Pages source
- [ ] Log into `/admin`, publish a first real post, confirm it appears on `/blog/`
