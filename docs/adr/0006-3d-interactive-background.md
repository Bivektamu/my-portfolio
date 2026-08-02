# 0006 — 3D Interactive Background

**Status**: Superseded by 0007 (3D blob removed in v3 code-editor redesign)
**Feature**: 3D interactive background (Roadmap #22)
**Date**: 2026-08-24

## Context

Feature 18 delivered a reimagined Banner with a CSS `::before` animated radial-gradient background, staggered character reveal, and three-layer parallax. The CSS gradient is polished but flat — it doesn't respond to the user's presence.

The Awwwards-level differentiator (Feature 22) is a 3D element that reacts subtly to mouse movement, adding depth and a signature "wow" factor. The roadmap calls for "a morphing blob, particle field, or geometric shape" that sits "behind or alongside the banner and possibly the contact section" at 60fps on desktop, degrading gracefully on mobile.

The site's design language is established: dark-first palette (`#0a0a0f`), indigo/purple/pink accents (`--gradient-accent: linear-gradient(135deg, #6366f1, #a855f7)`), organic curves (the preloader blob), and motion-driven parallax. The 3D element must feel native to this language — not a disconnected tech demo.

New dependencies are required: `@react-three/fiber`, `@react-three/drei`, and `three`. These are code-split via `next/dynamic` so they don't bloat the initial bundle.

## Decisions

### 1. 3D element type: morphing blob (single organic form)

**Choice**: A single organic blob — an icosahedron sphere with vertex displacement driven by simplex noise — rendered with `@react-three/fiber` and `@react-three/drei`.

**Rationale**:
- **Brand echo**: The preloader already uses a blob as the intro animation motif. Reusing the organic-blob concept in 3D creates a cohesive brand language — the blob "graduates" from the 2D preloader into a living 3D presence.
- **Aesthetic fit**: The indigo/purple/pink gradient palette (`--color-accent: #6366f1`, `--color-accent-2: #a855f7`, `--color-accent-3: #ec4899`) maps naturally onto a 3D surface with gradient materials and colored point lights. The blob feels liquid, warm, and premium — exactly the Awwwards tone.
- **Right complexity**: A single blob with `MeshDistortMaterial` (from drei) is achievable in ~80 lines of R3F code. It's visually striking without being computationally expensive (unlike a particle field with thousands of entities or a wireframe with edge rendering overhead).
- **Mouse response**: A single blob can shift position (parallax) and vary its distortion amplitude based on cursor proximity — two clear, composable interaction axes.

**Rejected alternatives**:
- **Particle field**: Ubiquitous in portfolios; risks feeling generic. Thousands of particles with per-particle mouse response would strain the 60fps budget on mid-range devices.
- **Interconnected geometric wireframe**: Visually cold and tech-forward. Doesn't complement the warm, organic indigo/purple gradient aesthetic. Edge/line rendering in Three.js is more expensive than shaded triangles.

### 2. Placement: banner section only (scoped canvas)

**Choice**: The R3F `<Canvas>` renders as an absolutely-positioned layer inside the Banner `<section>`, behind the text and image content.

**Rationale**:
- **Scoped impact**: The canvas is confined to the hero section (100vh). It unmounts when the user scrolls past the banner, freeing GPU resources.
- **Simple integration**: The canvas sits at `position: absolute; inset: 0; z-index: 0; pointer-events: none` inside the banner. The existing content (`z-index: 1`) renders on top without modification.
- **The contact section is deferred**: The roadmap says "and possibly the contact section." Adding a second 3D instance (or a persistent canvas spanning multiple sections) introduces scroll-tracking complexity, z-index conflicts with section backgrounds, and continuous GPU usage. The skateboard approach: ship the banner blob first, evaluate, then consider extending to contact in a follow-up slice.

**Rejected alternative**: Full-page fixed canvas behind all sections — would consume GPU continuously, complicate `pointer-events` across sections, and fight with the existing `::before` gradient in the contact section footer-bg image.

### 3. Performance strategy: four-layer defense

**Choice**: A layered performance approach that ensures 60fps and graceful degradation.

| Layer | Mechanism | Effect |
|-------|-----------|--------|
| **Code splitting** | `next/dynamic(() => import('./Banner3D'), { ssr: false })` | R3F + drei + three (~150 KB gzipped) are deferred; never loaded on mobile |
| **Mobile skip** | `window.innerWidth < 768` check renders `null` | Mobile devices never download or execute the 3D bundle; the `::before` CSS gradient handles mobile background |
| **Pixel ratio cap** | `<Canvas dpr={[1, 2]}>` | Caps rendering resolution at 2x; prevents 3x Retina devices from rendering 3x the pixels |
| **Low-poly geometry** | `<icosahedronGeometry args={[1.8, 2]}>` (162 vertices) | Smooth enough for a blob silhouette after vertex displacement; 1/10th the vertices of a sphere with 32 segments |
| **Reduced motion** | Check `prefers-reduced-motion`; render static (no animation loop, no distortion) | Respects user accessibility preference; the blob renders as a static gradient-tinted sphere |

**Why `next/dynamic` not React `Suspense`**: `next/dynamic` with `ssr: false` ensures the R3F bundle is never included in the server bundle. React `Suspense` would still include the import in the server chunk even if it renders a fallback on the client. The R3F Canvas also requires `window` (WebGL context), so SSR must be disabled.

**Why skip on mobile entirely (not just reduce quality)**: Even with low-poly geometry and DPR cap, WebGL on mobile consumes significant battery and can cause thermal throttling. The CSS gradient is already beautiful on mobile — the 3D element adds marginal value for a high cost. The mobile check is `innerWidth < 768` (matching the existing responsive breakpoint) and runs once on mount.

### 4. Integration with existing `::before` gradient: coexist, reduced opacity

**Choice**: The `::before` CSS gradient remains as a subtle tint layer behind the 3D blob. When the 3D element is active, a `data-3d` attribute on the banner section reduces the gradient opacity.

**Implementation**:
```css
/* Existing: full gradient for mobile / no-3D */
.banner::before {
  opacity: 0.4;
}

/* When 3D is active: subtle tint only */
.banner[data-3d]::before {
  opacity: 0.06;
}
```

The 3D client component sets `document.getElementById('home')?.setAttribute('data-3d', '')` in a `useEffect` on mount, and removes it on cleanup.

**Why coexist rather than replace**: The `::before` gradient serves as a fallback for every scenario where 3D isn't available (mobile, JS disabled, WebGL context loss, loading state). Keeping it at low opacity behind the blob adds a subtle color tint that complements the 3D lighting without competing. If the gradient were fully removed, a WebGL context loss would leave a bare `#0a0a0f` background.

### 5. Mouse interaction model: subtle parallax position + distortion amplitude

**Choice**: Two composable effects driven by normalized mouse position, both with smooth lerp:

**Effect A — Position parallax**: The blob's world position shifts opposite to cursor direction. Cursor moves right → blob drifts slightly left. Maximum displacement: ±0.3 world units. This creates depth without the blob "chasing" the cursor.

**Effect B — Distortion response**: The `MeshDistortMaterial` distortion amplitude increases by ~20% when the cursor is near the center of the viewport (where the blob visually sits). The distortion fades back to baseline as the cursor moves to edges. This makes the blob feel "alive" and responsive without being distracting.

**Data flow**:
1. A `useEffect` attaches `mousemove` on `window`, normalizes coordinates to `[-1, 1]` range (both x and y), and stores in a `useRef`.
2. `useFrame` reads the ref, lerps a smoothed value toward the target (factor: 0.05), and applies to the blob group's position and the material's distort property.
3. No React state updates on every frame — refs + `useFrame` avoid re-renders.

**Why lerp not direct following**: Direct 1:1 cursor following feels robotic and can cause motion sickness. A 0.05 lerp factor creates a natural, organic delay that matches the `--ease-out-expo` animation language of the site.

**Why parallax not attraction**: Parallax (blob moves away from cursor) creates depth — the blob feels like it's in a deeper plane. Attraction (blob follows cursor) feels playful but flattens the scene and can read as "gimmicky."

## Consequences

**Positive**:
- The 3D blob creates an immediate premium impression that CSS alone cannot achieve. It's the signature Awwwards differentiator.
- Mobile users are unaffected — zero performance cost, the CSS gradient remains beautiful.
- The R3F bundle (~150 KB gzipped) is code-split and only loaded on desktop, after the page is interactive.
- The `data-3d` integration pattern is a clean additive layer — no existing CSS or JS needs to be modified, only extended.
- The preloader blob → 3D banner blob creates a subtle brand narrative across the page load sequence.

**Negative**:
- Three new dependencies (`@react-three/fiber`, `@react-three/drei`, `three`) totaling ~150 KB gzipped. Acceptable because they're code-split and only loaded on desktop.
- The `MeshDistortMaterial` from drei uses a custom shader that may need tuning for the light theme (the blob's surface color and lighting must adapt to both themes).
- WebGL context loss is a failure mode: the `::before` gradient fallback handles this, but the transition from 3D to flat gradient could be visually jarring if the context is lost mid-session.

**Follow-up**:
- **Contact section blob**: If the banner blob is well-received, a second, smaller blob (or the same blob transformed) could be added behind the Contact section. This would reuse the same `Banner3D` component with different props.
- **Theme-adaptive blob color**: The blob's material color and light colors should reference the CSS custom properties. Since R3F can't read CSS vars directly, a small JS bridge (reading `getComputedStyle`) can pass accent colors as props.
- **Feature 25 (Performance optimization)**: The lazy-loaded boundary and mobile skip should be validated with Lighthouse and real device testing.

## Build plan

1. **Install dependencies**: `npm install @react-three/fiber @react-three/drei three`
2. **Create `Banner3D.js` client component** in `src/components/sections/`:
   - `<Canvas>` with `dpr={[1, 2]}`, `camera={{ position: [0, 0, 5], fov: 45 }}`
   - Icosahedron geometry (detail=2, radius=1.8) with `MeshDistortMaterial` (distort=0.3, speed=2)
   - Two point lights (indigo + purple) and one ambient light
   - `useFrame` lerp for mouse-driven position and distortion
   - `useEffect` for `mousemove` listener, `prefers-reduced-motion` check, mobile width check, and `data-3d` attribute
3. **Create the lazy-load wrapper** in `Banner.js`: `const Banner3D = dynamic(() => import('./Banner3D'), { ssr: false })` with a `useState` + `useEffect` to defer mount until after the preloader reveal completes (avoiding a WebGL init during the preloader animation).
4. **Add CSS rule** for `[data-3d]::before` reduced opacity in `Banner.module.css`
5. **Style the canvas** with `position: absolute; inset: 0; z-index: 0; pointer-events: none`
6. **Theme bridge**: Read `--color-accent` and `--color-accent-2` from `getComputedStyle` in a `useEffect` and pass as props to the R3F scene
7. **Verify**: 60fps on desktop Chrome/Edge/Firefox, mobile renders CSS gradient only, `prefers-reduced-motion` users see static blob, and the blob integrates visually with the existing text/image parallax