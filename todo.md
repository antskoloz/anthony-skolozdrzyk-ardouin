# Todo (current sprint)

- [ ] Create GitHub OAuth App (Settings → Developer settings → OAuth Apps) for Decap CMS login
- [ ] `wrangler login` + deploy `decap-cms-oauth-provider` as a Cloudflare Worker, set client ID/secret as Worker secrets
- [ ] Update `public/admin/config.yml` `backend.base_url` with the real Worker URL
- [ ] Confirm with Anthony before flipping repo Pages source (branch-deploy → GitHub Actions)
- [ ] Push to a feature branch first, confirm the Actions workflow builds+deploys before touching `main`'s Pages source
- [ ] Log into `/admin`, publish a first real post, confirm it appears on `/blog/`
