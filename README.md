<p align="center">
  <a href="https://fireplace.ignorelist.com/welcome/">
    <img src="docs/screens/hero.webp" alt="Fireplace — messages only two people can read" width="840">
  </a>
</p>

<h1 align="center">Fireplace</h1>

<p align="center">
  <strong>Messages only two people can read.</strong><br>
  End-to-end encrypted chat. Every message is sealed on your device with the
  Signal protocol before it touches the network — the server relays ciphertext
  and understands none of it.
</p>

<p align="center">
  <a href="https://fireplace.ignorelist.com/welcome/"><strong>Visit the landing page</strong></a>
  ·
  <a href="https://fireplace.ignorelist.com/"><strong>Open the app</strong></a>
</p>

---

## A scroll through the page

One message, followed from Bob's phone to Kate's — the whole page is that journey.

<table>
  <tr>
    <td width="50%">
      <img src="docs/screens/journey-send.webp" alt="Press send — or just keep scrolling"><br>
      <sub><strong>01 — You send it.</strong> Press send yourself, or just keep scrolling; the page sends it for you.</sub>
    </td>
    <td width="50%">
      <img src="docs/screens/journey-relay.webp" alt="Ciphertext, inside TLS — the wire"><br>
      <sub><strong>03 — In transit.</strong> Ciphertext inside TLS. Anyone listening — provider, wifi, anyone — records noise.</sub>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="docs/screens/journey-delivered.webp" alt="We pass the letter. Still sealed."><br>
      <sub><strong>05 — Relayed.</strong> The envelope moves the instant Kate is reachable. Same ciphertext in, same out.</sub>
    </td>
    <td width="50%">
      <img src="docs/screens/features.webp" alt="Private by construction, not by promise"><br>
      <sub><strong>Private by construction.</strong> Signal protocol on every message, a server that knows nothing, deletes that delete.</sub>
    </td>
  </tr>
</table>

<table>
  <tr>
    <td width="66%">
      <img src="docs/screens/outro.webp" alt="That's the whole story. We're just the courier."><br>
      <sub><strong>The whole story.</strong> Runs in your browser, installs as an app, free.</sub>
    </td>
    <td width="34%">
      <img src="docs/screens/mobile-hero.webp" alt="Fireplace landing on mobile"><br>
      <sub><strong>Fully responsive.</strong> Same journey, one hand.</sub>
    </td>
  </tr>
</table>

Every capture above is the live page — type in the hero terminal and the
ciphertext line re-seals with your words; they even ride along into the
journey's chat bubbles.

---

## What this repo is

The source of Fireplace's landing page — the site's business card, served at
[`fireplace.ignorelist.com/welcome/`](https://fireplace.ignorelist.com/welcome/).

It's a single static page, built by hand:

- **Astro** (static output) + **Lenis** smooth scroll — no page framework, no GSAP.
- **Hand-rolled canvas modules**: a draggable dot-globe, a live "what our server
  sees" encryption demo, and an 800vh scroll-driven *journey of a message* —
  a custom scroll-progress engine that walks one message from a sender's phone,
  through the relay, to the recipient, seal intact the whole way.
- Interactive on purpose: type in the hero terminal and watch your words turn
  into the real `3:` PreKey envelope shape; write in the phone composer and send
  the message yourself.

The Fireplace app itself (Flutter PWA + NestJS backend) lives in the main
[`Lentach/Fireplace`](https://github.com/Lentach/Fireplace) repository.

## Content honesty rules (do not regress)

The page makes no claim the product can't back:

- No fake trust signals — no download counts, no testimonials.
- "Public source", **not** "open source" — there is no LICENSE file yet; upgrade
  the wording only after adding one.
- The relay machine transforms nothing: same ciphertext in, same ciphertext out.

## Repository layout

| Path | What it is |
| --- | --- |
| `src/pages/index.astro` | The whole page: nav, globe hero, journey, features, ledger, outro |
| `src/scripts/globe.ts` | Hero dot-globe (drag to rotate, Ctrl+scroll to zoom) |
| `src/scripts/journey.ts` | The spine: scroll-driven journey of a message; interactive send |
| `src/scripts/encrypt.ts` | "What our server sees" hero terminal demo |
| `src/scripts/util.ts` | Shared math/canvas helpers |
| `src/styles/landing.css` | All styling |
| `brand/` | Logo sources (SVG + rendered PNGs) |

## Local dev

```bash
npm install
npm run dev        # http://localhost:4321/welcome
npm run build && npm run preview
```

## Deploy

```powershell
.\deploy-landing.ps1
```

Builds, uploads to a staging dir on the VM, atomic-swaps into the nginx-served
directory, and verifies the live URL + asset hashes. One-time nginx setup and
operational details: [`CLAUDE.md`](CLAUDE.md).

<details>
<summary>nginx block (one-time server setup)</summary>

Add to the host config, alongside the existing blocks (landing assets live
under `/welcome/assets/`):

```nginx
location = /welcome { return 301 /welcome/; }
location ^~ /welcome/ {
    alias /home/ubuntu/fireplace/landing-build/;
    index index.html;
}
```

No `try_files` on purpose — `alias` + `try_files` is an nginx footgun and a
single static page needs no SPA fallback. Then `sudo nginx -t && sudo
systemctl reload nginx`. Subsequent deploys are file-only, no reload needed.

</details>

---

<p align="center">
  Built by one guy. Sealed on your device. <a href="https://fireplace.ignorelist.com/welcome/">See for yourself.</a>
</p>
