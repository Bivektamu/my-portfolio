# Verify: Accessibility audit (WCAG AA) · Feature 38 · updated 2026-08-03
_Steps derived from feature 38 done-when criteria. `/verify` runs these; `/test` locks the durable ones._

## UI / manual
- [ ] Run Lighthouse or axe DevTools on every page — confirm zero contrast violations in both dark and light themes → automated audit passes
- [ ] Tab through all interactive elements across every section — confirm visible `:focus-visible` ring on each (skip-link, logo, theme toggle, hamburger, nav links, social buttons, CTAs, file explorer folders/files, tech checkboxes, project links, contact form inputs, snake game buttons) → WCAG 2.1.1 Keyboard
- [ ] Test snake game with keyboard arrows only — confirm movement, game-over, and restart via keyboard → WCAG 2.1.1
- [ ] Test mobile nav: open with Enter/Space on hamburger, verify `aria-expanded` toggles true/false → WCAG 4.1.2
- [ ] Test About file explorer: tab to folders, verify `aria-expanded` announces, navigate files with keyboard → WCAG 4.1.2
- [ ] Test contact form: click each label to verify it focuses its associated input → WCAG 1.3.1
- [ ] Test theme toggle: press Enter or Space to toggle, verify native button behavior works → WCAG 2.1.1
- [ ] Test tech filters: screen reader announces checked/unchecked state on each toggle → WCAG 4.1.2
- [ ] Enable `prefers-reduced-motion: reduce` in DevTools — confirm all animations and transitions are suppressed → WCAG 2.3.3
- [ ] Verify skip-to-content link is the first focusable element and navigates to `<main id="main-content">` → WCAG 2.4.1

## Acceptance-criteria coverage
- AC "automated audit passes WCAG AA" → covered by step 1
- AC "manual keyboard testing covers all interactive features" → covered by steps 2, 3, 4, 5, 7
- AC "any contrast or focus issues are resolved" → covered by steps 1, 2
- AC "screen readers can parse code-snippet and gist content" → covered by steps 5, 6, 8
