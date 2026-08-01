# Portfolio Site — Next.js Migration

Build approach: Skateboard — ship the thinnest usable whole first, then layer in polish

## At a glance

| # | Feature | Phase | Weight | Needs ADR | Status |
|---|---|---|---|---|---|
| 1 | Scaffold & architect the migration | Foundation | full | yes | done |
| 2 | Coding standards & tooling | Foundation | lean | no | done |
| 3 | Global styles & theme tokens | Foundation | medium | no | done |
| 4 | Header & navigation | Skateboard | medium | no | done |
| 5 | Home / Banner section | Skateboard | medium | no | done |
| 6 | About section | Skateboard | lean | no | done |
| 7 | Projects section | Skateboard | medium | no | done |
| 8 | Skills section | Skateboard | lean | no | done |
| 9 | Contact / Footer section | Skateboard | lean | no | done |
| 10 | Scroll driven parallax & animations | Slice 2 | medium | yes | done |
| 11 | Scroll spy & smooth scroll | Slice 2 | medium | yes | done |
| 12 | Theme toggle (light / dark) | Slice 3 | medium | yes | done |
| 13 | Custom cursor | Slice 3 | medium | no | done |
| 14 | Intro preloader sequence | Slice 4 | medium | no | done |
| 15 | SEO metadata | Slice 5 | lean | no | done |
| 16 | Responsive polish & deploy | Slice 5 | medium | no | done |

## Foundation

### 1. Scaffold & architect the migration

Intent: Initialize a fresh Next.js App Router project, decide the project structure, component boundaries, and how each legacy concern (theme, cursor, scrolling, preloader) maps to the server component model. This is the single architecture decision that sets the shape of every feature after it.

Done when: `npx create-next-app` runs clean, the directory tree matches the agreed structure, and the architecture ADR is filed in `docs/adr/`.

- [x] Design it: `/blueprint` — ARCHITECTURE ADR [ADR 0001](./adr/0001-nextjs-migration-architecture.md)

### 2. Coding standards & tooling

Intent: Run `/audit` on the scaffolded Next.js project to capture conventions and tooling choices (lint, format, pre-commit), then install them. Lightweight: the existing project conventions carry over.

Done when: root AGENTS.md updated for Next.js, lint/format/pre-commit configured and passing.

- [x] `/audit`

### 3. Global styles & theme tokens

Intent: Port the global reset, typography (Poppins), and light/dark color tokens from the current styled-components theme into CSS custom properties. The theme lives on `:root` / `[data-theme="dark"]` selectors so every component (server or client) reads it with zero runtime cost. One CSS file that replaces `globalStyles.js` and both theme objects.

Done when: CSS custom properties for all colors and shadows are defined, global reset and typography render correctly, and a quick theme toggle in DevTools produces the expected light and dark palettes.

- [x] `/develop Global styles & theme tokens`

## Skateboard (thinnest usable whole)

### 4. Header & navigation

Intent: A responsive header with the developer's name/logo on the left and nav links on the right. Nav links scroll smoothly to each section. On mobile, a hamburger menu toggles the nav. The nav items are built from the section IDs present on the page rather than hardcoded.

Done when: header renders on every page, nav links scroll to the correct section, hamburger toggle works on mobile viewports, and the header gets a fixed/sticky style on scroll.

- [x] `/develop Header & navigation`

### 5. Home / Banner section

Intent: The hero section: profile image, name, tagline, and a call to action. This is the first thing a visitor sees. Static server component in the skateboard slice; parallax and cursor effects come later.

Done when: banner renders with the profile image, name, tagline, and a visible CTA button that scrolls to the projects or contact section.

- [x] `/develop Home / Banner section`

### 6. About section

Intent: A short bio section with a profile image and a few paragraphs about the developer. Straightforward static content.

Done when: about section renders with the profile image and bio text, layout matches the original on desktop and mobile.

- [x] `/develop About section`

### 7. Projects section

Intent: A grid of project cards, each with a thumbnail, title, description, and external link. This is the portfolio's main showcase. Static content in the skateboard; hover effects and cursor states come later.

Done when: all project cards render in a responsive grid, each card shows its thumbnail and title, and external links open correctly.

- [x] `/develop Projects section`

### 8. Skills section

Intent: A grid of skill icons and labels, plus a brief experience or tools panel. Static content.

Done when: skills grid renders with icons and labels, layout is responsive, and all images load without errors.

- [x] `/develop Skills section`

### 9. Contact / Footer section

Intent: Footer with social links (GitHub, LinkedIn, email), a short call to action, and copyright. Simple static section.

Done when: footer renders with working social links, email link opens the mail client, and copyright is visible.

- [x] `/develop Contact / Footer section`

## Slice 2 — Animations & motion

### 10. Scroll driven parallax & animations

Intent: Port the scroll driven parallax effects from the current site. The banner text and image shift at different speeds on scroll, and section content fades or slides in as it enters the viewport. Uses motion (framer-motion) in client components, wrapped around the static content built in the skateboard slice.

Done when: banner parallax shifts text and image on scroll, each section content animates on first viewport entry, and animations run at 60fps on desktop and mobile.

- [x] Design it: `/blueprint Scroll driven parallax`

### 11. Scroll spy & smooth scroll

Intent: As the user scrolls, the active nav link highlights to match the visible section. Smooth scrolling between sections when a nav link is clicked. Replace the current imperative `document.querySelectorAll` scroll spy with an IntersectionObserver based approach, and replace Lenis with either a lightweight smooth scroll or CSS `scroll-behavior: smooth`.

Done when: the active nav link updates as the user scrolls through sections, clicking a nav link smoothly scrolls to that section, and the scroll experience feels natural on desktop and mobile.

- [x] Design it: `/blueprint Scroll spy & smooth scroll`

## Slice 3 — Interactivity

### 12. Theme toggle (light / dark)

Intent: A toggle button in the header that switches between light and dark themes. The theme is persisted to localStorage and read on next visit. Since the theme tokens are already CSS custom properties (Feature 3), the toggle simply sets a `data-theme` attribute on `<html>` and writes to localStorage. This can be a small client component that runs a script to avoid a flash of wrong theme.

Done when: clicking the toggle switches the color scheme instantly, the preference survives a page reload, and there is no visible flash of the wrong theme on first load.

- [x] Design it: `/blueprint Theme toggle`

### 13. Custom cursor

Intent: A custom cursor dot that follows the mouse with a spring like lerp, only active above 999px viewport. Hovering interactive elements changes the cursor style (grows, adds a border). This is a pure client component with rAF interpolation, ported directly from the current `customCursor.js`.

Done when: cursor dot follows the mouse smoothly, hover states on links and cards change the cursor appearance, and the cursor is hidden below 999px viewport.

- [x] `/develop Custom cursor`

## Slice 4 — Preloader

### 14. Intro preloader sequence

Intent: The branded intro animation: body hidden, blob scales in, banner headings animate, header reveals, then the page is ready. Port the current `Layout.preloader()` timeout chain into a Next.js friendly approach (a client component that gates body visibility and orchestrates CSS animation classes).

Done when: the preloader sequence plays on first visit, the blob scales and animates, headings stagger in, the header reveals, and the page scrolls normally after the sequence completes.

- [x] `/develop Intro preloader sequence`

## Slice 5 — Polish & deploy

### 15. SEO metadata

Intent: Replace the current `react-helmet` SEO component with Next.js native `metadata` export and `generateMetadata`. Set title, description, OG tags, favicon, and the Google Fonts link. This is server side, zero client cost.

Done when: title and description appear in the browser tab, OG tags render correctly when shared on social media, and Lighthouse SEO score is 100.

- [x] `/develop SEO metadata`

### 16. Responsive polish & deploy

Intent: Test every section on real mobile viewports, fix any layout issues, verify touch scrolling and tap targets, then deploy to Vercel. This is the final pass that makes the site production ready.

Done when: the site looks correct on 320px, 375px, 768px, and 1024px+ viewports, Lighthouse scores are all green, and the site is live on a public URL.

- [x] `/develop Responsive polish & deploy`

## Legend

**Status**: `planned` (not started) · `in-progress` (building) · `done` (built and verified) · `existing` (pre-dates this workflow) · `dropped` (de-scoped)

**Weight**: `lean` (skip design review and harden) · `medium` (normal path) · `full` (design review and harden required)

**Phase**: `Foundation` (scaffolding, standards, design system) · `Skateboard` (thinnest usable whole) · `Slice 2` · `Slice 3` · `Slice 4` · `Slice 5`
