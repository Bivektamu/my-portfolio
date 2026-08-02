# 0010 — About Redesign (File Explorer)

**Status**: Accepted
**Feature**: About redesign (File explorer, code snippets, gists) (Roadmap #31)
**Date**: 2026-08-02

## Summary

Redesign the About section with a code-editor file-explorer layout. Left sidebar: accordion of file categories. Main area: editor tabs, a code-snippet styled bio panel with line numbers, and GitHub gist style code cards.

## Context

The design files show the About page with a file-explorer sidebar (personal-info, professional-info, hobbies folders with expandable file items), editor tabs at the top, and a split main area with a code-snippet bio (line numbers, scrollbar) and gist cards (avatar, username, stars, code block preview). This replaces the current image + text layout.

## Requirements

### AC-1: File explorer sidebar
A vertical sidebar with expandable folder categories (personal-info, professional-info, hobbies). Each folder expands to show file items. Clicking a file item activates the corresponding content in the main area. Icons: folder icons (16px), file/markdown icons for items.

### AC-2: Editor tabs
A row of tabs at the top of the main area matching the active file. Tab has orange stroke (`#ffb86a`) when active.

### AC-3: Code-snippet bio panel
The left panel shows the bio text styled as a code snippet with line numbers on the left and the text on the right. A scrollbar allows scrolling long content. Line numbers use `--code-line-number-color`.

### AC-4: Gist cards panel
The right panel shows GitHub gist style cards. Each card has: user avatar (36px), username in Inter Bold 14px, timestamp, star count with icon, and a code block preview with `--code-bg` background and 16px border radius.

### AC-5: Responsive layout
On mobile, the sidebar becomes a horizontal dropdown, and the panels stack vertically.

### AC-6: Content
Bio text and code snippets come from `src/data/personal.json` extended with code snippet entries.

## Decision

Build the About section as a client component. The file explorer uses a recursive accordion component with folders and file items. The main area uses tab state to switch content. The code-snippet bio is a styled div with line numbers generated from the bio text. The gist cards are rendered from a code snippets data array.

No motion parallax on this section — the v2 scroll parallax pattern is replaced by the file-explorer interaction.

## Build plan

### 1. Create file explorer sidebar component (AC-1)
Accordion with folders (personal-info, professional-info, hobbies) and file items. Active file state.

### 2. Build editor tabs and content area (AC-2)
Tab row that switches content based on active file.

### 3. Build code-snippet bio panel (AC-3)
Line numbers + bio text in code-block styled container.

### 4. Build gist cards panel (AC-4)
Avatar, username, timestamp, stars, code block preview for each snippet.

### 5. Responsive layout (AC-5)
Mobile: horizontal dropdown sidebar, stacked panels.

### 6. Wire content data (AC-6)
Import from personal.json and a new code snippets data source.
