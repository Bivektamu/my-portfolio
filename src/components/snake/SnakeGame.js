"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./SnakeGame.module.css";

const GRID_SIZE = 15;
const CELL_SIZE = 16;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const INITIAL_SPEED = 150;

const DIRECTION = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

function createInitialSnake() {
  const mid = Math.floor(GRID_SIZE / 2);
  return [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ];
}

function randomFood(snake) {
  const occupied = new Set(snake.map((s) => `${s.x},${s.y}`));
  const available = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      if (!occupied.has(`${x},${y}`)) available.push({ x, y });
    }
  }
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

export default function SnakeGame() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("idle"); // idle | playing | game-over | win
  const [score, setScore] = useState(0);
  const [foodCount, setFoodCount] = useState(0);
  const snakeRef = useRef(createInitialSnake());
  const foodRef = useRef(randomFood(snakeRef.current));
  const directionRef = useRef(DIRECTION.RIGHT);
  const nextDirectionRef = useRef(DIRECTION.RIGHT);
  const intervalRef = useRef(null);
  const scoreRef = useRef(0);
  const foodCountRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const snake = snakeRef.current;
    const food = foodRef.current;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw snake
    ctx.fillStyle = "#46ecd5";
    snake.forEach((seg) => {
      ctx.fillRect(seg.x * CELL_SIZE + 1, seg.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    });

    // Draw food
    if (food) {
      ctx.fillStyle = "#00d5be";
      ctx.beginPath();
      ctx.arc(
        food.x * CELL_SIZE + CELL_SIZE / 2,
        food.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2 - 2,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  }, []);

  const tick = useCallback(() => {
    directionRef.current = nextDirectionRef.current;
    const snake = snakeRef.current;
    const head = snake[0];
    const dir = directionRef.current;

    const newHead = { x: head.x + dir.x, y: head.y + dir.y };

    // Wall collision
    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      setGameState("game-over");
      return;
    }

    // Self collision
    if (snake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
      setGameState("game-over");
      return;
    }

    const newSnake = [newHead, ...snake];
    const food = foodRef.current;

    if (food && newHead.x === food.x && newHead.y === food.y) {
      // Ate food
      const newScore = scoreRef.current + 1;
      scoreRef.current = newScore;
      setScore(newScore);
      const newFoodCount = foodCountRef.current + 1;
      foodCountRef.current = newFoodCount;
      setFoodCount(newFoodCount);
      foodRef.current = randomFood(newSnake);

      if (!foodRef.current) {
        // Board full — win
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
    if (intervalRef.current) clearInterval(intervalRef.current);
    snakeRef.current = createInitialSnake();
    foodRef.current = randomFood(snakeRef.current);
    directionRef.current = DIRECTION.RIGHT;
    nextDirectionRef.current = DIRECTION.RIGHT;
    scoreRef.current = 0;
    foodCountRef.current = 0;
    setScore(0);
    setFoodCount(0);
    setGameState("playing");
    draw();
    intervalRef.current = setInterval(tick, INITIAL_SPEED);
  }, [tick, draw]);

  const resetToIdle = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    snakeRef.current = createInitialSnake();
    foodRef.current = randomFood(snakeRef.current);
    directionRef.current = DIRECTION.RIGHT;
    nextDirectionRef.current = DIRECTION.RIGHT;
    scoreRef.current = 0;
    foodCountRef.current = 0;
    setScore(0);
    setFoodCount(0);
    setGameState("idle");
    draw();
  }, [draw]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

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

  return (
    <div className={styles.game}>
      <div className={styles.header}>
        <span className={styles.label}>{"// snake_game.js"}</span>
        <span className={styles.score}>
          {"// food: "}
          {String(foodCount).padStart(3, "0")}
        </span>
      </div>

      <div className={styles.board}>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className={styles.canvas}
          aria-label="Snake game board"
          role="img"
        />

        {gameState === "idle" && (
          <div className={styles.overlay}>
            <p className={styles.instructions}>
              Use arrow keys to move,<br />
              eat the green food to grow,<br />
              avoid walls and your tail
            </p>
            <button className={styles.overlayBtn} onClick={startGame}>
              Start Game
            </button>
          </div>
        )}

        {gameState === "game-over" && (
          <div className={styles.overlay}>
            <p className={styles.overlayTitle}>Game Over</p>
            <button className={styles.overlayBtn} onClick={resetToIdle}>
              Start Again
            </button>
          </div>
        )}

        {gameState === "win" && (
          <div className={styles.overlay}>
            <p className={styles.overlayTitle}>Well Done</p>
            <button className={styles.overlayBtn} onClick={resetToIdle}>
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* On-screen directional buttons */}
      <div className={styles.controls}>
        <button className={styles.ctrlBtn} onClick={() => onDirection("UP")} aria-label="Up">
          &#9650;
        </button>
        <div className={styles.ctrlRow}>
          <button className={styles.ctrlBtn} onClick={() => onDirection("LEFT")} aria-label="Left">
            &#9664;
          </button>
          <button className={styles.ctrlBtn} onClick={() => onDirection("DOWN")} aria-label="Down">
            &#9660;
          </button>
          <button className={styles.ctrlBtn} onClick={() => onDirection("RIGHT")} aria-label="Right">
            &#9654;
          </button>
        </div>
      </div>
    </div>
  );
}
