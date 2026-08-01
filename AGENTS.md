# portfolio-site

## Stack

- **Language / Runtime**: JavaScript (ES6+), Node 20+
- **Framework**: Next.js 16.2 (App Router), React 19.2
- **Key dependencies**: motion 12 (framer-motion), lenis 1.3 (smooth scroll), react-icons 4
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

Stored in `docs/adr/`. Active: [0001 — Next.js Migration Architecture](./docs/adr/0001-nextjs-migration-architecture.md).

## Rules

- **Server-first**: components are server components by default. Only add `"use client"` when you need browser APIs (state, effects, events, media queries, motion).
- **Section architecture**: 5 `<section>` blocks (home, about, project, skill, contact) composed in `src/app/page.js`. Each is a server component in `src/components/sections/` with a co-located CSS Module.
- **Styling**: CSS Modules (new code) — `Component.js` + `Component.module.css` side by side. CSS custom properties on `:root` / `[data-theme="dark"]` for theming. Zero runtime cost. Legacy `src/styles/` (styled-components) is migration-only, do not extend.
- **Theme**: `data-theme` attribute on `<html>`. Set via inline script in root layout (before paint, no flash). Client components read/write via `localStorage`. No React context for theme.
- **Fonts**: `next/font/google` in root layout — Poppins, loaded as CSS variable.
- **Smooth scroll**: CSS `scroll-behavior: smooth` + `scroll-margin-top` on sections (skateboard slice). Lenis reassessed in Slice 2.
- **Animation wrapper pattern**: section component = server (static HTML). Thin client wrapper (e.g. `ParallaxWrapper`) wraps the section output to add motion transforms. Section stays server-renderable.
- **Data**: static JSON files in `src/data/` (projects, skills, social). Imported directly in server components — no API routes, no database.
- **Migration state**: old CRA components (`src/components/*.js`) and styled-components styles (`src/styles/*.js`) coexist during migration. `src/index.js` and `src/App.js` are legacy — the real entry is `src/app/layout.js`.

## Context files

- [src/components/AGENTS.md](./src/components/AGENTS.md) — component architecture, migration state, and gotchas
- [src/components/sections/AGENTS.md](./src/components/sections/AGENTS.md) — section conventions and stubs
