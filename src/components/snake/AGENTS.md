# Snake

## Overview

A fully playable Snake game embedded in the home banner. Canvas-based rendering on a portrait board, keyboard and on-screen D-pad controls, a food meter, and idle/playing/game-over/win states. Starts in an idle pre-game state showing a glowing neon-green snake plus a "start-game" button rather than auto-starting.

## Key files

| File | Owns |
|---|---|
| `SnakeGame.js` | Game component — canvas rendering, game loop, keyboard controls, D-pad, overlays, food meter |
| `SnakeGame.module.css` | Styling — gradient glass card with corner bolts, neon-green snake, D-pad, food meter, start-game and skip buttons |

## Conventions

- Canvas API for rendering (no external game library)
- useRef for mutable game state (snake, food, direction), useState for React-rendered values (score, gameState)
- setInterval game loop at 150ms — cleared on unmount
- Game states: idle (default, neon-green snake + start-game button), playing, game-over, win. Game over and win return to idle via resetToIdle
- Food meter (foodCount state) increments per food eaten, shown as a `// food left` label with a 10-dot grid
- Snake body is a thin neon-green glowing line with a lighter glowing head; the food dot is teal
- Keyboard controls via window event listener
- On-screen D-pad and skip button are always visible in the controls panel
- The component is self-contained — no props, no external state
- Exported as default from `SnakeGame.js`

## Gotchas

- The game loop uses useRef for snake/food/direction to avoid stale closure issues
- Direction changes are queued via nextDirectionRef to prevent 180-degree reversals within one tick
- Canvas size is 256x432 (16x27 grid, 16px cells)
- The game does not auto-start; the loop initializes only on the "start-game" button click
- The component must not block page scroll — while playing, the keyboard handler calls preventDefault only for the arrow keys (so the page does not scroll); other keys are unaffected
