# portfolio-site

## Stack

- **Language / Runtime**: JavaScript (ES6+), Node 20+
- **Framework**: Next.js 16.2 (App Router), React 19.2
- **Key dependencies**: motion 12 (framer-motion), lenis 1.3 (smooth scroll), react-icons 4, @react-three/fiber + @react-three/drei + three (3D blob)
- **Styling**: CSS Modules (new) + CSS custom properties for theming. Legacy styled-components remain in package.json during migration.
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

# Lint
npm run lint

# Test (Jest + React Testing Library, CRA-era)
npm test
```

## ADRs

Stored in `docs/adr/`. Active:
- [0001 — Next.js Migration Architecture](./docs/adr/0001-nextjs-migration-architecture.md)
- [0002 — Scroll Parallax](./docs/adr/0002-scroll-parallax.md)
- [0003 — Scroll Spy](./docs/adr/0003-scroll-spy.md)
- [0004 — Theme Toggle](./docs/adr/0004-theme-toggle.md)
- [0005 — Banner Reimagined](./docs/adr/0005-banner-reimagined.md)
- [0006 — 3D Interactive Background](./docs/adr/0006-3d-interactive-background.md)

## Rules

- **Server-first**: components are server components by default. Only add `"use client"` when you need browser APIs (state, effects, events, media queries, motion).
- **Section architecture**: 5 `<section>` blocks (home, about, project, skill, contact) composed in `src/app/page.js`. Each section in `src/components/sections/` with a co-located CSS Module. Sections that use motion hooks (parallax, stagger reveals) carry `"use client"` directly. RevealOnScroll from `src/components/animations/` wraps sections that only need entrance animations.
- **Section IDs are fixed**: `home`, `about`, `project`, `skill`, `contact`. These match nav anchors. Do not change them. Note: the projects section uses `project` id (singular), not `projects`.
- **Styling**: CSS Modules — `Component.js` + `Component.module.css` side by side. CSS custom properties on `:root` / `[data-theme="dark"]` for theming. Dark-first: default theme is dark (tokens on `:root`). Light theme lives under `[data-theme="light"]`. Use `--glass-bg`, `--glass-border`, `--glass-blur` tokens for backdrop-filter cards and panels. Legacy `src/styles/` (styled-components) is migration-only, do not extend.
- **Theme**: `data-theme` attribute on `<html>`. Set via inline script in root layout (before paint, no flash). Client components read/write via `localStorage`. No React context for theme.
- **Fonts**: `next/font/google` in root layout — Poppins, loaded as CSS variable.
- **Smooth scroll**: CSS `scroll-behavior: smooth` + `scroll-margin-top` on sections (skateboard slice). Lenis reassessed in Slice 2.
- **Animation wrapper pattern**: RevealOnScroll wraps sections that only need entrance animations. Sections with parallax or stagger carry `"use client"` directly. 3D components (R3F) are lazy loaded via `next/dynamic({ ssr: false })` and skip on mobile.
- **Motion imports**: always from `motion/react`, not `framer-motion`.
- **R3F components**: lazy load via `next/dynamic({ ssr: false })`, skip on mobile (`innerWidth < 768`), respect `prefers-reduced-motion`. R3F (~150KB) is code-split.
- **Data**: static JSON files in `src/data/` (projects, skills, social). Imported directly in server components — no API routes, no database. Note: currently data is hardcoded in section components; `src/data/` directory does not exist yet.
- **Images**: use Next.js `Image` from `next/image` with explicit `width`/`height` and `sizes` attribute.
- **File naming**: PascalCase for components. One CSS Module per component: `Banner.js` + `Banner.module.css`.

## Directory map

| Directory / File | Owns | Status |
|---|---|---|
| `src/app/layout.js` | Root layout, fonts, metadata, inline theme script, preloader, noise overlay | Done |
| `src/app/page.js` | Composes 5 sections | Done |
| `src/app/globals.css` | CSS custom properties, reset, design tokens | Done |
| `src/components/sections/Banner.js` | Hero — character stagger reveal, animated gradient bg, glass CTA, 3D blob, 3-layer parallax | Done |
| `src/components/sections/About.js` | About — creative image frame, staggered paragraph reveals, scroll parallax | Done |
| `src/components/sections/Projects.js` | Projects grid — glass cards, backdrop-blur overlays, staggered entrance | Done |
| `src/components/sections/Skills.js` | Skills grid — animated cards, gradient accent experience panel | Done |
| `src/components/sections/Contact.js` | Contact — animated social pills, gradient hover states | Done |
| `src/components/header/` | Header, MobileNav, ThemeToggle | Done |
| `src/components/cursor/` | CustomCursor with rAF lerp, hover state detection | Done |
| `src/components/preloader/` | Intro preloader sequence (blob animation) | Done |
| `src/components/animations/` | RevealOnScroll, ScrollSpy, NoiseOverlay (SVG grain texture) | Done |
| `src/components/3d/` | BlobScene (R3F morphing blob, mouse parallax, mobile skip) | Done |
| `src/components/hooks/` | useMagnetic (magnetic hover hook, radius + strength config) | Done |

## Legacy CRA files

| File | Owns | Notes |
|---|---|---|
| `src/components/layout.js` | GlobalContext, ThemeProvider, Lenis, preloader, scroll-spy | Replaced by `src/app/layout.js` |
| `src/components/Header.js` | Old header with DOM-query nav, theme toggle | Replaced by `header/` directory |
| `src/components/banner.js`, `about.js`, `project.js`, `skill.js`, `contact.js` | Old section components with motion parallax | Replaced by `sections/` |
| `src/components/NavItem.js` | Old nav link with Lenis scroll | Replaced by `header/` |
| `src/components/ProjectCard.js` | Animated project card wrapper | Replaced by `animations/RevealOnScroll.js` |
| `src/components/Blob.jsx` | Decorative background blob | Legacy |
| `src/components/customCursor.js` | Custom cursor (rAF spring) | Migrated to `cursor/CustomCursor.js` |
| `src/components/seo.js` | react-helmet wrapper | Replaced by Next.js metadata export |
| `src/components/index.js` | Unused IndexPage duplicate | Legacy |
| `src/components/hooks/useScrollSpy.js` | IntersectionObserver scroll spy hook | Migrated to `animations/ScrollSpy.js` |
| `src/styles/*.js` | styled-components theme objects | Legacy, do not touch |

## Gotchas

- **Migration complete**: new and old code coexist. Do not import from old CRA into new Next.js.
- **Legacy CSS**: `src/styles/*.js` are for old CRA components. Do not touch them.
- **Test script is CRA-era**: `npm test` still uses `react-scripts test`.
- **3D blob**: R3F (~150KB) is code-split via `next/dynamic`. Never loads on mobile (`innerWidth < 768`). The `::before` CSS gradient dims when 3D is active via `[data-3d]`.
- **data/ directory**: no JSON data files exist yet. Projects, skills, and social data are hardcoded in section components.
- **Preloader**: gates body visibility. Banner `animate` prop fires after preloader unblocks children.
- **`react-icons/fa` and `react-icons/si`**: used in Projects section for overlay links.
- **`react-icons/fi`**: used in Contact section for social links (FiGithub, FiLinkedin, FiMail, FiTwitter).
- **`react-icons/im`**: used in Skills section for phone icon (ImPhone).
