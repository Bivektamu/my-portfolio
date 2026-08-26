# Snake

## Overview

A fully playable Snake game embedded in the home banner. Canvas-based rendering, keyboard and on-screen button controls, food counter, and idle/playing/game-over/win states. Starts in an idle pre-game state with instructions and a Start Game button rather than auto-starting.

## Key files

| File | Owns |
|---|---|
| `SnakeGame.js` | Game component — canvas rendering, game loop, keyboard controls, directional buttons, overlays |
| `SnakeGame.module.css` | Styling — code-editor dark board, teal snake, directional buttons, overlay states |

## Conventions

- Canvas API for rendering (no external game library)
- useRef for mutable game state (snake, food, direction), useState for React-rendered values (score, gameState)
- setInterval game loop at 150ms — cleared on unmount
- Game states: idle (default, instructions + Start Game), playing, game-over, win. Game over and win return to idle via resetToIdle
- Food counter (foodCount state) increments per food eaten, shown as `// food: 000` in the game header
- Neon teal glow on the board via CSS box-shadow
- Keyboard controls via window event listener
- On-screen directional buttons visible only on mobile (CSS media query)
- The component is self-contained — no props, no external state
- Exported as default from `SnakeGame.js`

## Gotchas

- The game loop uses useRef for snake/food/direction to avoid stale closure issues
- Direction changes are queued via nextDirectionRef to prevent 180-degree reversals within one tick
- Canvas size is 240x240 (15x15 grid, 16px cells)
- The game does not auto-start; the loop initializes only on Start Game click
- The component must not block page scroll — the keyboard handler does not call preventDefault
