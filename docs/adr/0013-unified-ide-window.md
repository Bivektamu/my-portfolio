# 0013 — Unified IDE Window (SiteFrame Layout)

**Status**: Accepted
**Feature**: Unified IDE window across all routes
**Date**: 2026-08-30
**Supersedes**: [0008 — Banner Redesign](0008-banner-redesign.md), [0012 — Multi-page Routing & Snake Game Update](0012-multi-page-routing-snake-update.md)

## Summary

Every route renders inside one shared IDE application window (`SiteFrame`): a top tab navigation with the active tab highlighted, the page's section content in the middle, and a footer social bar. The global fixed header is removed. The home banner is reduced to hero content only, inside that window. This supersedes the banner chrome from ADR 0008 and the persistent-header routing chrome from ADR 0012.

## Context

ADR 0008 designed the home banner as a split layout with social links, scroll parallax, and its own foreground container. ADR 0012 converted the site to five routes with a persistent global header (rendered on every page) and fade transitions, and also added the snake game idle pre-game state.

After those shipped, the home page was rebuilt as a self-contained IDE window: its own top nav, hero plus game content, and a footer bar. The engineer then asked to apply that same window to the other four pages. The chosen approach was a shared `SiteFrame` component wrapping every route, with the global header removed. This ADR records that shipped decision and supersedes the parts of 0008 and 0012 it replaced. The snake game idle-state decision from 0012 is carried forward unchanged.

## Requirements

### AC-1: Shared window on every route
All five routes (`/`, `/about`, `/projects`, `/skills`, `/contact`) render inside the shared `SiteFrame` window (top nav, main content, footer bar).

### AC-2: Top navigation
The nav shows the brand (`bivek_gurung`) and five tabs (`_hello`, `_about-me`, `_projects`, `_skills`, `_contact-me`). The active tab matches the current pathname and carries an orange underline. `_contact-me` sits to the right of a flex spacer; the theme toggle sits at the far right.

### AC-3: Footer bar
The footer shows `find me in:` with X and LinkedIn buttons, a flex spacer, and the `@bivekgurung` GitHub link.

### AC-4: Global header removed
The global fixed header is removed from the root layout. Navigation lives only in `SiteFrame`. The superseded header modules (Header, MobileNav, HeaderController) are deleted. ThemeToggle remains and renders in the SiteFrame nav.

### AC-5: Banner is hero content only
The home Banner renders the hero (greeting, name, `> Front-end developer`, two comment lines, the github code line, and the snake game) with background glows. It has no nav or footer of its own.

### AC-6: Theme toggle persists
The theme toggle continues to work across all pages, now rendered inside the SiteFrame nav.

### AC-7: Small-screen nav
On small screens the nav tab bar scrolls horizontally instead of collapsing into a menu.

## Decision

Create a shared `SiteFrame` client component (`src/components/layout/SiteFrame.js` + `SiteFrame.module.css`) that renders the IDE window chrome: brand, five route tabs with pathname-based active state, a main content region, and the footer social bar. Every route page wraps its section in `<SiteFrame>`. Remove the global header from the root layout. Refactor the Banner section to hero content only.

The nav uses Next.js `<Link>` with route paths, not anchors. The active tab is computed by comparing `usePathname()` to each link's `href`. The theme toggle is rendered inside the nav.

## Options considered

**Option 1 (chosen): Unified IDE window on every page.** One shared frame wrapping every route, global header removed. All five pages present identically as an IDE window. Chosen for full visual consistency with the rebuilt home page.

**Option 2: Window frame, keep the global header.** Give the other pages the window borders, background, and footer bar but keep the global header as the top chrome. Rejected because it would not match the home page, which has its own in-window nav.

**Option 3: Just the visual skin.** Apply only the dark-window palette and background, no frame, footer, or nav change. Rejected because it under-delivered on the request to make the pages match the home page.

## Rationale

The home page was already rebuilt as a self-contained IDE window. Extending that exact frame to every page is the smallest change that makes all routes look and behave identically. One shared component avoids duplicating nav and footer markup across five pages. Removing the global header eliminates the double-chrome conflict that existed when the home page had its own nav on top of the global header. The snake game idle-state behavior from ADR 0012 is unchanged, so that decision carries forward rather than being re-decided.

## Consequences

**Positive:**
- One shared frame means a single source of truth for the nav and footer.
- Every page presents consistently as an IDE window.
- The superseded header modules are deleted, reducing dead code.
- The theme toggle stays accessible on every page inside the nav.

**Negative:**
- `SiteFrame` is a client component (`usePathname`), so every route now includes a client boundary at the page level.
- The nav tab bar scrolls horizontally on small screens, which is a less conventional mobile pattern than a hamburger menu.
- ADR 0008's scroll parallax on the banner is removed (the banner is now static hero content).

**Neutral:**
- Fade page transitions, the custom cursor, the noise overlay, and the skip link are unchanged in the root layout.

## Follow-up

None. This ADR records the shipped state.
