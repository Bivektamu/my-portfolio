# Sections

## Overview

Server components that render the 5 portfolio sections. They are composed in `src/app/page.js` and rendered inside `<main>`. All are server components by default (no `use client` directive). Animations and interactivity are added by wrapping in client components from `animations/`. Currently all stubs (Foundation phase) with placeholder markup.

## Key files

| File | Owns |
|---|---|
| `Banner.js` | Home/hero section (id: `home`) — profile image, name, tagline, CTA |
| `About.js` | About section (id: `about`) — bio, profile image |
| `Projects.js` | Project portfolio grid (id: `project`) — project cards with links |
| `Skills.js` | Skills grid (id: `skill`) — icons, labels, experience panel |
| `Contact.js` | Footer/contact section (id: `contact`) — social links, copyright |

## Conventions

- **File pattern**: one component file + one CSS Module file: `Banner.js` + `Banner.module.css`. Create the CSS Module when building out each section.
- **Server-only**: no state, no effects, no event handlers. Import data from `src/data/` directly.
- **Section IDs are fixed**: `home`, `about`, `project`, `skill`, `contact`. These match the nav anchors. Do not change them.
- **Styling**: all values from CSS custom properties (`var(--color-bg)`, `var(--color-text)`). Theme is data-attribute-driven; no JavaScript context.
- **Images**: use `NextImage` from `next/image` with explicit `width`/`height`.
- **Animation wrappers**: when adding parallax or reveal effects, wrap the section component in a client component from `animations/`, rather than adding `use client` to the section itself.

## Gotchas

- **Stubs now, real later**: as of Foundation phase, all sections are placeholder components. Content and styling are built out in the skateboard slice (see roadmap).
- **Projects section uses `project` id, not `projects`**: the roadmap says Projects but the section id is `project` (consistent with the old site).
- **No CSS Modules until skateboard**: the stubs don't have corresponding `.module.css` files. Create them when developing each section.

## Related ADRs

- [0001 — Next.js Migration Architecture](../../../docs/adr/0001-nextjs-migration-architecture.md)
