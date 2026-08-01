# 0002 — Scroll Parallax & Animations

**Status**: Accepted
**Feature**: Scroll driven parallax & animations (Roadmap #10)

## Context

The old site used motion (framer-motion) `useScroll` and `useTransform` for banner parallax (text moves faster than image), about section parallax, and section reveal animations. These need client components in Next.js.

## Decision

Wrap each section in a thin client component that handles motion transforms. The section component itself stays a server component rendering static HTML. The wrapper adds scroll-driven transforms via `useScroll` + `useTransform`.

Approach:
- `ParallaxBanner` — client wrapper around `<Banner />`, adds `useScroll()` → text y: [0, -150], image y: [0, 50]
- `ParallaxAbout` — client wrapper around `<About />`, adds `useScroll()` with target ref, text y: [50, -50], image y: [-50, 50]
- `RevealOnScroll` — wraps any element with `motion.div` and `whileInView` variants for fade-up reveals

Build plan:
1. Install motion dependency (already in package.json)
2. Create `ParallaxBanner` client component
3. Create `ParallaxAbout` client component
4. Create `RevealOnScroll` client component
5. Update `page.js` to use wrappers
