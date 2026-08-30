# Layout

## Overview

The shared IDE application window (`SiteFrame`) that wraps every route. It renders the top navigation (brand, five route tabs with an orange active-tab underline, a flex spacer, and the theme toggle), the main content region (the page's section), and the footer social bar. Every page presents as one self-contained terminal/IDE window.

## Key files

| File | Owns |
|---|---|
| `SiteFrame.js` | The shared window — nav tabs (active state from `usePathname`), main content, footer bar, theme toggle |
| `SiteFrame.module.css` | Styling — dark window, thin blue-gray borders, orange active tab underline, footer social bar, responsive tab scroll |

## Conventions

- One shared frame for all five routes; each route page wraps its section in `<SiteFrame>`.
- Nav uses Next.js `<Link>` with route paths (`/`, `/about`, `/projects`, `/skills`, `/contact`), not anchors.
- Active tab is determined by comparing `usePathname()` to each link's `href`.
- The global fixed header is gone; navigation lives in SiteFrame. `src/components/header/` now holds only ThemeToggle.
- Footer social links (GitHub, LinkedIn, X) are hardcoded in SiteFrame.
- The nav tab bar scrolls horizontally on small screens instead of collapsing into a menu.

## Gotchas

- SiteFrame is a client component (`usePathname`), so route pages that use it need no extra client directive themselves.
- The tab bar's `_contact-me` tab sits to the right of a flex spacer; `_skills` sits with the other tabs on the left.
