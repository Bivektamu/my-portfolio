# portfolio-site

## Stack

- **Language / Runtime**: JavaScript (ES6+), Node 20+
- **Framework**: Next.js 16.2 (App Router), React 19.2
- **Key dependencies**: motion 12 (framer-motion), react-icons 4, next/font/google (Fira Code + Inter)
- **Styling**: CSS Modules + CSS custom properties (Design System v3 — code-editor aesthetic). Legacy styled-components remain in package.json during migration.
- **Package manager**: npm

## Build approach

Skateboard — ship the thinnest usable whole first, then layer in polish. See [docs/roadmap/roadmap.md](./docs/roadmap/roadmap.md).

## Commands

```bash
# Install
npm install

# Dev server (port 3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint (ESLint + eslint-config-next)
npm run lint

# Test (Vitest + jsdom + @testing-library/react)
npm test
```

## Context files

- [src/components/AGENTS.md](src/components/AGENTS.md) — Shared component conventions and legacy migration notes
- [src/components/sections/AGENTS.md](src/components/sections/AGENTS.md) — Section specific conventions
- [src/components/snake/AGENTS.md](src/components/snake/AGENTS.md) — Snake game component conventions
- [src/components/layout/AGENTS.md](src/components/layout/AGENTS.md) — SiteFrame (shared IDE window) conventions

## ADRs

Stored in `docs/adr/`. Active:
- [0001 — Next.js Migration Architecture](./docs/adr/0001-nextjs-migration-architecture.md)
- [0002 — Scroll Parallax](./docs/adr/0002-scroll-parallax.md)
- [0003 — Scroll Spy](./docs/adr/0003-scroll-spy.md)
- [0004 — Theme Toggle](./docs/adr/0004-theme-toggle.md) (Superseded — dark-only theme, toggle removed)
- [0005 — Banner Reimagined](./docs/adr/0005-banner-reimagined.md) (Superseded by 0008)
- [0006 — 3D Interactive Background](./docs/adr/0006-3d-interactive-background.md) (Superseded — 3D blob removed in v3)
- [0007 — Design System v3 (Code-Editor Aesthetic)](./docs/adr/0007-design-system-v3.md)
- [0008 — Banner Redesign](./docs/adr/0008-banner-redesign.md) (Superseded by 0013)
- [0009 — Snake Game](./docs/adr/0009-snake-game.md) (Superseded by 0012)
- [0010 — About Redesign (File Explorer)](./docs/adr/0010-about-redesign.md)
- [0011 — Contact Form Backend](./docs/adr/0011-contact-form-backend.md)
- [0012 — Multi-page Routing & Snake Game Update](./docs/adr/0012-multi-page-routing-snake-update.md) (Superseded by 0013)
- [0013 — Unified IDE Window (SiteFrame Layout)](./docs/adr/0013-unified-ide-window.md)

## Rules

- **Server-first**: components are server components by default. Only add `"use client"` when you need browser APIs (state, effects, events, media queries, motion).
- **Routing**: 4 routes (`/`, `/about`, `/projects`, `/contact`), each rendering one section. Route files under `src/app/` (`page.js`, `about/page.js`, `projects/page.js`, `contact/page.js`) import a single section from `src/components/sections/` and wrap it in `SiteFrame` (the shared IDE window: top nav, main content, footer bar). A `PageTransition` client component (AnimatePresence opacity fade) wraps `{children}` in the root layout. Each section has a co-located CSS Module and carries `"use client"` directly, no RevealOnScroll wrapper. The `/skills` route was removed.
- **Section IDs are fixed**: `home`, `about`, `project`, `contact` (the `<section id>` values). Nav uses route paths, not anchors. Do not change the IDs. Note: the projects section uses `project` id (singular), not `projects`.
- **Styling**: CSS Modules — `Component.js` + `Component.module.css` side by side. CSS custom properties on `:root` for theming (Design System v3 — code-editor aesthetic). Dark-only. Pattern tokens for tabs, code blocks, inputs, file explorers, and foreground containers. Legacy `src/styles/` (styled-components) is migration-only, do not extend.
- **Theme**: dark-only. Tokens live on `:root` in `globals.css`. The `<html>` element carries no theme attribute. No toggle, no localStorage, no flash-of-theme script.
- **Fonts**: Fira Code (display, headings, code) + Inter (body, UI). Loaded via `next/font/google` in root layout as CSS variables `--font-fira-code` and `--font-inter`. Poppins removed.
- **Smooth scroll**: CSS `scroll-behavior: smooth` + `scroll-margin-top` on sections.
- **Motion imports**: always from `motion/react`, not `framer-motion`.
- **Data**: static JSON files in `src/data/` (projects.json, socials.json, personal.json). Imported directly in components — no API routes for data, no database.
- **Contact form**: POST `/api/contact` with server-side validation and rate limiting. Nodemailer-ready for email sending (needs SMTP credentials in env).
- **Images**: use Next.js `Image` from `next/image` with explicit `width`/`height` and `sizes` attribute.
- **File naming**: PascalCase for components. One CSS Module per component: `Banner.js` + `Banner.module.css`.

## Directory map

| Directory / File | Owns | Status |
|---|---|---|
| `src/app/layout.js` | Root layout, Fira Code + Inter fonts, metadata, MotionConfig (reduced motion), PageTransition wrapper, noise overlay, skip-to-content link | Done |
| `src/app/page.js` | Home route, renders Banner only | Done |
| `src/app/about/page.js` | About route, renders About section | Done |
| `src/app/projects/page.js` | Projects route, renders Projects section | Done |
| `src/app/contact/page.js` | Contact route, renders Contact section | Done |
| `src/app/globals.css` | Design System v3 CSS custom properties, reset, pattern tokens, scrollbar, focus-visible, skip-link | Done |
| `src/app/not-found.js` | Custom 404 page (code-editor style) | Done |
| `src/app/api/contact/route.js` | Contact form POST handler with validation and rate limiting | Done |
| `src/components/sections/Banner.js` | Home — hero content (intro text, `> Front-end developer`, comments, github code line, snake game, glows) inside SiteFrame | Done |
| `src/components/sections/About.js` | About — file explorer sidebar, editor tabs, per-file code content (bio, contacts, experience, interests) | Done |
| `src/components/sections/Projects.js` | Projects — technology filter checkboxes sidebar (filters the card grid), project cards with hover effects | Done |
| `src/components/sections/Contact.js` | Contact — form with validation states, live code snippet preview, social strip | Done |
| `src/components/layout/` | SiteFrame — shared IDE window (brand, 4 nav tabs with active state, footer bar) wrapping every route | Done |
| `src/components/header/` | ThemeToggle — removed (dark-only theme) | Removed |
| `src/components/snake/` | SnakeGame, canvas-based, idle/playing/game-over/win states (loop stops on game-over/win), food counter, neon glow | Done |
| `src/components/cursor/` | CustomCursor with rAF lerp, hover state detection (teal accent) | Done |
| `src/components/preloader/` | Intro preloader sequence (blob animation) | Removed from layout, unused |
| `src/components/animations/` | PageTransition, RevealOnScroll, ScrollSpy (unused), NoiseOverlay (SVG grain texture) | Done |
| `src/components/hooks/` | useMagnetic (magnetic hover hook, radius + strength config) | Done |
| `src/data/` | Static JSON: projects.json (with per-project tech tags for filtering), socials.json, personal.json | Done |

## Legacy CRA files

| File | Owns | Notes |
|---|---|---|
| `src/components/layout.js` | GlobalContext, ThemeProvider, Lenis, preloader, scroll-spy | Replaced by `src/app/layout.js` |
| `src/components/Header.js` | Old header with DOM-query nav, theme toggle | Replaced by `layout/SiteFrame.js` nav |
| `src/components/banner.js`, `about.js`, `project.js`, `skill.js`, `contact.js` | Old section components with motion parallax | Replaced by `sections/` |
| `src/components/NavItem.js` | Old nav link with Lenis scroll | Replaced by `layout/SiteFrame.js` tabs |
| `src/components/ProjectCard.js` | Animated project card wrapper | Replaced by `animations/RevealOnScroll.js` |
| `src/components/Blob.jsx` | Decorative background blob | Legacy |
| `src/components/customCursor.js` | Custom cursor (rAF spring) | Migrated to `cursor/CustomCursor.js` |
| `src/components/seo.js` | react-helmet wrapper | Replaced by Next.js metadata export |
| `src/components/index.js` | Unused IndexPage duplicate | Legacy |
| `src/components/hooks/useScrollSpy.js` | IntersectionObserver scroll spy hook | Migrated to `animations/ScrollSpy.js` |
| `src/styles/*.js` | styled-components theme objects | Legacy, do not touch |
| `src/components/3d/` | BlobScene (R3F morphing blob) | Removed in v3 — replaced by CSS background blurs |

## Gotchas

- **Migration complete**: new and old code coexist. Do not import from old CRA into new Next.js.
- **Legacy CSS**: `src/styles/*.js` are for old CRA components. Do not touch them.
- **Test script**: `npm test` runs `vitest run` (Vitest + jsdom + @testing-library/react). Test files colocated as `*.test.js`.
- **3D blob removed**: R3F/three.js dependency removed. Background blurs in Banner.module.css replace it. The `src/components/3d/` directory is deleted.
- **Design System v3**: code-editor aesthetic. Fira Code (monospace) for headings and code. Inter for body. Dark-only theme. Pattern tokens for tabs (`--tab-active-stroke: #ffb86a`), code blocks (`--code-bg: #011627`), inputs, file explorers, and foreground containers.
- **No RevealOnScroll wrappers**: sections handle their own entrance animations inline. Each route renders its section directly.
- **Preloader removed**: the intro preloader is gone. The `src/components/preloader/` files remain but are unused.
- **`react-icons/fa` and `react-icons/si`**: used in Projects section for overlay links.
- **`react-icons/fi`**: used in Contact and SiteFrame sections for social links (FiGithub, FiLinkedin, FiMail).
- **Snake game**: canvas-based, self-contained client component. Idle pre-game state (instructions + Start Game) before play; arrow keys and on-screen buttons; food counter; neon teal glow. The game loop is cleared (paused) on win and game over, so the board freezes behind the overlay. Does not block page scroll.
- **Contact API**: POST `/api/contact` rate limited (3/hr/IP). Logs to console by default; needs SMTP_USER and SMTP_PASS env vars for email sending via Nodemailer.
