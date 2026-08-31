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
| 8 | Skills section | Skateboard | lean | no | dropped |
| 9 | Contact / Footer section | Skateboard | lean | no | done |
| 10 | Scroll driven parallax & animations | Slice 2 | medium | yes | done |
| 11 | Scroll spy & smooth scroll | Slice 2 | medium | yes | done |
| 12 | Theme toggle (light / dark) | Slice 3 | medium | yes | dropped |
| 13 | Custom cursor | Slice 3 | medium | no | done |
| 14 | Intro preloader sequence | Slice 4 | medium | no | done |
| 15 | SEO metadata | Slice 5 | lean | no | done |
| 16 | Responsive polish & deploy | Slice 5 | medium | no | done |
| 17 | Visual design system v2 | Foundation | medium | yes | done |
| 18 | Banner reimagined | Skateboard | medium | yes | done |
| 19 | Projects showcase elevated | Skateboard | medium | no | done |
| 20 | About & Skills sections elevated | Skateboard | lean | no | done |
| 21 | Contact section elevated | Skateboard | lean | no | done |
| 22 | 3D interactive background | Slice 2 | full | yes | done |
| 23 | Advanced micro-interactions | Slice 2 | medium | no | done |
| 24 | Page transitions & noise overlay | Slice 2 | medium | no | done |
| 25 | Performance optimization | Slice 3 | lean | no | done |
| 26 | Design system v3 (Code-editor aesthetic) | Foundation | medium | yes | done |
| 27 | Extract content data to JSON | Foundation | lean | no | done |
| 28 | Header redesign (Tab nav, Fira Code) | Skateboard | medium | no | done |
| 29 | Home / Banner redesign | Skateboard | medium | yes | done |
| 30 | Snake game (playable, scored) | Skateboard | full | yes | done |
| 31 | About redesign (File explorer, code snippets, gists) | Skateboard | medium | yes | done |
| 32 | Projects redesign (Tech filters, new cards) | Skateboard | medium | no | done |
| 33 | Skills redesign | Skateboard | lean | no | dropped |
| 34 | Contact redesign (Form with validation states) | Skateboard | medium | no | done |
| 35 | Contact form backend (API route + email) | Slice 2 | medium | yes | done |
| 36 | 404 page | Skateboard | lean | no | done |
| 37 | Responsive polish & mobile QA | Slice 3 | lean | no | done |
| 38 | Accessibility audit (WCAG AA) | Slice 3 | lean | no | done |
| 39 | Performance optimization v2 | Slice 3 | lean | no | done |
| 40 | Multi-page routing & snake game update | Slice 3 | medium | yes | done |
| 41 | Unified IDE window (SiteFrame layout) | Slice 3 | medium | yes | done |

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

## Slice 6 — Awwwards Visual Upgrade

### 17. Visual design system v2

Intent: Redefine the site's visual language to Awwwards level. A refined, sophisticated color palette (deep dark default with vibrant accents), an expanded typography scale with bold display sizes (clamp based fluid type), glassmorphism surface tokens, gradient presets, and a subtle noise texture token. Every section inherits these new tokens so the whole site feels premium and cohesive.

Done when: new CSS custom properties defined in globals.css (colors, gradients, type scale, glass surfaces, shadows), dark theme is the new default with light as alternative, and all existing sections render correctly with the new tokens.

Needs ADR: yes — the design direction (color palette, typography scale, dark-first strategy) is a decision.

- [x] Design it: `/blueprint Visual design system v2` — design tokens in globals.css

### 18. Banner reimagined

Intent: A striking hero that sets the Awwwards tone immediately. Oversized split text heading with staggered letter/word reveal on load, a gradient or animated mesh background, the profile image with a creative mask or frame, and a sculpted magnetic CTA button. This is the first impression that signals "premium."

Done when: banner renders with bold oversized typography, text animates in on load with a stagger effect, the background has a dynamic gradient or animated pattern, the CTA button has a magnetic hover effect, and the parallax on scroll still works.

Needs ADR: yes — the animation choreography and text-splitting approach are decisions.

- [x] Design it: `/blueprint Banner reimagined` — [ADR 0005](./adr/0005-banner-reimagined.md)

### 19. Projects showcase elevated

Intent: A showcase grid that feels curated and interactive. Masonry or staggered asymmetric grid instead of uniform cards. Each project card has a hover image parallax or reveal effect, smooth entrance animations, and overlay links that feel tactile. The NPM libraries section gets the same treatment.

Done when: project cards render in a visually interesting grid layout, hover triggers an image scale/reveal effect, cards animate in as they enter the viewport, and the overlay links have smooth transitions.

- [x] `/develop Projects showcase elevated`

### 20. About & Skills sections elevated

Intent: The About section gets a creative split layout (large profile image with a decorative frame on one side, bio text with staggered reveal on the other). The Skills section gets animated skill bars or a dynamic icon grid with hover glow effects and a smooth marquee for additional tech stack.

Done when: About section has an image with creative framing and text that reveals on scroll, Skills section has animated indicators or a dynamic grid with hover effects, and both sections feel cohesive with the new design system.

- [x] `/develop About & Skills sections elevated`

### 21. Contact section elevated

Intent: A bold, minimal contact section. Large typography CTA with an animated underline, social links as oversized interactive pills, and a subtle animated gradient or particle background that ties back to the banner. Clean, confident, and inviting.

Done when: contact section has bold typography, social links have interactive hover states, and the background has a subtle animated element that echoes the banner.

- [x] `/develop Contact section elevated`

## Slice 7 — 3D & Advanced Interactions

### 22. 3D interactive background

Intent: A Three.js (react-three-fiber) interactive 3D element — a morphing blob, particle field, or geometric shape — that responds subtly to mouse movement. It sits behind or alongside the banner and possibly the contact section, adding depth and a signature Awwwards "wow" factor without hurting performance.

Done when: a 3D element renders and responds to mouse position, it performs at 60fps on desktop, it degrades gracefully on mobile (static fallback or hidden), and it integrates visually with the banner and/or contact section.

Needs ADR: yes — choosing Three.js/R3F, the 3D asset approach, and the performance strategy.

- [x] Design it: `/blueprint 3D interactive background` — [ADR 0006](./adr/0006-3d-interactive-background.md)

### 23. Advanced micro-interactions

Intent: Layer in the small details that make a site feel alive. Magnetic hover on buttons and links (elements gently pull toward the cursor), text underline reveal animations on link hover, image scale/distortion on card hover, and enhanced cursor states (cursor grows over links, shrinks over text, hides over media). These are the details that separate good from great.

Done when: buttons and links have a magnetic hover effect, link underlines animate in, card images have a subtle scale on hover, and the custom cursor changes state based on the hovered element type.

- [x] `/develop Advanced micro-interactions`

### 24. Page transitions & noise overlay

Intent: A subtle grain/noise SVG overlay across the entire site for texture (a classic Awwwards technique). Smooth section entrance animations as the user scrolls (elements slide up and fade in with staggered timing). The noise overlay is a fixed, non-interactive layer with very low opacity so it adds texture without being distracting.

Done when: a noise/grain overlay is visible across the site at low opacity, sections animate in smoothly on scroll with stagger effects, and the overlay does not impact scroll or click interactions.

- [x] `/develop Page transitions & noise overlay`

## Slice 8 — Final Polish

### 25. Performance optimization

Intent: With all the visual upgrades, 3D, and animations in place, audit and optimize to ensure the site stays fast. Lazy load the 3D component, optimize images with next/image, defer non critical animations, and ensure Core Web Vitals stay green. The site must feel premium AND fast.

Done when: Lighthouse Performance score is 90+, the 3D element lazy loads and doesn't block first paint, all images use next/image with proper sizing, and the site feels snappy on scroll and interaction on desktop and mobile.

- [x] `/develop Performance optimization`

## Foundation — Code-Editor Redesign

### 26. Design system v3 (Code-editor aesthetic) `done`

Intent: Replace the current Awwwards glassmorphism design system with a code-editor and terminal inspired visual language. New font stack (Fira Code for display and headings, Inter for body), a dark code-editor color palette drawn from the design tokens (`#020618` background, `#0f172b` surfaces, `#f8fafc` text, accent colors `#615fff` blue, `#00d5be` green, `#c27aff` purple, `#ffb86a` orange, `#46ecd5` teal), 8px border radius tokens, and blur effect tokens. CSS custom properties in globals.css replace the v2 tokens. The design is dark-first with a light theme alternative. Existing components (cursor, noise overlay, scroll spy, preloader) are retained and adapted to the new tokens.

Done when: globals.css defines the full v3 token set, Fira Code and Inter load via next/font/google, all existing sections render with the new tokens, and the theme toggle still switches light/dark.

- [x] Design it: `/blueprint Design system v3 (Code-editor aesthetic)` — [ADR 0007](../adr/0007-design-system-v3.md)
- [x] Build it: `/develop Design system v3`
  - Update font loading in layout.js (AC-1)
  - Rewrite globals.css with v3 tokens (AC-2 to AC-6)
  - Remove 3D blob and clean up references (AC-7)
  - Adapt surviving components to v3 tokens (AC-7)
  - Verify token coverage against tokens.json
- [x] Verify it: `/verify Design system v3`
- [x] Test it: `/test Design system v3`

### 27. Extract content data to JSON

Intent: Move all hardcoded content (projects array, skills array, social links, personal info text) out of section components into static JSON files under `src/data/`. Each section imports its data file. This makes content edits trivial and keeps components focused on rendering.

Done when: `src/data/projects.json`, `src/data/skills.json`, `src/data/socials.json`, and `src/data/personal.json` exist and are imported by their respective section components. No content strings remain hardcoded in JSX.

- [x] `/develop Extract content data to JSON`

## Skateboard — All Sections Redesigned

### 28. Header redesign (Tab nav, Fira Code)

Intent: A code-editor inspired header. The logo "BIVEK" in Fira Code with a tab-like container, navigation menu items rendered as editor tabs with an active orange stroke (`#ffb86a`). On mobile, a hamburger menu opens a full dropdown. The header sits inside the foreground container matching the design's 70px padding frame.

Done when: header renders with Fira Code logo in a tab container, nav links are styled as editor tabs, active section has the orange stroke indicator, mobile hamburger opens a dropdown menu, and the header is fixed on scroll.

- [x] `/develop Header redesign (Tab nav, Fira Code)`

### 29. Home / Banner redesign · Needs ADR

Intent: A split home section. Left side: the developer introduction ("Hi there, I'm"), name in large Fira Code display, job title, and a row of social link buttons. Right side: the interactive snake game area (feature 30). Below, a secondary row with call-to-action links. The layout sits inside the home foreground container with the design's background blur effects (blue and green blurs at 174px).

Done when: introduction text, name (48px Fira Code), job title, and social link buttons render on the left, the snake game area is positioned on the right, background blurs are present, and the layout matches the design on desktop and mobile.

- [x] Design it: `/blueprint Home / Banner redesign`

### 30. Snake game (playable, scored) · Needs ADR · full

Intent: A fully playable Snake game embedded in the home section. The player controls a snake that eats food to grow, avoiding walls and its own tail. Features: arrow key and on-screen button controls, score tracking, game-over state with "Game Over" display and a "Start Again" button, and a "Well Done" state on reaching a high score. The game board uses the dark code-editor background (`#011627`) with teal snake body (`#46ecd5`). Built as a self-contained client component so it does not block the page.

Done when: snake moves with arrow keys and on-screen buttons, eating food increases score and snake length, collision with walls or self triggers game-over state, start-again resets the game, and the game runs at smooth frame rate without affecting page scroll.

- [x] Design it: `/blueprint Snake game`

### 31. About redesign (File explorer, code snippets, gists) · Needs ADR

Intent: A code-editor file-explorer layout. Left sidebar: a vertical accordion of pages (personal-info, professional-info, hobbies) with folder icons and expandable file items. Main area: editor tabs at the top, and two panels side by side. The left panel shows a code-snippet styled bio with line numbers and a scrollbar. The right panel shows GitHub gist style cards (user avatar, username, timestamp, star count, code block preview) showcasing code snippets. Clicking a sidebar file switches the main content.

Done when: file explorer sidebar renders with expandable folders and file items, clicking a file opens the corresponding content, bio panel renders with line numbers and scroll, gist cards render with avatar, username, stars, and code preview, and the layout matches the design on desktop and mobile.

- [x] Design it: `/blueprint About redesign`

### 32. Projects redesign (Tech filters, new cards)

Intent: A projects section with a technology filter sidebar. Left sidebar: checkboxes for each technology (React, HTML, CSS, Vue, Angular, Gatsby, Flutter, etc.) with check icons. Main area: a grid of project cards with rounded top images, card bodies with project title and description, and a link icon button. Selecting technologies filters the visible projects. Cards have hover states with an elevated shadow effect.

Done when: technology checkboxes render and filter projects on click, project cards render with images, titles, descriptions, and link buttons, hover states show the elevated effect, and the layout is responsive.

- [x] `/develop Projects redesign (Tech filters, new cards)`

### 33. Skills redesign

Intent: The skills section adapted to the new code-editor aesthetic. Skills are displayed as technology tags with icon and label, matching the design's technology chip style (icon + name in a bordered container). The experience panel with "7 Years of Working Experience" and the call button is retained but restyled with the new tokens.

Done when: skill chips render with icons and labels in the new style, the experience panel is restyled with v3 tokens, and the layout matches the design on desktop and mobile.

- [x] `/develop Skills redesign`

### 34. Contact redesign (Form with validation states)

Intent: A contact section split into two panels. Left panel: a form with name, email, and message fields in the code-editor input style (dark background, border stroke, error states with red border and error icon). Right panel: a live code snippet display that updates based on form input values. The form validates on submit and shows inline error messages. On successful validation, a thank-you message replaces the form.

Done when: form renders with styled inputs, validation shows inline errors with red borders and error icons, the code snippet panel updates as the user types, submit shows a thank-you state, and all states (empty, filling, error, submitted, thank-you) match the design.

- [x] `/develop Contact redesign (Form with validation states)`

### 35. Contact form backend (API route + email) · Needs ADR

Intent: A Next.js API route or server action that receives the contact form submission, validates the data server-side, and sends an email notification. Uses a transactional email service. Rate limiting prevents abuse.

Done when: submitting the form sends a real email, server-side validation catches bad inputs, rate limiting is in place, and errors are handled gracefully with user-facing messages.

- [x] Design it: `/blueprint Contact form backend`

### 36. 404 page

Intent: A custom 404 page matching the code-editor aesthetic. Shows "404" in large Fira Code display text, a "Page not found" message styled as a code comment, and a link back home styled as a terminal command. The page sits within the same foreground container and dark background as the rest of the site.

Done when: navigating to a non-existent route shows the 404 page, the design matches the reference image, and the home link works.

- [x] `/develop 404 page`

## Slice 2 — Interactive Features

(Features 30 and 35 are the interactive features; they are designed and built during the Skateboard phase. This slice is reserved for any follow-up enhancements.)

## Slice 3 — Polish & Ship

### 37. Responsive polish & mobile QA

Intent: Test every redesigned section on real mobile viewports (375px per the design files), fix layout issues, verify touch targets, and ensure the snake game, file explorer, and form work on mobile. The mobile designs in the reference images are the acceptance baseline.

Done when: every section matches its mobile reference image at 375px, touch interactions work for the snake game buttons, file explorer accordion, and form inputs, and there are no horizontal overflow issues.

- [x] `/develop Responsive polish & mobile QA`
  - code in `src/components/sections/*.module.css`, `src/components/header/Header.module.css`, `src/components/snake/SnakeGame.module.css`, `src/app/not-found.module.css`, `src/app/globals.css`

### 38. Accessibility audit (WCAG AA)

Intent: Audit the full site against WCAG AA. Ensure color contrast meets minimum ratios (the dark code-editor palette must be verified), all interactive elements are keyboard accessible (snake game has keyboard controls, form fields have labels, file explorer is navigable), and screen readers can parse the code-snippet and gist content meaningfully.

Done when: automated audit (axe or Lighthouse) passes WCAG AA, manual keyboard testing covers all interactive features, and any contrast or focus issues are resolved.

- [x] `/develop Accessibility audit (WCAG AA)`
  - code in `src/app/globals.css`, `src/components/header/ThemeToggle.js`, `src/components/header/MobileNav.js`, `src/components/sections/About.js`, `src/components/sections/Contact.js`, `src/components/sections/Projects.js`, `src/components/snake/SnakeGame.js`, `src/app/layout.js`

### 39. Performance optimization v2 `done`

Intent: With the new design system and snake game in place, audit Core Web Vitals. Ensure Fira Code and Inter fonts load efficiently, the snake game does not cause layout shift or block the main thread, all images use next/image, and the contact form code-snippet panel does not cause expensive re-renders.

Done when: Lighthouse Performance score is 90+, the snake game initializes without blocking first paint, font loading uses optimal strategy (swap, size-adjust), and interaction to Next Paint is under 200ms.

- [x] `/develop Performance optimization v2`
  - code in `next.config.js`, `src/app/layout.js`, `src/components/sections/Banner.js`, `src/components/sections/Contact.js`, `src/components/sections/About.js`, `src/components/sections/Banner.module.css`, `src/components/sections/About.test.js`

### 40. Multi-page routing & snake game update `done`

Intent: Convert the single-page section layout (all 5 sections on one page with scroll-spy) to multi-page routing with fade transitions between pages. Update the snake game with a pre-game idle state (instructions overlay, Start Game button, food counter, neon glow) instead of auto-starting. Remove the preloader.

Done when: 5 routes render independently with fade transitions, nav uses path-based active state, snake game shows idle state with instructions and Start button, game board has neon teal glow, and preloader is removed.

- [x] Design it: `/blueprint` — [ADR 0012](../adr/0012-multi-page-routing-snake-update.md)
- [x] Build it: `/develop Multi-page routing & snake game update`
  - [x] Create route files and page transition wrapper (AC-1, AC-2, AC-3, AC-4, AC-5)
  - [x] Update header navigation to path-based routing (AC-6, AC-7)
  - [x] Update snake game with idle state, food counter, and neon glow (AC-1 through AC-6 snake)
  - [x] Verify persistent UI and cleanup scroll-spy (AC-8, AC-9)
- [x] Verify it: `/verify Multi-page routing & snake game update`
- [x] Test it: `/test Multi-page routing & snake game update`

### 41. Unified IDE window (SiteFrame layout) `done`

Intent: Wrap every route in one shared IDE application window (SiteFrame) so all five pages present identically: top tab navigation with an active state, the section content, and a footer social bar. Removes the global fixed header and reduces the home banner to hero content only. Supersedes the routing chrome of #40 (ADR 0012) and the banner chrome of #29 (ADR 0008).

Done when: all five routes render inside SiteFrame with the active nav tab highlighted, the footer bar shows the social links, the global header is removed, and the banner is hero content only.

- [x] Design it: `/blueprint` — [ADR 0013](../adr/0013-unified-ide-window.md)
- [x] Build it: `/develop Unified IDE window (SiteFrame layout)`
- [x] Test it: `/test Unified IDE window`

## Legend

**Status**: `planned` (not started) · `in-progress` (building) · `done` (built and verified) · `existing` (pre-dates this workflow) · `dropped` (de-scoped)

**Weight**: `lean` (skip design review and harden) · `medium` (normal path) · `full` (design review and harden required)

**Phase**: `Foundation` (scaffolding, standards, design system) · `Skateboard` (thinnest usable whole) · `Slice 2` (interactive features) · `Slice 3` (polish and ship) · (Legacy phases: `Slice 4`–`Slice 8` — completed migration and Awwwards upgrade)
