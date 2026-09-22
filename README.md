# Portfolio — Bivek Gurung

A personal portfolio for **Bivek Jang Gurung**, a front-end developer based in Australia with 7 years of experience. The site uses a code-editor aesthetic (Design System v3) and is organized as a shared IDE window across four routes.

## Tech stack

- **Framework**: Next.js 16 (App Router), React 19
- **Styling**: CSS Modules + CSS custom properties (dark-only theme)
- **Fonts**: Fira Code (display/code) and Inter (body/UI) via `next/font/google`
- **Animations**: `motion` (framer-motion), page transitions, noise overlay
- **Icons**: `react-icons`
- **Tests**: Vitest + jsdom + @testing-library/react
- **Deploy**: Netlify (`@netlify/plugin-nextjs`)

## Routes

| Route | Content |
|---|---|
| `/` | Home — intro, social links, playable snake game |
| `/about` | About — file explorer sidebar, per-file code content (bio, contacts, experience, interests) |
| `/projects` | Projects — technology filter sidebar, project cards |
| `/contact` | Contact — validated form, live code-snippet preview, social strip |
| anything else | Custom 404 page (code-editor style) |

Every route renders inside a shared `SiteFrame` (top tab navigation, section content, footer bar) so the whole site presents as one IDE window.

## Getting started

```bash
# Install dependencies
npm install

# Dev server (port 3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint

# Test (Vitest, runs once)
npm test
```

## Key features

- **Snake game** — canvas-based, idle/playing/game-over/win states, keyboard + on-screen controls, neon glow. Does not block page scroll.
- **Dark-only theme** — code-editor palette, no toggle.
- **Contact form**: client-side validation states, server-side validation, rate limiting (3/hr/IP) and Cloudflare Turnstile bot protection at `POST /api/contact`. Valid submissions send an owner notification and a visitor thank you through Nodemailer and Gmail SMTP when `SMTP_USER` and `SMTP_PASS` are set. Sending is best effort: failures are logged and the submission still returns success. Without credentials the submission is logged and no email is sent.
- **Custom cursor** — rAF lerp follow, active above 999px viewport.
- **Accessibility** — WCAG AA audited (contrast, keyboard navigation, screen reader structure), skip-to-content link, `prefers-reduced-motion` respected.

## Project structure

```
src/
├── app/                    # App Router: routes, root layout, globals.css, 404, API route
│   └── api/contact/        # Contact form POST handler
├── components/
│   ├── animations/         # PageTransition (route fade), NoiseOverlay
│   ├── cursor/             # Custom cursor
│   ├── layout/SiteFrame.js # Shared IDE window (nav, content, footer)
│   ├── sections/           # Banner, About, Projects, Contact
│   └── snake/SnakeGame.js  # Canvas snake game
└── data/                   # Static JSON: projects, socials, personal
```

## Content & data

All site content lives in static JSON files under `src/data/` — edit `projects.json`, `socials.json`, or `personal.json` to change the content without touching components.

## Environment variables

| Variable | Purpose |
|---|---|
| `SMTP_USER` | Gmail address that sends the contact form emails |
| `SMTP_PASS` | Gmail app password for the address above |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 measurement ID; falls back to `G-V9W1PD2NDW` when unset |
| `TURNSTILE_SECRET` | Cloudflare Turnstile secret key that verifies the contact form token |
| `TURNSTILE_HOSTNAMES` | Comma separated hostname allowlist for verified submissions, for example `bivekgurung.com,www.bivekgurung.com`. Leave unset to skip the check. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public Turnstile site key for the widget; falls back to `0x4AAAAAAE-1qMMz6WJgOOy_` when unset |

Email sending activates only when both are set. For production, add both in the Netlify dashboard (Site configuration, Environment variables). For local testing, set both values in a local `.env.local` file.

Google Analytics loads only in production builds and never blocks first paint. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in the Netlify dashboard to override the fallback `G-V9W1PD2NDW`; without it the fallback is used.

Bot protection uses Cloudflare Turnstile. The contact form renders the widget and sends its token with the submission; the route verifies the token through Cloudflare's siteverify endpoint and accepts only when the response reports `success`, an action of `contact`, and a hostname in the allowlist. Verification fails open: a missing `TURNSTILE_SECRET`, a network error, a timeout or a non 200 reply all accept the message and log, so a real visitor is never blocked by our own problem. A submission that Cloudflare answers `no` to is rejected with HTTP 403.

Two setup steps belong with the deploy:

1. Register the widget hostnames in the Cloudflare dashboard. They must include `bivekgurung.com` and `www.bivekgurung.com`, plus `localhost` (and optionally `127.0.0.1`) for local development. A widget registered for the wrong hostnames makes the hostname check reject real visitors.
2. Set `TURNSTILE_SECRET`, `TURNSTILE_HOSTNAMES` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` in the Netlify dashboard (Site configuration, Environment variables). Because the hostname check is skipped when `TURNSTILE_HOSTNAMES` is unset, a deploy that forgets it silently drops that defence.

For local development, add `localhost` to `TURNSTILE_HOSTNAMES` in your local `.env` (or leave the variable unset locally). The production allowlist alone rejects localhost submissions with 403, even though the widget rendered fine.

## Deployment

The project deploys to Netlify via `netlify.toml` (build command `npm run build`, publish dir `.next`, Next.js plugin). `next.config.js` sets `poweredByHeader: false`, compression, and long-lived cache headers for `/images` and `/pdf`.

## License

Private project. All rights reserved.
