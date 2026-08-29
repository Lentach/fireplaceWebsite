# 2026-08-26 — Brand rename Fireplace → Umbra (PR #3)

- Renamed user-visible brand text in `src/pages/index.astro` (title, OG/Twitter
  meta, image alts, `og:site_name`, "umbra relay nº1" label, "Open Umbra" CTA),
  `README.md`, `CLAUDE.md`, and the `contact.ts` header comment.
- Replaced old coin logo/favicon assets with the new silver-hex icon master
  from the app repo (`.planning/branding/umbra-s5-silver.svg` + foreground
  variant); PNGs re-rendered with the branding rasterizer at matching sizes.
- Intentionally untouched: every `fireplace.ignorelist.com` URL, canonical/OG
  URLs, `astro.config.mjs` base, `sitemap.xml`, `package.json` name,
  `Lentach/Fireplace` repo links.
- `deploy-landing.ps1:26` verify changed `-match 'Fireplace'` → `-match 'Umbra'`
  (b96e076): after the rename the old pattern only matched URLs, asserting
  nothing about rendered brand content. First post-merge deploy passes it.
- Needs owner: new `public/og.png` art, recaptured `docs/screens/*.webp` after
  deploy, GitHub repo rename, domain decision.
- Verified: `npm ci && npm run build` green in the `feat/umbra-rename` worktree;
  built HTML has no "Fireplace" brand text.
