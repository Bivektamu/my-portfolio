# 0005 — Banner Reimagined

**Status**: Accepted
**Feature**: Banner reimagined (Roadmap #18)
**Date**: 2026-08-24

## Context

Feature 5 delivered a minimal banner: greeting text, name heading, and an SVG illustration with basic `useScroll`/`useTransform` parallax (text at -150px, image at 50px over 600px scroll). This was the skateboard slice — functional but not distinctive.

The Awwwards-level reimagining (Feature 18) demands a striking hero: oversized split-text heading with staggered character reveal on load, a dynamic CSS gradient background, a sculpted CTA button, and richer parallax depth. The preloader (Feature 14) already gates page visibility, so the banner reveal choreography runs after the preloader unblocks children.

Design tokens are already in place (`--gradient-accent`, `--font-size-display`, `--ease-out-expo`, `--duration-reveal`). The 3D background (Feature 22) and magnetic micro-interactions (Feature 23) are deferred to later slices, so the banner must stand on its own with CSS + motion only.

## Decisions

### 1. Text splitting: hand-rolled character spans (no split-type dependency)

**Choice**: Map `"I am Bivek"` into individual `<motion.span>` elements manually using `Array.from()`.

**Rationale**:
- `split-type` (~16 KB gzipped) handles dynamic text splitting well, but the heading is short (10 characters), static, and never changes.
- Hand-rolling avoids an additional dependency, keeps the bundle lean, and gives full control over animation parameters per character without fighting a library's DOM manipulation.
- The spans are rendered as static HTML; only the animation props (`initial`/`animate` variants) are client-side via motion.
- Spaces are rendered as `\u00A0` (non-breaking space) inside spans so they participate in the stagger without collapsing.

**Rejected alternative**: `split-type` — would add a dependency for a single heading. If the site later needs word/line splitting in multiple sections (e.g., About text reveals), this decision can be revisited.

### 2. Animation choreography: `animate` prop with `staggerChildren` (not `whileInView`)

**Choice**: Use motion's `animate` prop triggered on mount, with a parent container that staggers its children.

**Sequence** (all durations use `--ease-out-expo`):

| Layer | Element | Trigger | Duration | Effect |
|-------|---------|---------|----------|--------|
| 1 | Greeting "Hi there," | immediate on mount | 0.4s | fade-up (opacity 0→1, y 24→0) |
| 2 | Name characters | staggerChildren 0.03s, start delay 0.15s | 0.5s per char | fade-up + slight rotation (opacity 0→1, y 40→0, rotateX -90°→0) |
| 3 | CTA button | delay 0.6s | 0.5s | fade-up + scale (opacity 0→1, y 20→0, scale 0.9→1) |
| 4 | Image | delay 0.3s (overlaps with name) | 0.8s | scale + fade (opacity 0→1, scale 0.85→1) |

**Parent container pattern**:

```js
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.03, delayChildren: 0.15 },
  },
};

const charVariants = {
  hidden: { opacity: 0, y: 40, rotateX: -90 },
  visible: {
    opacity: 1, y: 0, rotateX: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};
```

**Why `animate` not `whileInView`**: The banner is above the fold and the preloader already gates visibility — children only render when the preloader is done. Using `whileInView` would add unnecessary IntersectionObserver overhead. `animate` fires once on mount, which is exactly what we want.

**Why children-in-parent stagger rather than sequenced `transition.delay`**: `staggerChildren` on the parent is declarative, automatically calculates per-child delays, and keeps timing centralized. Individual delays would be brittle if the text length changes.

### 3. Background treatment: CSS animated gradient mesh (no Three.js)

**Choice**: A `::before` pseudo-element on the banner with two overlapping `radial-gradient` layers whose positions animate via CSS `@keyframes`.

**Implementation**:
- A `radial-gradient(circle at 20% 30%, var(--color-accent-2), transparent 50%)` and a second at `radial-gradient(circle at 80% 70%, var(--color-accent), transparent 50%)`.
- A `@keyframes bgShift` that moves the `background-position` of each gradient in a slow loop (~20s cycle).
- The `::before` element gets `z-index: 0`, `pointer-events: none`, and `opacity: 0.4` (dark theme) / `0.15` (light theme).
- The `::before` also gets its own parallax rate via a CSS custom property set by motion (`--bg-y`), creating a third, slowest parallax layer.

**Why not Three.js now**: Feature 22 is planned for the 3D interactive background. The CSS gradient approach is zero-JS, performs at 60fps, and can coexist with or be replaced by the 3D element later. It also degrades gracefully on low-power devices.

**Rejected alternative**: SVG noise/grain overlay — this is already planned site-wide in Feature 24, so adding it here would duplicate effort. The gradient gives the banner its own identity.

### 4. CTA button: styled button now, magnetic effect deferred to Feature 23

**Choice**: Include a "View My Work" CTA as a styled `<a href="#project">` in the Banner feature. Magnetic hover effect is explicitly out of scope and deferred to Feature 23 (Advanced micro-interactions).

**Button design**:
- Gradient border via `border-image` or a `::before` with the `--gradient-accent`.
- Glass surface background (`--glass-bg`, `--glass-border`, `--glass-blur`).
- Hover: border glow intensifies (box-shadow pulse with `--color-accent`), text color shifts to white.
- Scrolls to `#project` section via native `scroll-behavior: smooth`.

**Why separate**: The magnetic effect requires mouse-tracking infrastructure (event listeners, rAF lerp, bounding rect calculations). That infrastructure belongs in Feature 23 where it can be reused across all interactive elements (nav links, project cards, social pills). The CTA button should render and function now; magnetism is a layer applied later.

### 5. Parallax: keep existing pattern, add third depth layer

**Choice**: Retain `useScroll` + `useTransform` from the skateboard. Add a third parallax rate for the CSS background gradient.

**Depth layers** (fastest to slowest):

| Layer | Element | Scroll range | y offset |
|-------|---------|-------------|----------|
| Foreground | Text content | [0, 600] | [0, -150] |
| Midground | SVG image | [0, 600] | [0, 50] |
| Background | `::before` gradient | [0, 600] | [0, -30] |

The background layer moves at the slowest rate (-30px), creating the illusion that it's furthest away. The text moves fastest (-150px), creating a cinematic three-plane parallax.

To animate the `::before` pseudo-element's position from a client component, the Banner component sets a CSS custom property `--bg-y` on the section via motion's `style` prop, and the CSS module reads it:

```css
.banner::before {
  transform: translateY(var(--bg-y, 0px));
}
```

## Consequences

**Positive**:
- The hero immediately signals premium quality with the staggered text reveal, animated gradient background, and three-layer parallax.
- Zero additional dependencies. Everything is built with motion (already installed) and CSS.
- The CTA button is functional now; magnetism is a clean additive layer in Feature 23.
- The CSS gradient background can coexist with the 3D element (Feature 22) or be replaced by it without refactoring the banner structure.

**Negative**:
- Hand-rolled character spans mean the heading markup is verbose (10 `<motion.span>` elements). This is acceptable for a static, short heading.
- The `::before` gradient animation is purely decorative and adds a 20s keyframe animation to the main thread. On underpowered devices, this can be toggled off via `prefers-reduced-motion`.

**Follow-up**:
- Feature 22 (3D background): the `::before` pseudo-element can be removed or reduced in opacity when the 3D element is active.
- Feature 23 (micro-interactions): add magnetic hover to the CTA button using the shared mouse-tracking utility.
- If more text-splitting needs arise (e.g., About section animated reveals), consider extracting a reusable `<SplitText>` component rather than pulling in `split-type`.

## Build plan

1. **Extract `AnimatedCharacters` sub-component**: A small client sub-component inside `Banner.js` that renders `"I am Bivek"` as an array of `<motion.span>` elements with `staggerChildren` variants.
2. **Add CTA button**: A styled `<a href="#project">` in the text column with gradient border and glass surface. Hook it up with its own `motion` variant for the delayed reveal.
3. **Add `::before` gradient background**: CSS keyframe animation with two radial gradients shifting position. Add `--bg-y` custom property driven by motion for the background parallax layer.
4. **Add third parallax layer**: Extend the existing `useTransform` hook to output a `yBg` value mapped to `--bg-y` on the section element.
5. **Update responsive styles**: Ensure the character spans don't break mid-word on mobile, the gradient remains performant, and the parallax rates feel appropriate on smaller viewports.
6. **Wire into `page.js`**: Banner already renders directly (no wrapper) in `page.js` — no change needed unless the preloader wrapping changes.