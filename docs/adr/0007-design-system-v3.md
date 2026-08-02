# 0007 — Design System v3 (Code-Editor Aesthetic)

**Status**: Accepted
**Feature**: Design system v3 (Code-editor aesthetic) (Roadmap #26)
**Date**: 2026-08-02

## Summary

Replace the v2 Awwwards glassmorphism design system with a code-editor and terminal inspired visual language. New font stack (Fira Code primary, Inter secondary), a dark code-editor color palette from `design-files/tokens.json`, and CSS custom properties that enable every section to adopt the code-editor aesthetic consistently.

## Context

The portfolio currently uses a v2 Awwwards design system (dark-first, glassmorphism surfaces, Poppins font, gradient accents, 3D blob) implemented in `src/app/globals.css` via CSS custom properties on `:root` and `[data-theme="light"]`. All 5 sections and supporting components (header, cursor, preloader, scroll spy, noise overlay) were built to this system.

The design files in `design-files/` (tokens.json plus 30+ reference images across desktop and mobile) define a new visual direction: a code-editor and terminal aesthetic with Fira Code typography, dark backgrounds (`#020618`, `#0f172b`, `#011627`), tab style navigation, file-explorer sidebars, code snippet displays, GitHub gist style cards, and an interactive snake game. Roadmap feature #26 "Design system v3" is the foundation every other redesign feature (28 to 36) depends on.

## Requirements

### AC-1: Font stack
Fira Code (headings, logo, code display) and Inter (body, UI labels) are loaded via next/font/google with swap display and CSS variable exports. Poppins is removed from the root layout.

### AC-2: Color tokens
All color tokens from tokens.json are mapped to semantic CSS custom properties in globals.css. The palette includes background colors (`#020618`, `#0f172b`, `#011627`), surface colors, text colors (`#f8fafc`, `#90a1b9`), and accent colors (`#615fff` blue, `#00d5be` green, `#c27aff` purple, `#ffb86a` orange, `#46ecd5` teal).

### AC-3: Dark-first with light alternative
The default theme is dark (tokens on `:root`). Light theme lives under `[data-theme="light"]` with derived lighter values. The existing theme toggle in the header still switches themes and persists to localStorage.

### AC-4: Spacing and layout tokens
Tokens for the foreground container (70px padding, 1780px content width), section gaps (10px), and component-level spacing are defined as CSS custom properties.

### AC-5: Effect and radius tokens
Border radius (4px small, 8px standard, 16px large for code blocks and images, 33px for pill shapes), blur effects (174px background blurs), and shadow tokens are defined.

### AC-6: Component pattern tokens
Tokens for code-editor UI patterns are defined: tab styling (active stroke `#ffb86a`, padding 16px 32px), code block backgrounds (`#011627`), line number colors, input and textarea styling (dark background, border stroke, error red), file explorer items, and gist card styling.

### AC-7: Existing components adapted
CustomCursor, NoiseOverlay, ScrollSpy, Preloader, and RevealOnScroll still render correctly with the new tokens. The 3D blob component (BlobScene) is removed: it does not fit the code-editor aesthetic and its ~150KB three.js dependency is replaced by CSS background blurs.

## Options considered

### Option A: Minimal token swap
Only swap color and font variables. Keep all component patterns and layouts unchanged from v2.
Rejected because the design files specify new layout and interaction patterns (foreground container, tab navigation, file explorer sidebar, code snippet panels) that require structural CSS changes beyond a simple variable swap.

### Option B: Full token overhaul with pattern tokens (chosen)
Replace all v2 tokens with v3 tokens derived from tokens.json. Add semantic pattern tokens for code-editor UI elements (tabs, code blocks, inputs, file explorers, gist cards). Restructure globals.css sections to match the new design language. Update all surviving components to use v3 tokens.

### Option C: CSS framework migration
Adopt a CSS framework (Tailwind or similar) to implement the new design.
Rejected because the project already uses CSS Modules and CSS custom properties effectively. A framework migration adds tooling complexity without proportional benefit for a single-page portfolio.

## Decision

Replace the v2 design tokens in `src/app/globals.css` with v3 tokens derived from `design-files/tokens.json`. The new token set uses the code-editor color palette, Fira Code plus Inter font stack, 8px radius system, and semantic pattern tokens for code-editor UI elements.

### Font loading

Load in `src/app/layout.js` via next/font/google:

```
Fira Code: weights 300, 400, 500, 600, 700, variable --font-fira-code
Inter: weights 400, 500, 600, 700, variable --font-inter
```

### Color tokens (on :root, dark default)

Backgrounds:
```
--color-bg: #020618
--color-bg-alt: #0f172b
--color-bg-code: #011627
--color-surface: #0f172b
--color-surface-elevated: #1a2744
```

Text:
```
--color-text: #f8fafc
--color-text-secondary: #90a1b9
--color-text-muted: #607b9b
```

Accents:
```
--color-accent-blue: #615fff
--color-accent-green: #00d5be
--color-accent-purple: #c27aff
--color-accent-orange: #ffb86a
--color-accent-teal: #46ecd5
```

Borders and strokes:
```
--color-border: #314158
--color-border-hover: #607b9b
--color-tab-stroke: #ffb86a
```

### Pattern tokens

Tab system:
```
--tab-bg: transparent
--tab-active-stroke: #ffb86a
--tab-padding: 16px 32px
--tab-gap: 10px
```

Code blocks:
```
--code-bg: #011627
--code-radius: 8px
--code-line-number-color: #607b9b
--code-padding: 16px
```

Inputs and textareas:
```
--input-bg: #0f172b
--input-border: #314158
--input-border-focus: #615fff
--input-error-border: #ff5555
--input-radius: 8px
--input-padding: 12px
```

Foreground container:
```
--foreground-padding: 70px
--foreground-radius: 8px
--foreground-max-width: 1780px
```

Gist cards:
```
--gist-bg: #0f172b
--gist-radius: 6px
--gist-padding: 26px 32px
```

File explorer:
```
--explorer-bg: transparent
--explorer-item-padding: 12px
--explorer-item-gap: 8px
--explorer-icon-size: 16px
```

### Spacing tokens
```
--space-section-gap: 10px
--space-container-padding: 70px
```

### Effect tokens
```
--blur-blue: blur(174px)
--blur-green: blur(174px)
--shadow-game: 0px 2px 0px 0px #ffffff
--shadow-code: 1px 5px 11px 0px #02121b
```

### Radius tokens
```
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 16px
--radius-xl: 33px
--radius-image-top: 16px 16px 0px 0px
--radius-image-bottom: 0px 0px 16px 16px
```

### Light theme ([data-theme="light"])

Derived from the dark palette by inverting backgrounds and text while keeping accent colors (they are vibrant enough to work on light):
```
--color-bg: #f0f2f5
--color-bg-alt: #e2e5ea
--color-bg-code: #f8f9fa
--color-surface: #ffffff
--color-surface-elevated: #f0f2f5
--color-text: #1a1a2e
--color-text-secondary: #3d3d5c
--color-text-muted: #6b6b80
--color-border: #d1d5db
--color-border-hover: #9ca3af
--color-tab-stroke: #ff6a00
--input-bg: #ffffff
--input-border: #d1d5db
--code-bg: #f8f9fa
--gist-bg: #ffffff
```

### Animation tokens (kept from v2)

These are not design-specific, they describe motion. Kept unchanged:
```
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)
--ease-spring: cubic-bezier(0.22, 0.61, 0.36, 1)
--duration-fast: 0.2s
--duration-normal: 0.4s
--duration-slow: 0.7s
--duration-reveal: 0.9s
```

### Layout tokens (kept from v2)
```
--header-height: 70px
--space-section: clamp(80px, 10vw, 140px)
```

### Implementation skills

none: pure CSS custom properties, no external tooling required.

### Components to remove

- `src/components/3d/BlobScene.js`: the 3D blob (~150KB via three.js plus R3F) belongs to the v2 Awwwards design. Replaced by CSS background blurs (zero JS, zero additional bytes).
- Dynamic import of BlobScene in `src/components/sections/Banner.js`.
- `[data-3d]` CSS rules in `Banner.module.css` that dim backgrounds when 3D is active.

### Components to adapt

- **CustomCursor**: recolor dot and ring from current accent to teal (`#46ecd5`).
- **Preloader**: adapt blob animation colors to code-editor palette.
- **NoiseOverlay**: keep as-is; SVG grain texture works on any dark background.
- **ScrollSpy**: keep as-is; no visual dependency on design tokens.
- **RevealOnScroll**: keep as-is; motion wrapper is design-agnostic.
- **Header**: redesigned entirely in feature #28 (tab nav, Fira Code logo).
- **All 5 sections**: redesigned entirely in features #29 to #34.

## Rationale

**Why code-editor aesthetic**: the design files establish a distinctive and memorable visual identity that stands out from typical portfolio sites. The code-editor metaphor reinforces the developer brand and is immediately recognizable to the target audience (recruiters and fellow developers).

**Why CSS custom properties**: the project already uses them effectively. They are zero-runtime (parsed at paint time), work in both server and client components, and are trivially themeable via the `data-theme` attribute. No migration cost: the globals.css file is rewritten in place.

**Why dark-first**: the design files are exclusively dark. Dark is the natural default for a code-editor theme. Light is provided as an accessible alternative.

**Why Fira Code plus Inter**: both are Google Fonts available via next/font/google at zero additional cost. Fira Code is the premier monospace font for code display with distinctive ligatures. Inter is the standard UI font optimized for readability at small sizes. Together they precisely match the design tokens in tokens.json.

**Why remove the 3D blob**: the blob (~150KB gzipped via three.js and R3F, code-split but still present) belongs to the v2 Awwwards design language. The v3 design replaces it with CSS background blurs at the home section, which cost zero JavaScript and zero additional bytes over the wire. Removing the blob simplifies the dependency tree and eliminates the R3F lazy-loading machinery.

**Why pattern tokens**: without explicit pattern tokens for tabs, code blocks, inputs, and file explorers, each section component would encode these values independently in its CSS Module. Pattern tokens ensure every section that uses a code block, a tab, or an input renders consistently. This prevents the design drift that occurred between v1 and v2.

## Consequences

### Positive
- Unified code-editor visual language across all sections, enforced by pattern tokens
- CSS-only background blurs replace the ~150KB R3F/three.js dependency, improving load performance
- Pattern tokens prevent per-section design drift
- Dark-first with light alternative serves both preferences
- Fira Code monospace headings create a distinctive brand identity

### Negative
- All 5 sections must be rebuilt to use the new tokens and patterns (roadmap features #28 to #34)
- The 3D blob, a signature v2 feature, is removed
- Poppins font is removed: return visitors may experience a brief font swap on first load after the change
- Monospace headings (Fira Code) feel significantly different from proportional headings (Poppins)

### Neutral
- Animation tokens and scroll behavior are unchanged: the site feels familiar in motion

## Build plan

### 1. Update font loading in layout.js (AC-1)
Replace Poppins import with Fira Code and Inter imports. Update the CSS variable name on the `<html>` element. Remove the old `--font-poppins` reference.

### 2. Rewrite globals.css with v3 tokens (AC-2 through AC-6)
Replace all `:root` and `[data-theme="light"]` blocks with v3 tokens. Add pattern token sections for tabs, code blocks, inputs, foreground container, gist cards, and file explorer. Keep the reset styles. Remove v2 glass, gradient, and shadow tokens. Remove the v2 fluid type scale and replace with Fira Code specific sizes from tokens.json.

### 3. Remove 3D blob and clean up references (AC-7)
Delete `src/components/3d/BlobScene.js` (and the 3d directory if empty). Remove the dynamic import and usage from `Banner.js`. Remove any `[data-3d]` CSS rules in `Banner.module.css`.

### 4. Adapt surviving components to v3 tokens (AC-7)
Update CustomCursor colors (dot and ring to teal accent). Update Preloader animation colors. Verify NoiseOverlay, ScrollSpy, and RevealOnScroll render correctly against the new background. No structural changes needed for these components.

### 5. Verify token coverage
Cross-reference every token in `design-files/tokens.json` against the new CSS custom properties. Document any intentional omissions in this ADR.

## References

### Project sources
- `design-files/tokens.json` — source of truth for all design tokens
- `design-files/reference-images/` — 30+ desktop and mobile screenshots defining the visual direction
- `src/app/globals.css` — current v2 design tokens, replaced by this ADR
- `src/app/layout.js` — current Poppins font loading, updated by build task 1
- `docs/roadmap/roadmap.md` — features #26 to #39 depend on this design system

### Practices and standards
- CSS custom properties for zero-runtime theming: enables server and client components to share design tokens
- next/font/google for optimal font loading: self-hosts at build time, no external Google Fonts requests
- Dark-first design with `data-theme` attribute: prevents flash of wrong theme via inline script
