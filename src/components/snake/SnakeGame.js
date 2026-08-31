"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./SnakeGame.module.css";

const GRID_COLS = 16;
const GRID_ROWS = 27;
const CELL_SIZE = 16;
const CANVAS_WIDTH = GRID_COLS * CELL_SIZE; // 256
const CANVAS_HEIGHT = GRID_ROWS * CELL_SIZE; // 432
const MAX_FOOD = 10;
const INITIAL_SPEED = 150;

// In the idle state the food dot sits near the top of the board.
const IDLE_FOOD = { x: 4, y: 2 };

const DIRECTION = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

// The idle snake path matches the screenshot: head near the upper middle,
// travelling down, turning right, then down again.
function createIdleSnake() {
  return [
    { x: 8, y: 6 },
    { x: 8, y: 7 },
    { x: 8, y: 8 },
    { x: 8, y: 9 },
    { x: 8, y: 10 },
    { x: 8, y: 11 },
    { x: 9, y: 11 },
    { x: 10, y: 11 },
    { x: 11, y: 11 },
    { x: 11, y: 12 },
    { x: 11, y: 13 },
    { x: 11, y: 14 },
    { x: 11, y: 15 },
    { x: 11, y: 16 },
    { x: 11, y: 17 },
  ];
}

// The real game snake starts as a short horizontal run in the middle.
function createInitialSnake() {
  const y = Math.floor(GRID_ROWS / 2);
  const x = Math.floor(GRID_COLS / 2);
  return [
    { x, y },
    { x: x - 1, y },
    { x: x - 2, y },
  ];
}

function randomFood(snake) {
  const occupied = new Set(snake.map((s) => `${s.x},${s.y}`));
  const available = [];
  for (let x = 0; x < GRID_COLS; x++) {
    for (let y = 0; y < GRID_ROWS; y++) {
      if (!occupied.has(`${x},${y}`)) available.push({ x, y });
    }
  }
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

export default function SnakeGame() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("idle"); // idle | playing | game-over | win
  const [foodCount, setFoodCount] = useState(0);
  const snakeRef = useRef(createIdleSnake());
  const foodRef = useRef(IDLE_FOOD);
  const directionRef = useRef(DIRECTION.RIGHT);
  const nextDirectionRef = useRef(DIRECTION.RIGHT);
  const intervalRef = useRef(null);
  const foodCountRef = useRef(0);

  const stopLoop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const snake = snakeRef.current;
    const food = foodRef.current;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Snake as a thin glowing neon-green line with a glowing head
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 7;
    ctx.strokeStyle = "#4ade80";
    ctx.shadowColor = "#4ade80";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    const head = snake[0];
    ctx.moveTo(head.x * CELL_SIZE + CELL_SIZE / 2, head.y * CELL_SIZE + CELL_SIZE / 2);
    for (let i = 1; i < snake.length; i++) {
      const seg = snake[i];
      ctx.lineTo(seg.x * CELL_SIZE + CELL_SIZE / 2, seg.y * CELL_SIZE + CELL_SIZE / 2);
    }
    ctx.stroke();

    // Glowing circular head
    ctx.beginPath();
    ctx.arc(
      head.x * CELL_SIZE + CELL_SIZE / 2,
      head.y * CELL_SIZE + CELL_SIZE / 2,
      6,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = "#7dfba9";
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.restore();

    // Glowing food dot
    if (food) {
      ctx.save();
      ctx.fillStyle = "#36d9d0";
      ctx.shadowColor = "#36d9d0";
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(
        food.x * CELL_SIZE + CELL_SIZE / 2,
        food.y * CELL_SIZE + CELL_SIZE / 2,
        5,
        0,
        2 * Math.PI
      );
      ctx.fill();
      ctx.restore();
    }
  }, []);

  const tick = useCallback(() => {
    directionRef.current = nextDirectionRef.current;
    const snake = snakeRef.current;
    const head = snake[0];
    const dir = directionRef.current;

    const newHead = { x: head.x + dir.x, y: head.y + dir.y };

    // Wall collision
    if (newHead.x < 0 || newHead.x >= GRID_COLS || newHead.y < 0 || newHead.y >= GRID_ROWS) {
      stopLoop();
      setGameState("game-over");
      return;
    }

    // Self collision
    if (snake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
      stopLoop();
      setGameState("game-over");
      return;
    }

    const newSnake = [newHead, ...snake];
    const food = foodRef.current;

    if (food && newHead.x === food.x && newHead.y === food.y) {
      const newFoodCount = foodCountRef.current + 1;
      foodCountRef.current = newFoodCount;
      setFoodCount(newFoodCount);
      foodRef.current = randomFood(newSnake);

      if (newFoodCount >= MAX_FOOD || !foodRef.current) {
        // Board full or food target reached — win
        stopLoop();
        setGameState("win");
        snakeRef.current = newSnake;
        draw();
        return;
      }
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    draw();
  }, [draw]);

  const startGame = useCallback(() => {
    stopLoop();
    snakeRef.current = createInitialSnake();
    foodRef.current = randomFood(snakeRef.current);
    directionRef.current = DIRECTION.RIGHT;
    nextDirectionRef.current = DIRECTION.RIGHT;
    foodCountRef.current = 0;
    setFoodCount(0);
    setGameState("playing");
    draw();
    intervalRef.current = setInterval(tick, INITIAL_SPEED);
  }, [tick, draw]);

  const resetToIdle = useCallback(() => {
    stopLoop();
    snakeRef.current = createIdleSnake();
    foodRef.current = IDLE_FOOD;
    directionRef.current = DIRECTION.RIGHT;
    nextDirectionRef.current = DIRECTION.RIGHT;
    foodCountRef.current = 0;
    setFoodCount(0);
    setGameState("idle");
    draw();
  }, [draw]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLoop();
    };
  }, [stopLoop]);

  // Draw initial board on mount (idle state)
  useEffect(() => {
    draw();
  }, [draw]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      if (gameState !== "playing") return;
      const current = directionRef.current;
      switch (e.key) {
        case "ArrowUp":
          if (current !== DIRECTION.DOWN) nextDirectionRef.current = DIRECTION.UP;
          break;
        case "ArrowDown":
          if (current !== DIRECTION.UP) nextDirectionRef.current = DIRECTION.DOWN;
          break;
        case "ArrowLeft":
          if (current !== DIRECTION.RIGHT) nextDirectionRef.current = DIRECTION.LEFT;
          break;
        case "ArrowRight":
          if (current !== DIRECTION.LEFT) nextDirectionRef.current = DIRECTION.RIGHT;
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState]);

  const onDirection = (dir) => {
    if (gameState !== "playing") return;
    const current = directionRef.current;
    if (dir === "UP" && current !== DIRECTION.DOWN) nextDirectionRef.current = DIRECTION.UP;
    if (dir === "DOWN" && current !== DIRECTION.UP) nextDirectionRef.current = DIRECTION.DOWN;
    if (dir === "LEFT" && current !== DIRECTION.RIGHT) nextDirectionRef.current = DIRECTION.LEFT;
    if (dir === "RIGHT" && current !== DIRECTION.LEFT) nextDirectionRef.current = DIRECTION.RIGHT;
  };

  const remaining = Math.max(0, MAX_FOOD - foodCount);

  return (
    <div className={styles.card}>
      {/* Decorative corner bolts */}
      <span className={`${styles.bolt} ${styles.boltTL}`} aria-hidden="true" />
      <span className={`${styles.bolt} ${styles.boltTR}`} aria-hidden="true" />
      <span className={`${styles.bolt} ${styles.boltBL}`} aria-hidden="true" />
      <span className={`${styles.bolt} ${styles.boltBR}`} aria-hidden="true" />

      <div className={styles.left}>
        <div className={styles.board}>
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className={styles.canvas}
            aria-label="Snake game board"
            role="img"
          />

          {gameState === "idle" && (
            <button className={styles.startBtn} onClick={startGame}>
              start-game
            </button>
          )}

          {gameState === "game-over" && (
            <div className={styles.overlay}>
              <p className={styles.overlayTitle}>game over</p>
              <button className={styles.overlayBtn} onClick={resetToIdle}>
                play-again
              </button>
            </div>
          )}

          {gameState === "win" && (
            <div className={styles.overlay}>
              <p className={styles.overlayTitle}>well done</p>
              <button className={styles.overlayBtn} onClick={resetToIdle}>
                play-again
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.controlsPanel}>
          <p className={styles.instructions}>
            <span>{"// use keyboard"}</span>
            <br />
            <span>{"// arrows to play"}</span>
          </p>

          <div className={styles.dpad}>
            <button
              className={`${styles.dpadBtn} ${styles.dpadUp}`}
              onClick={() => onDirection("UP")}
              aria-label="Up"
            >
              &#9650;
            </button>
            <div className={styles.dpadRow}>
              <button
                className={styles.dpadBtn}
                onClick={() => onDirection("LEFT")}
                aria-label="Left"
              >
                &#9664;
              </button>
              <button
                className={styles.dpadBtn}
                onClick={() => onDirection("DOWN")}
                aria-label="Down"
              >
                &#9660;
              </button>
              <button
                className={styles.dpadBtn}
                onClick={() => onDirection("RIGHT")}
                aria-label="Right"
              >
                &#9654;
              </button>
            </div>
          </div>
        </div>

        <div className={styles.foodPanel}>
          <p className={styles.foodLabel}>{"// food left"}</p>
          <div className={styles.foodMeter} aria-label="Food remaining">
            {Array.from({ length: MAX_FOOD }).map((_, i) => {
              const lit = i < remaining;
              const opacity = lit ? Math.max(0.4, 1 - i * 0.06) : 0.18;
              return (
                <span
                  key={i}
                  className={`${styles.foodDot} ${lit ? "" : styles.foodDotDim}`}
                  style={{ opacity }}
                  aria-hidden="true"
                />
              );
            })}
          </div>
        </div>

        <button className={styles.skipBtn} onClick={resetToIdle} aria-label="Skip">
          skip
        </button>
      </div>
    </div>
  );
}
