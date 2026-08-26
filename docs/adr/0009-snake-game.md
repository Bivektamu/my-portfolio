# 0009 â€” Snake Game

**Status**: Superseded by [0012](0012-multi-page-routing-snake-update.md)
**Feature**: Snake game (playable, scored) (Roadmap #30)
**Date**: 2026-08-02

## Summary

A fully playable Snake game embedded in the home banner's right column. Arrow key and on-screen button controls, score tracking, game-over and win states, styled with the code-editor dark background and teal snake.

## Context

The design files show a snake game on the home page with a dark `#011627` background, teal `#46ecd5` snake body, on-screen directional button controls, and game-over/play-again states. The game is a signature interactive element that reinforces the code-editor developer brand.

## Requirements

### AC-1: Game board
A canvas or DOM-based game board with `#011627` background, bordered container. The snake moves on a grid within the board.

### AC-2: Snake movement
The snake moves continuously in the current direction. Arrow keys change direction (up, down, left, right). On-screen directional buttons also control the snake for mobile/touch users.

### AC-3: Food and scoring
Food items appear at random positions. Eating food increases the snake's length and the score. Score is displayed above or beside the game board.

### AC-4: Game over state
Collision with walls or the snake's own body triggers game over. "Game Over" text displays in Fira Code 24px. A "Start Again" button resets the game.

### AC-5: Win state
Reaching a target score or filling the board triggers a "Well Done" display with a play-again option.

### AC-6: Performance
The game runs at a smooth frame rate (game loop at ~150ms interval). Does not block page scroll or interaction.

### AC-7: Mobile support
On-screen directional buttons are visible and usable on mobile. The game board scales to fit the available space.

## Decision

Build the snake game as a self-contained client component using the HTML5 Canvas API. The game state (snake position, direction, food position, score, game status) is managed with React useState and useRef. A setInterval-based game loop drives the animation at 150ms intervals.

The game board size is 240x240 logical pixels on a canvas scaled for retina. The snake is drawn as filled rectangles in teal `#46ecd5`. Food is drawn as a circle in green `#00d5be`.

Controls: keyboard arrow keys (desktop) and a directional button pad (mobile, rendered as four buttons in a cross layout below the canvas).

States: playing, game-over, and win. Each state renders appropriate UI overlays.

## Build plan

### 1. Create SnakeGame component
New file `src/components/snake/SnakeGame.js` with canvas element, game loop, and state management. (AC-1, AC-2, AC-6)

### 2. Implement collision detection and scoring
Wall collision, self collision, food eating logic, and score counter. (AC-3, AC-4)

### 3. Add game-over and win states
Game-over overlay with "Game Over" text and "Start Again" button. Win overlay with "Well Done" text. (AC-4, AC-5)

### 4. Add on-screen directional controls
Directional button pad rendered below the canvas for mobile/touch. (AC-2, AC-7)

### 5. Integrate into Banner
Import and render SnakeGame in the banner's right column. (AC-1)
