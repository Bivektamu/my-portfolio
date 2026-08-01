# 0004 — Theme Toggle

**Status**: Accepted
**Feature**: Theme toggle (Roadmap #12)

## Context

The site uses CSS custom properties for theming with a `data-theme` attribute on `<html>`. An inline script in the root layout reads localStorage and sets `data-theme` before paint to avoid a flash. A toggle button is needed in the header to switch themes.

## Decision

Create a `ThemeToggle` client component that:
1. Reads the current theme from `document.documentElement.dataset.theme`
2. Toggles between "light" and "dark"
3. Updates `data-theme` on `<html>`
4. Persists to localStorage

No React context needed: the CSS variables handle styling, and the inline script handles the initial theme. The toggle is purely a UI control.

Build plan:
1. Create `ThemeToggle` client component
2. Add to Header
3. Style the toggle as the red dot in the "BIV·EK" logo (matching the original)
