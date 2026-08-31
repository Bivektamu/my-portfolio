# Portfolio — Bivek Gurung

A personal portfolio for **Bivek Jang Gurung**, a front-end developer based in Australia with 7 years of experience. The site uses a code-editor aesthetic (Design System v3) and is organized as a shared IDE window across five routes.

## Tech stack

- **Framework**: Next.js 16 (App Router), React 19
- **Styling**: CSS Modules + CSS custom properties (dark-first theme, `data-theme` switching)
- **Fonts**: Fira Code (display/code) and Inter (body/UI) via `next/font/google`
- **Animations**: `motion` (framer-motion), page transitions, noise overlay
- **Icons**: `react-icons`
- **Tests**: Vitest + jsdom + @testing-library/react
- **Deploy**: Netlify (`@netlify/plugin-nextjs`)

## Routes

| Route | Content |
|---|---|
| `/` | Home — intro, social links, playable snake game |
| `/about` | About — file explorer sidebar, code-snippet bio, GitHub gist cards |
| `/projects` | Projects — technology filter sidebar, project cards |
| `/skills` | Skills — tech chips with icons, experience panel |
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
- **Theme toggle** — dark default, light alternative, persisted to `localStorage`, no flash on first paint.
- **Contact form** — client-side validation states, server-side validation and rate limiting (3/hr/IP) at `POST /api/contact`. Email sending is Nodemailer-ready: set `SMTP_USER` and `SMTP_PASS` env vars to enable; otherwise submissions are logged to the console.
- **Custom cursor** — rAF lerp follow, active above 999px viewport.
- **Accessibility** — WCAG AA audit (see `docs/verify-38-accessibility-audit.md`), skip-to-content link, keyboard-friendly interactions.

## Project structure

```
src/
├── app/                    # App Router: routes, root layout, globals.css, 404, API route
│   └── api/contact/        # Contact form POST handler
├── components/
│   ├── layout/SiteFrame.js # Shared IDE window (nav, content, footer)
│   ├── sections/           # Banner, About, Projects, Skills, Contact
│   ├── snake/SnakeGame.js  # Canvas snake game
│   ├── cursor/             # Custom cursor
│   ├── animations/         # PageTransition, RevealOnScroll, NoiseOverlay
│   ├── header/             # ThemeToggle
│   └── hooks/              # useMagnetic
└── data/                   # Static JSON: projects, skills, socials, personal
```

## Content & data

All site content lives in static JSON files under `src/data/` — edit `projects.json`, `skills.json`, `socials.json`, or `personal.json` to change the content without touching components.

## Environment variables

| Variable | Purpose |
|---|---|
| `SMTP_USER` | SMTP username for contact-form email sending (optional) |
| `SMTP_PASS` | SMTP password for contact-form email sending (optional) |

## Deployment

The project deploys to Netlify via `netlify.toml` (build command `npm run build`, publish dir `.next`, Next.js plugin). `next.config.js` sets `poweredByHeader: false`, compression, and long-lived cache headers for `/images` and `/pdf`.

## Docs

- `docs/roadmap/roadmap.md` — feature roadmap and build approach
- `docs/adr/` — architecture decision records (e.g. Design System v3, SiteFrame layout, multi-page routing)

## License

Private project. All rights reserved.
