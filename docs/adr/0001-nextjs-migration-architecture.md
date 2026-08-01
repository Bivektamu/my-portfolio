# 0001 — Next.js Migration Architecture

**Status**: Accepted  
**Feature**: Scaffold & architect the migration (Roadmap #1)  
**Date**: 2026-08-01

## Context

The current portfolio site is a React 18 CRA single page app with styled-components, Lenis smooth scroll, motion parallax, a custom cursor, and a preloader. It needs to be migrated to Next.js App Router with server components. The migration is a full rewrite (not incremental) using the Skateboard build approach: ship the thinnest usable whole first, then layer in polish.

Key constraint: server components are the default. Client interactivity (cursor, scroll, theme toggle) must be isolated to leaf client components with clear boundaries.

## Proposed stack

- **Framework**: Next.js 15 (App Router)
- **Language**: JavaScript (ES6+), no TypeScript
- **Styling**: CSS Modules + CSS custom properties for theming
- **Animation**: motion (framer-motion) v12, wrapped in client components
- **Smooth scroll**: CSS `scroll-behavior: smooth` + `scroll-margin-top` for the skateboard slice; reassess Lenis in Slice 2 if the CSS approach is insufficient
- **Fonts**: `next/font/google` (Poppins)
- **Images**: `next/image`
- **SEO**: `generateMetadata` / `metadata` export (replaces react-helmet)
- **Deploy**: Vercel

## Proposed project structure

```
my-portfolio/
├── src/
│   ├── app/
│   │   ├── layout.js          # Root layout: <html>, fonts, metadata, theme script
│   │   ├── page.js            # Home page: composes all sections
│   │   ├── globals.css        # CSS custom properties, reset, typography
│   │   └── favicon.ico
│   ├── components/
│   │   ├── header/
│   │   │   ├── Header.js      # Server component
│   │   │   ├── Header.module.css
│   │   │   ├── NavItems.js    # Server component (static links)
│   │   │   ├── MobileNav.js   # Client component (hamburger toggle)
│   │   │   └── ThemeToggle.js # Client component (theme switch)
│   │   ├── sections/
│   │   │   ├── Banner.js      # Server component (static content)
│   │   │   ├── Banner.module.css
│   │   │   ├── About.js
│   │   │   ├── About.module.css
│   │   │   ├── Projects.js
│   │   │   ├── Projects.module.css
│   │   │   ├── Skills.js
│   │   │   ├── Skills.module.css
│   │   │   ├── Contact.js
│   │   │   └── Contact.module.css
│   │   ├── cursor/
│   │   │   ├── CustomCursor.js # Client component
│   │   │   └── Cursor.module.css
│   │   ├── preloader/
│   │   │   ├── Preloader.js   # Client component
│   │   │   └── Preloader.module.css
│   │   ├── animations/
│   │   │   ├── ParallaxWrapper.js  # Client component (motion wrapper)
│   │   │   ├── RevealOnScroll.js   # Client component (viewport reveal)
│   │   │   └── ScrollSpy.js        # Client component (nav highlighting)
│   │   └── Blob.js            # Client component (animated background blob)
│   └── data/
│       ├── projects.json      # Project data
│       ├── skills.json        # Skills data
│       └── social.json        # Social links
├── public/
│   └── images/                # Static images (portfolio, skills, favicon)
├── next.config.js
├── package.json
└── docs/
    ├── roadmap/
    └── adr/
```

## Decisions

### Server / client boundary

Server components (default, no directive):
- `src/app/layout.js` — root layout, metadata, theme script
- `src/app/page.js` — home page, composes section components
- All section components under `components/sections/` — static content with CSS Modules
- `components/header/Header.js` — static header layout
- `components/header/NavItems.js` — static nav links

Client components (`"use client"`):
- `components/header/MobileNav.js` — needs `useState` for open/close
- `components/header/ThemeToggle.js` — needs `useState`, localStorage
- `components/cursor/CustomCursor.js` — needs mouse events, rAF
- `components/preloader/Preloader.js` — needs useEffect, setTimeout chain
- `components/animations/ParallaxWrapper.js` — wraps motion for scroll transforms
- `components/animations/RevealOnScroll.js` — wraps motion for viewport reveals
- `components/animations/ScrollSpy.js` — needs IntersectionObserver
- `components/Blob.js` — animated decorative element

Pattern: the section component is a server component. Animations are added by wrapping the section's *output* in a thin client component. The section itself stays server-renderable.

```
<ParallaxWrapper>         {/* client: handles motion transforms */}
  <Banner />              {/* server: static HTML + CSS */}
</ParallaxWrapper>
```

### Theme system

CSS custom properties on `:root` and `[data-theme="dark"]` selectors. A small inline `<script>` in the root layout reads localStorage and sets `data-theme` before paint to avoid a flash. The `ThemeToggle` client component writes to localStorage and sets `data-theme`.

No React context needed for theme: every component reads CSS variables directly. This is the key simplification from the current styled-components ThemeProvider approach.

### Smooth scroll

In the skateboard slice: CSS `scroll-behavior: smooth` on `<html>` and `scroll-margin-top` on each section to account for the fixed header. This works without JavaScript and is sufficient for a portfolio. If the scroll feel is not smooth enough, Lenis can be added in Slice 2 as an optional enhancement.

### Preloader

A client component that guards body visibility with a `loading` state. It runs the same timeout chain as the current site (blob scale, heading animation, header reveal) but uses CSS animation classes triggered by state changes rather than direct DOM manipulation. When the sequence completes, it sets `loading: false`, which unmounts the preloader and allows the page to scroll.

### Data layer

Static JSON files in `src/data/` for projects, skills, and social links. Imported directly in server components. No API routes, no database. This is a static portfolio.

### Image handling

`next/image` for all images with explicit `width`/`height` to avoid layout shift. Images that are purely decorative (blob) can use `next/image` with `priority` for the banner image and lazy loading for below the fold content.

## Consequences

- **Positive**: Server rendered HTML is fast and SEO friendly. CSS Modules are co-located and zero runtime. CSS custom properties eliminate the ThemeProvider context. No more CRA build chain.
- **Negative**: The wrapper pattern for animations means each section has a thin JS client component wrapping it. This is unavoidable since motion needs the client. The preloader chain is still a timeout based sequence (no better primitive exists for sequenced intro animations).
- **Follow-up**: If CSS smooth scroll is not good enough, add Lenis in Slice 2. The custom cursor may need the `settings.cursor` global state pattern if hover states need coordination across components; if so, a small React context for cursor state only (not all settings) will be added.

## Build plan

1. **Scaffold**: `npx create-next-app@latest` with App Router, src directory, no TypeScript, no Tailwind, no ESLint (added by /audit)
2. **Directory structure**: create `components/sections/`, `components/cursor/`, `components/preloader/`, `components/animations/`, `src/data/`
3. **Global styles**: CSS custom properties for theme tokens, reset, typography in `globals.css`
4. **Root layout**: fonts via `next/font/google`, metadata, theme inline script
5. **Copy assets**: migrate `public/images/` from the old project
6. **Verify**: `npm run dev` starts, root layout renders with correct fonts and theme variables
