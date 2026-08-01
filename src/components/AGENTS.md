# Components

## Overview

This directory is in active migration from CRA (with styled-components) into Next.js App Router (with CSS Modules). Old CRA files coexist with new Next.js structure until each slice is migrated. The road map is at [docs/roadmap/roadmap.md](../../docs/roadmap/roadmap.md).

The foundation is scaffolded: Next.js 16 with App Router, CSS custom properties for theming, next/font/google for Poppins, and section stubs under sections/. The skateboard slice (static sections with CSS Modules) is next for development.

## New Next.js structure (Active)

| Directory / File | Owns | Status |
|---|---|---|
| sections/Banner.js | Home/hero section (server component) | Stub |
| sections/About.js | About section (server component) | Stub |
| sections/Projects.js | Projects portfolio grid (server component) | Stub |
| sections/Skills.js | Skills grid (server component) | Stub |
| sections/Contact.js | Footer + social links (server component) | Stub |
| header/ | Header, NavItems, MobileNav, ThemeToggle | Empty |
| cursor/ | Custom cursor with spring follow | Empty |
| preloader/ | Intro preloader sequence | Empty |
| animations/ | ParallaxWrapper, RevealOnScroll, ScrollSpy | Empty |
| ui/bannerSvg.tsx | Unused TypeScript stub | Do not use |

## Legacy CRA files (During Migration)

| File | Owns | Notes |
|---|---|---|
| layout.js | GlobalContext, ThemeProvider, Lenis, preloader, scroll-spy | Replaced by src/app/layout.js |
| Header.js | Old header with DOM-query nav, theme toggle | Replaced by header/ directory |
| banner.js, about.js, project.js, skill.js, contact.js | Old section components with motion parallax | Replaced by sections/ |
| NavItem.js | Old nav link with Lenis scroll | Replaced by header/NavItems.js |
| ProjectCard.js | Animated project card wrapper | Replaced by animations/RevealOnScroll.js |
| Blob.jsx | Decorative background blob | Migrate to root components dir |
| customCursor.js | Custom cursor (rAF spring) | Migrate to cursor/CustomCursor.js |
| seo.js | react-helmet wrapper | Replaced by Next.js metadata export |
| index.js | Unused IndexPage duplicate | Will be deleted |
| hooks/useScrollSpy.js | IntersectionObserver scroll spy hook | Migrate to animations/ScrollSpy.js |

## Conventions

- File naming: PascalCase for component files. One module CSS file per component: Banner.module.css, Header.module.css.
- Server/client boundary: no directive = server component. Add use client only when using browser APIs.
- Section IDs: home, about, project, skill, contact. Do not change these.
- Motion imports: always from motion/react, not framer-motion.
- Data imports: server components import JSON directly from src/data/. No fetch needed for static data.
- Animation wrappers: parallax and reveal effects are added by wrapping the section output in a client component from animations/.
- Theme variables: use CSS custom properties in CSS Modules. No JavaScript theme objects or context.

## Gotchas

- Migration is partial: new and old code coexist. Do not import from old CRA into new Next.js.
- Empty directories: header/, cursor/, preloader/, animations/, data/ are scaffolded but empty.
- Legacy CSS files: src/styles/*.js are for old CRA components. Do not touch them.
- Test script is CRA-era: npm test still uses react-scripts test.
- No CSS Modules yet: section stubs lack .module.css files.

## Related ADRs

- [0001 - Next.js Migration Architecture](../../docs/adr/0001-nextjs-migration-architecture.md)
