# 0003 — Scroll Spy & Smooth Scroll

**Status**: Accepted
**Feature**: Scroll spy & smooth scroll (Roadmap #11)

## Context

The old site used an imperative scroll listener in Layout with `document.querySelectorAll` and `getBoundingClientRect` for scroll spy, plus Lenis for smooth scrolling. The new site already has CSS `scroll-behavior: smooth` and `scroll-margin-top`.

## Decision

Use an IntersectionObserver-based `ScrollSpy` client component that wraps the main content. It observes all `section` elements and sets the active state. This replaces the imperative scroll listener with a more efficient approach.

For smooth scroll: CSS `scroll-behavior: smooth` on `<html>` is already set and works for nav link clicks (`scrollIntoView`). This avoids the Lenis dependency entirely. If the scroll feel isn't smooth enough, Lenis can be added later.

Build plan:
1. Create `ScrollSpy` client component using IntersectionObserver
2. Pass active section ID down to both Header (for nav highlighting) and to the nav
3. Connect to MobileNav's click handler (already uses `scrollIntoView`)
