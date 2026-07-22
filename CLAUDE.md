# CLAUDE.md — Fireplace landing (`/welcome`)

Standalone repo for the Fireplace marketing page at
`https://fireplace.ignorelist.com/welcome/`. Extracted from the
`Lentach/Fireplace` monorepo on 2026-07-22 (git history preserved).
The Fireplace PWA + backend live in the main repo — never touch `/` on the VM.

## Ground rules

- Code wins over docs — when source conflicts with docs, trust source, fix the doc.
- Change only what was asked; read files before editing; never guess names.
- Owner verifies on a physical phone; deploy is how they test. Iterate small.

## Stack & layout

- Astro **static** (`output: static`, `base: '/welcome'`, `outDir: dist`), Astro 7.x.
- Lenis smooth-scroll + hand-rolled canvas modules (no GSAP).
- `src/pages/index.astro` — the entire page. `src/scripts/journey.ts` — the
  scroll-driven spine (800vh, sticky stage, mobile `<1000px`).
  `src/scripts/encrypt.ts` — hero terminal demo. `src/scripts/globe.ts` — dot globe.
- Content honesty rules in README.md (no fake trust signals, "public source").

## Build / dev (Windows dev PC)

- Build: `cmd.exe /c "npm run build"` (bare `npm` may fail to spawn from agents).
- Preview: `npm run preview` → `http://localhost:4321/welcome/`.
- Astro minifies with backtick template literals — grep built bytes accordingly.

## Deploy

`.\deploy-landing.ps1` (PowerShell, from repo root): `npm ci` → build → scp to
VM staging → guarded atomic swap into `~/fireplace/landing-build/` (nginx alias)
→ verifies 200s. VM: `ubuntu@51.68.138.13`.

- **GOTCHA 1:** stop any running preview/dev server first — `npm ci` hits EPERM
  on rollup binaries and can ship a STALE dist.
- **GOTCHA 2:** after deploy, curl-verify the LIVE asset bytes changed (hash in
  `/welcome/` HTML), don't trust the script's VERIFIED lines alone.
- nginx one-time setup: README.md. File-only deploys need no nginx reload.

## Mobile keyboard-dismiss lore (hard-won, do not regress)

- iOS Safari only honors programmatic `blur()` from inside a REAL touch
  gesture; `click` on fixed/overlay elements with the soft keyboard up is
  unreliable. All "Done" dismiss controls act on **`pointerdown`**
  (+ `preventDefault` so the button never steals focus — Android otherwise
  holds `:focus-within` open through the button itself).
- Headless Chromium has no soft keyboard: prove dismiss via trusted
  `elementHandle.tap()` (mobile+touch viewport) → `activeElement` leaves the
  textarea. Synthetic `dispatchEvent` (isTrusted:false) is NOT proof.
- Controls: `.enc-done` (hero terminal, `encrypt.ts`) and `.kb-done`
  (journey compose pill, `journey.ts` — `releaseKb()` + 600ms refocus suppress).

## Session end

Write a short session note in `.cursor/session-summaries/` (create if absent)
when doing multi-step work, mirroring the main repo's habit.
