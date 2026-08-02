# 0008 — Home / Banner Redesign

**Status**: Accepted
**Feature**: Home / Banner redesign (Roadmap #29)
**Date**: 2026-08-02

## Summary

Redesign the home banner to match the code-editor aesthetic: split layout with developer introduction on the left (Fira Code "Hi there, I'm", name display, job title, social links) and the snake game area on the right. CSS background blurs replace the removed 3D blob.

## Context

The current banner (feature #5, reimagined in #18) shows a greeting, a staggered character reveal of "I am Bivek", a CTA button, and an SVG illustration with scroll parallax. The 3D blob was removed in feature #26 (design system v3). The new design from `design-files/reference-images/porfolio-home-desktop.png` shows a code-editor inspired home section.

## Requirements

### AC-1: Split layout
The banner is split left and right. Left side has the developer introduction. Right side has the snake game area (feature #30). On mobile, the layout stacks vertically with the introduction on top and the game below.

### AC-2: Introduction text
"Hi there, I'm" in Fira Code 18px (`--font-size-intro`), color `--color-text-secondary`. Below it, the name "Bivek Gurung" in Fira Code 48px (`--font-size-name`), color `--color-text`. Below the name, the job title "Front End Developer" in Fira Code 20px.

### AC-3: Social link buttons
A row of social link buttons (GitHub, LinkedIn, Email) styled as code-editor buttons with the accent colors.

### AC-4: Background blurs
Two blurred circles (blue `#615fff` and green `#00d5be`) at 174px blur positioned behind the content as decorative background elements.

### AC-5: Scroll parallax
Introduction text shifts upward on scroll (parallax effect). The snake game area shifts at a slower rate.

### AC-6: Foreground container
The banner sits within the foreground container (70px padding, 1780px max width, 8px radius) matching the design system.

## Decision

Build the banner as a client component with motion parallax. Layout uses CSS flexbox with the foreground container pattern. Left column: introduction text, name, job title, social link buttons. Right column: snake game placeholder (feature #30). Background blurs are absolutely positioned divs with CSS filter blur.

The introduction text is static (no character stagger reveal — that was a v2 pattern). The name renders in Fira Code at 48px. Social links use data from `src/data/socials.json`.

## Build plan

### 1. Rewrite Banner.js layout (AC-1, AC-2, AC-3, AC-6)
Replace the current parallax layout with the split code-editor layout. Import personal data. Add foreground container wrapper.

### 2. Add background blur elements (AC-4)
Position two absolutely positioned blurred circles behind the content.

### 3. Wire scroll parallax (AC-5)
Use useScroll and useTransform from motion to shift the text column on scroll.

### 4. Integrate snake game area (feature #30 dependency)
Add a placeholder div on the right side for the snake game component.
