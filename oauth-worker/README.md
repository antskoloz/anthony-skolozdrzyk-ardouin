# OAuth proxy for Decap CMS

A small Cloudflare Worker that completes the GitHub OAuth handshake Decap CMS needs to let you log into `/admin` — GitHub Pages can't run this itself since it only serves static files. Sourced from [sveltia/sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) (MIT), which implements the same OAuth protocol Decap/Netlify CMS expect.

## One-time setup

1. **Create a GitHub OAuth App** at github.com/settings/developers → OAuth Apps → New OAuth App. Homepage URL: `https://antskoloz.github.io/anthony-skolozdrzyk-ardouin/`. Callback URL: fill in after step 3, once you know the deployed Worker's URL (`https://<worker-name>.<your-subdomain>.workers.dev/callback`).
2. **Log in to Cloudflare from the CLI:**
   ```
   npx wrangler login
   ```
   This opens a browser tab — click Allow.
3. **Deploy the Worker:**
   ```
   cd oauth-worker
   npx wrangler deploy
   ```
   This prints the Worker's URL.
4. **Set the OAuth App's secrets** (never commit these):
   ```
   npx wrangler secret put GITHUB_CLIENT_ID
   npx wrangler secret put GITHUB_CLIENT_SECRET
   ```
   Paste the values from the GitHub OAuth App page when prompted.
5. **Go back to the GitHub OAuth App** and set its callback URL to `https://<worker-url>/callback`.
6. **Update `public/admin/config.yml`** in the repo root — set `backend.base_url` to `https://<worker-url>` (no trailing slash, no `/callback`).
7. Commit and push that config.yml change, then re-deploy the site.

## Redeploying after a code change

```
cd oauth-worker
npx wrangler deploy
```

Secrets persist across deploys — no need to re-set them unless rotating the OAuth App credentials.
