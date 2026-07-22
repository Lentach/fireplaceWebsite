# Fireplace landing page (`/welcome`)

Static marketing page served at `https://fireplace.ignorelist.com/welcome/`.
Astro + Lenis + hand-rolled canvas modules — no GSAP (the journey is a custom
scroll-progress engine, prototyped in the main Fireplace repo under
`docs/design/landing-prototype/`).
Lives in its own repo, extracted from the `Lentach/Fireplace` monorepo
(2026-07-22, history preserved). The PWA stays untouched at `/` on the same
host (never move its path — service-worker scope + local E2E Signal keys);
its code lives in the main repo.

## Structure

- `src/pages/index.astro` — the whole page: nav, globe hero, message journey,
  features, ledger, outro.
- `src/scripts/globe.ts` — hero dot-globe (drag rotate, Ctrl+scroll zoom).
- `src/scripts/journey.ts` — the spine: scroll-driven "journey of a message";
  send is interactive, auto-sends for visitors who just scroll.
- `src/scripts/encrypt.ts` — "what our server sees" hero demo.
- `src/scripts/util.ts` — shared math/canvas helpers.

Content honesty rules (do not regress):
- No fake trust signals: no download counts, no testimonials.
- "public source", NOT "open source" — repo has no LICENSE file (upgrade the
  wording only after adding one).
- The relay machine transforms nothing: same ciphertext in and out.

## Local dev

```bash
npm install
npm run dev        # http://localhost:4321/welcome
npm run build && npm run preview
```

## Deploy (from the dev PC)

```powershell
.\deploy-landing.ps1
```

Builds, uploads to a staging dir on the VM, atomic-swaps into
`~/fireplace/landing-build/`, verifies `https://fireplace.ignorelist.com/welcome/`.

### One-time server setup (nginx)

Add to `/etc/nginx/sites-enabled/fireplace` (host config, alongside the
existing blocks; landing assets live under `/welcome/assets/`):

```nginx
location = /welcome { return 301 /welcome/; }
location ^~ /welcome/ {
    alias /home/ubuntu/fireplace/landing-build/;
    index index.html;
}
```

(No `try_files` on purpose — `alias` + `try_files` is an nginx footgun and a
single static page doesn't need SPA fallback. After applying, verify an asset
URL directly: `curl -I https://fireplace.ignorelist.com/welcome/assets/<file>.js`.)

Then `sudo nginx -t && sudo systemctl reload nginx`. Subsequent deploys need
no nginx reload (files only).
