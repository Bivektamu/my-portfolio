# 0012 — Multi-page Routing & Snake Game Update

**Status**: Accepted
**Feature**: Multi-page routing with fade transitions + snake game pre-game state (Roadmap #38, #39)
**Date**: 2026-08-08
**Supersedes**: [0009 — Snake Game](0009-snake-game.md)

## Summary

The site converts from a single page with five sections and scroll spy navigation to five separate Next.js App Router routes with fade transitions between pages. The snake game gains an idle pre game state with an instructions overlay, Start Game button, food counter, and a neon teal glow on the game board, replacing the current auto start behavior.

## Context

The current single page layout renders all five sections (Banner, About, Projects, Skills, Contact) on one page. Navigation uses anchor hashes with scroll spy (IntersectionObserver) to highlight the active link and smooth scroll to sections. This works but does not feel like navigating between distinct pages. The code editor aesthetic calls for deliberate, simple transitions that reinforce the terminal/IDE metaphor: each route is a different "file" being opened.

The snake game auto starts on page load. This is jarring: the snake begins moving immediately before the visitor has oriented themselves or read the surrounding banner content. The reference images show a pre game state with instructions and a Start Game button. Additionally, the game board should have a neon glow effect matching the teal accent color.

The preloader is being removed as part of this change because separate routes eliminate the need to gate content behind a loading sequence. Each page loads directly and independently.

## Requirements

### Multi-page routing

- **AC-1**: Five routes exist: `/` (Banner/snake game), `/about` (About file explorer), `/projects` (Projects with tech filters), `/skills` (Skills chips), and `/contact` (Contact form + code snippet). Each route renders its respective section as a full, independently scrollable page with no other sections visible.

- **AC-2**: Navigating between pages via nav links or any internal link triggers a fade out/fade in transition: the current page fades to opacity 0 over approximately 150ms, then the new page fades in to opacity 1 over approximately 150ms. The transition uses motion `AnimatePresence` with `mode="wait"` so the exit animation completes before the enter animation begins.

- **AC-3**: Using the browser's back and forward buttons triggers the same fade transition as internal navigation. The transition is not skipped or bypassed for history navigation.

- **AC-4**: Landing directly on a URL (bookmark, typed address, external link, or hard refresh) renders the page at full opacity immediately with no fade from a previous page. There is no jarring flash or transition when no previous page context exists.

- **AC-5**: The preloader (`src/components/preloader/Preloader.js`) is removed from the root layout. No blob animation, no body visibility gating, and no timeout chain runs on any page load.

- **AC-6**: Header nav links use Next.js `<Link>` components with route paths (`/`, `/about`, `/projects`, `/skills`, `/contact`) instead of anchor hashes (`#home`, `#about`, etc.). The active nav link is determined by comparing the current pathname from `usePathname()` against each link's route, not by IntersectionObserver scroll position.

- **AC-7**: On mobile viewports, clicking a nav link in the mobile menu closes the hamburger menu and navigates to the target route with the same fade transition as desktop navigation. The menu close and navigation happen in the same interaction.

- **AC-8**: The custom cursor (`CustomCursor`) and theme toggle (`ThemeToggle`) continue to work across all page transitions without flickering, resetting, or losing state. Both components live in the root layout outside the page transition wrapper.

- **AC-9**: On the home page only, the Banner section's scroll driven parallax effect (text and game board shifting at different speeds via motion `useScroll` and `useTransform`) still works correctly. The parallax responds to the page's own scroll position.

### Snake game pre-game state

- **AC-1**: The game does not auto start. On initial load, the game board displays an overlay with the instruction text "Use arrow keys to move, eat the green food to grow, avoid walls and your tail" rendered in the Fira Code font at an appropriate size. A "Start Game" button is visible below the instructions. The snake is not rendered and the game loop is not running.

- **AC-2**: A food counter is visible (positioned in the game header alongside the score label) displaying "Food: 0" before the game starts. As food is eaten during gameplay, the counter increments by 1 per food item. The counter provides visible progress toward the win condition (eating all available food cells on the board).

- **AC-3**: Clicking the "Start Game" button (or pressing Enter when focused) begins the game: the snake appears at its starting position, the game loop starts running at 150ms intervals, and keyboard arrow keys plus on screen directional buttons become active.

- **AC-4**: The existing game over overlay ("Game Over" text + "Start Again" button) and win overlay ("Well Done" text + "Play Again" button) still display correctly. Clicking "Start Again" or "Play Again" returns to the idle pre game screen with the instructions overlay and food counter reset to 0, not to an auto starting game.

- **AC-5**: During SSR or dynamic import loading, the game board placeholder (the dark square rendered by the `loading` prop in `dynamic()`) visually matches the idle pre game state: a `#011627` background with the neon glow border and the board dimensions identical to the loaded game.

- **AC-6**: The game board container has a neon glow/shadow effect: an outer box shadow or filter in teal (`#46ecd5`) creating a soft glow around the board edges. The glow is visible in all game states (idle, playing, game over, win) and matches the code editor aesthetic.

## Options considered

### Multi-page routing

**Option 1 (chosen): Next.js App Router with separate route files and motion AnimatePresence for fade transitions.** Each route is a file under `src/app/` that renders a single section component. A client component `PageTransition` wraps `{children}` in the root layout using `AnimatePresence` with opacity based fade in/out. This uses the framework's native routing patterns and motion which is already a project dependency. No new libraries. The fade transition is simple and does not clash with the code editor aesthetic.

**Option 2: Keep the single page with scroll based navigation.** Retain the current architecture. No code changes needed for routing. This does not satisfy the design intent of distinct pages with transitions. Rejected because it does not meet the stated goal.

**Option 3: Use a page transition library such as next-view-transitions or the View Transitions API.** The View Transitions API is experimental in Next.js and requires a canary release. A third party library adds a dependency for a simple fade effect that motion already handles. Over engineered for the need. Rejected.

### Snake game pre-game state

**Option 1 (chosen): Add an "idle" pre game state with instructions overlay, Start Game button, and food counter.** The game states become: idle (new), playing, game over, win. The idle state shows instructions and a start button. Game over and win return to idle instead of auto starting. This matches the reference images and gives the visitor control over when the game begins.

**Option 2: Keep auto start behavior.** The game starts immediately on page load. Simple to implement (no changes) but jarring for visitors and inconsistent with the reference design. Rejected.

## Decision

Convert the site to multi page routing using Next.js App Router file based routes:

- `src/app/page.js` — renders only Banner (home page)
- `src/app/about/page.js` — renders only About
- `src/app/projects/page.js` — renders only Projects
- `src/app/skills/page.js` — renders only Skills
- `src/app/contact/page.js` — renders only Contact

A `PageTransition` client component wraps `{children}` in the root layout using `<AnimatePresence mode="wait">`. Each page gets a motion.div wrapper with `initial={{ opacity: 0 }}`, `animate={{ opacity: 1 }}`, `exit={{ opacity: 0 }}`, and `transition={{ duration: 0.15 }}`. The key is derived from the pathname to trigger transitions on route change. Direct URL landings render without a fade because there is no previous component to exit.

Replace scroll spy active section detection with `usePathname()` from `next/navigation`. The Header `NAV_LINKS` array changes from hash based ids to route paths. Mobile nav closes on link click via `router.push()` or Next.js `<Link>`.

Remove the preloader entirely: delete the `<Preloader>` wrapper from the root layout, remove the `Preloader` component files, and remove the `loading` state from any remaining context.

Keep the shared UI (Header, CustomCursor, NoiseOverlay, theme inline script, skip link) in the root `layout.js` outside the page transition wrapper so they persist across navigations without remounting.

For the snake game, add an `"idle"` game state as the default. The `useEffect` auto start is removed. In the idle state, render an overlay with instructions text and a "Start Game" button. The game loop initializes only when the user clicks Start. Game over and win buttons call a `resetToIdle` function instead of `startGame`. Add a `foodCount` state variable that increments with each food eaten and displays in the game header. Add a CSS `box-shadow` property to the `.board` class for the neon teal glow.

Supersede ADR 0009.

## Rationale

motion (framer-motion) is already in the project and handles AnimatePresence natively. No new dependency is needed. Next.js App Router file based routing is the framework's standard pattern and gives each page its own URL for bookmarking, sharing, and browser history. The fade transition is deliberately simple: 150ms opacity crossfade. It is fast enough to not feel sluggish and subtle enough to not clash with the code editor aesthetic. The `mode="wait"` on AnimatePresence ensures the exit completes before enter begins, preventing layout flashes.

Removing the preloader simplifies the load sequence. With separate routes, each page loads less content and renders faster. The preloader's timeout chain was designed for a single page app where all five sections load at once. That pattern no longer fits.

The snake game idle state gives visitors agency. They can read the banner text, understand the interaction, then choose to play. The neon glow on the game board reinforces the code editor aesthetic and matches the reference images. The food counter adds visible progression toward the win condition, making the game feel more complete.

## Migration plan

**Strategy**: Create new route files, modify the root layout to remove the preloader and add page transitions, update header navigation to use path based routing, update the snake game with idle state and neon glow, then clean up unused scroll spy code.

**Phases**:

1. Create new page files under `src/app/` for each route (`/about`, `/projects`, `/skills`, `/contact`)
2. Modify `src/app/layout.js`: remove Preloader import and wrapper, add PageTransition wrapper around `{children}`, keep Header, CustomCursor, NoiseOverlay outside the transition
3. Update `Header.js` NAV_LINKS from hash anchors to route paths; use `usePathname()` for active state
4. Update `MobileNav.js`: replace anchor `<a>` with Next.js `<Link>`, replace `useActiveSection()` with `usePathname()`, close on click
5. Update `src/app/page.js` to render only Banner
6. Update snake game: add idle state, instructions overlay, Start Game button, food counter, neon glow
7. Remove or simplify scroll spy (no longer needed for page level navigation; may be retained as a utility if needed elsewhere)
8. Update ADR 0009 status to Superseded

**Rollback**: Revert `src/app/page.js` to compose all five sections, revert header nav links to anchor hashes, restore Preloader wrapper, remove the new route files. All section components remain unchanged and self contained.

**Risks**: Low. The sections are already self contained components that receive no props and manage their own state. Extracting them to separate pages is largely mechanical: each new route file imports one section and renders it. The snake game state changes are additive (new idle state, existing states preserved). The main risk is ensuring the page transition wrapper does not cause a flash of unstyled content or interfere with the theme script, which is mitigated by keeping the theme script in `<head>` and the transition wrapper deep inside `<body>`.

## Build plan

1. **Create route files**: `src/app/about/page.js`, `src/app/projects/page.js`, `src/app/skills/page.js`, `src/app/contact/page.js`. Each imports and renders its respective section component. Satisfies AC-1 (routing).

2. **Remove preloader** from `src/app/layout.js`: delete the `<Preloader>` wrapper, remove the import. The body renders directly. Satisfies AC-5 (preloader).

3. **Add page transition wrapper**: Create a `PageTransition` client component that wraps `{children}` in `<AnimatePresence mode="wait">` with a motion.div using opacity fade. Import and use in the root layout around `{children}`. Satisfies AC-2 (fade transitions), AC-3 (browser back/forward), AC-4 (direct URL landing).

4. **Update home page**: Modify `src/app/page.js` to render only `<Banner />` instead of all five sections. Satisfies AC-1 (home route).

5. **Update Header navigation**: In `src/components/header/Header.js`, change NAV_LINKS from `{ id, label }` with hash ids to `{ href, label }` with route paths. Import `usePathname` and compare for active state. Satisfies AC-6 (path based nav).

6. **Update MobileNav**: In `src/components/header/MobileNav.js`, replace `<a href="#...">` with `<Link href="/...">`. Replace `useActiveSection()` with `usePathname()`. The `handleClick` closes the menu and navigation proceeds via Link. Satisfies AC-6, AC-7 (mobile nav).

7. **Verify persistent UI**: Confirm CustomCursor and ThemeToggle are outside the PageTransition wrapper in the root layout and do not remount on navigation. Satisfies AC-8.

8. **Verify banner parallax**: On the home page, confirm the motion `useScroll`/`useTransform` parallax on the Banner section still works. Satisfies AC-9.

9. **Add idle game state**: In `SnakeGame.js`, change initial state from `"playing"` to `"idle"`. Remove the `useEffect` that calls `startGame()` on mount. Add an idle overlay with instructions text and "Start Game" button. The `startGame` callback sets state to `"playing"`. Satisfies AC-1 (snake pre game), AC-3 (snake start).

10. **Add food counter**: Add `foodCount` state (separate from score for display clarity, or use score as the counter). Display in the game header alongside the score label. Increment when food is eaten. Reset to 0 on game reset. Satisfies AC-2 (snake food counter).

11. **Modify game over/win to return to idle**: Change the "Start Again" and "Play Again" button onClick from `startGame` to a `resetToIdle` function that sets state to `"idle"`, resets snake, food, score, and food counter. Satisfies AC-4 (snake restart).

12. **Update game board placeholder**: The `loading` prop in `dynamic()` already renders a dark square. Ensure its dimensions, background color (`#011627`), border radius, and neon glow match the loaded game board's idle state. Satisfies AC-5 (snake placeholder).

13. **Add neon glow to game board**: Add `box-shadow: 0 0 20px rgba(70, 236, 213, 0.3), 0 0 40px rgba(70, 236, 213, 0.1)` (or similar, using `#46ecd5` teal) to the `.board` CSS class. Satisfies AC-6 (snake neon glow).

14. **Update ADR 0009**: Change its Status line to `**Status**: Superseded by [0012](0012-multi-page-routing-snake-update.md)`.

15. **Clean up scroll spy**: Remove `<ScrollSpy>` wrapper from the root layout. The `ScrollSpy` component and `useActiveSection`/`useScrollSpy` hooks may be kept if they have other consumers, but remove them from the navigation path. Satisfies the architectural cleanup.

## Feature design

### Data model

No new data structures. Existing JSON data files (projects, skills, socials) remain unchanged. No API changes.

### Page structure

```
/           -> Banner (intro text, snake game, social links, parallax)
/about      -> About (file explorer with bio.md, education, experience tabs)
/projects   -> Projects (tech filter chips, project cards grid)
/skills     -> Skills (tech chips in a code window aesthetic)
/contact    -> Contact (form with validation, code snippet preview)
```

### Route layout hierarchy

```
RootLayout (layout.js)
+-- <html> with theme script
+-- <body>
    +-- Skip link
    +-- Header (persistent)
    +-- CustomCursor (persistent)
    +-- NoiseOverlay (persistent)
    +-- PageTransition (wraps children with AnimatePresence)
        +-- {children} <- page.js or /about/page.js etc.
```

### Snake game states

```
idle (new, default)
+-- Board: visible with neon glow, dark background, no snake drawn
+-- Overlay: instructions text + "Start Game" button
+-- Header: "// snake_game.js" label + "// food: 0" counter
+-- Controls: directional buttons hidden (no active game)
+-- Transitions to: playing (on Start Game click)

playing
+-- Board: snake moving, food visible, collision detection active
+-- Header: label + "// food: N" counter (increments on eat)
+-- Controls: directional buttons visible on mobile
+-- Keyboard: arrow keys active
+-- Transitions to: game-over (wall/self collision), win (board full)

game-over
+-- Overlay: "Game Over" + "Start Again" button
+-- Board: frozen, snake and food visible underneath overlay
+-- Transitions to: idle (on Start Again click)

win
+-- Overlay: "Well Done" + "Play Again" button
+-- Board: frozen, snake filling board visible underneath overlay
+-- Transitions to: idle (on Play Again click)
```

### Transition implementation

A client component `PageTransition` in `src/components/animations/PageTransition.js`:

```js
"use client";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

Used in root layout:
```js
<PageTransition>
  <main id="main-content">{children}</main>
</PageTransition>
```

The `key={pathname}` tells AnimatePresence to treat each route as a distinct component, triggering exit/enter when the key changes. On direct URL landing, there is no previous child to animate out, so only the enter animation runs (opacity 0 to 1 over 150ms, which is fast enough to feel like a normal page load).

### Neon glow CSS

Added to the `.board` class in `SnakeGame.module.css`:

```css
.board {
  /* existing styles */
  box-shadow:
    0 0 15px rgba(70, 236, 213, 0.25),
    0 0 35px rgba(70, 236, 213, 0.1),
    0 0 60px rgba(70, 236, 213, 0.05);
}
```

The layered shadows create a soft, progressive glow that reads as neon without being harsh.

## Consequences

**Positive:**
- Each page loads independently with less content to render, potentially improving initial load performance
- Each route has its own URL, enabling bookmarking, sharing, and natural browser history
- Nav active state is simpler: pathname string comparison instead of IntersectionObserver with rootMargin calculations
- The preloader is gone, removing a complex timeout chain and reducing the component tree
- Snake game respects visitor agency: no auto start, instructions visible before play
- Neon glow reinforces the code editor/terminal aesthetic

**Negative:**
- Scroll spy becomes unnecessary for navigation and must be removed or refactored if it has other consumers
- CSS `scroll-behavior: smooth` and `scroll-margin-top` can be removed since there are no anchor targets within pages
- Page transition wrapper adds a thin client component in the render tree (unavoidable for AnimatePresence)
- The Banner parallax only works on the home page; other pages have no scroll driven parallax (acceptable, as they did not have it before either)

**Neutral:**
- The `useMagnetic` hook and `RevealOnScroll` animations are unaffected and continue to work within their respective section components
- The noise overlay persists across all pages unchanged

## Follow-up

None. This ADR completes the routing and snake game changes.

## References

- [ADR 0001 — Next.js Migration Architecture](0001-nextjs-migration-architecture.md)
- [ADR 0002 — Scroll Parallax](0002-scroll-parallax.md)
- [ADR 0003 — Scroll Spy](0003-scroll-spy.md)
- [ADR 0009 — Snake Game](0009-snake-game.md) (superseded by this ADR)