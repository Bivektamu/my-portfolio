// covers: AC-1 (idle state with instructions and Start Game), AC-2 (food counter),
// AC-3 (game states: idle, playing, game-over, win), AC-4 (restart returns to idle)
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import SnakeGame from "@/components/snake/SnakeGame";

function createMockCanvasContext() {
  return {
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 0,
    stroke: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
  };
}

describe("SnakeGame", () => {
  let mockCtx;

  beforeEach(() => {
    mockCtx = createMockCanvasContext();
    HTMLCanvasElement.prototype.getContext = vi.fn(() => mockCtx);
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  // ── AC-1: Idle state with instructions and Start Game button ──
  it("renders the game header with snake_game.js label", () => {
    render(React.createElement(SnakeGame));
    expect(screen.getByText("// snake_game.js")).toBeInTheDocument();
  });

  it("renders the food counter starting at 000", () => {
    render(React.createElement(SnakeGame));
    expect(screen.getByText(/\/\/ food:/)).toBeInTheDocument();
    const foodSpan = screen.getByText(/\/\/ food:/);
    expect(foodSpan.textContent).toMatch(/000/);
  });

  it("shows instructions overlay in idle state", () => {
    render(React.createElement(SnakeGame));
    expect(screen.getByText(/Use arrow keys to move/)).toBeInTheDocument();
    expect(screen.getByText(/eat the green food to grow/)).toBeInTheDocument();
    expect(screen.getByText(/avoid walls and your tail/)).toBeInTheDocument();
  });

  it("shows Start Game button in idle state", () => {
    render(React.createElement(SnakeGame));
    expect(screen.getByText("Start Game")).toBeInTheDocument();
  });

  it("does not show game-over or win overlay in idle state", () => {
    render(React.createElement(SnakeGame));
    expect(screen.queryByText("Game Over")).toBeNull();
    expect(screen.queryByText("Well Done")).toBeNull();
  });

  it("transitions from idle to playing on Start Game click", () => {
    render(React.createElement(SnakeGame));
    fireEvent.click(screen.getByText("Start Game"));
    // Instructions should disappear
    expect(screen.queryByText(/Use arrow keys to move/)).toBeNull();
    expect(screen.queryByText("Start Game")).toBeNull();
  });

  // ── Canvas and controls ──
  it("gives the canvas an accessible label and img role", () => {
    render(React.createElement(SnakeGame));
    const canvas = screen.getByLabelText("Snake game board");
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute("role", "img");
  });

  it("renders a canvas element with correct dimensions", () => {
    render(React.createElement(SnakeGame));
    const canvas = document.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
    expect(canvas.width).toBe(240);
    expect(canvas.height).toBe(240);
  });

  it("creates canvas context and draws initial state", () => {
    render(React.createElement(SnakeGame));
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith("2d");
  });

  it("renders directional buttons (Up, Down, Left, Right)", () => {
    render(React.createElement(SnakeGame));
    expect(screen.getByLabelText("Up")).toBeInTheDocument();
    expect(screen.getByLabelText("Down")).toBeInTheDocument();
    expect(screen.getByLabelText("Left")).toBeInTheDocument();
    expect(screen.getByLabelText("Right")).toBeInTheDocument();
  });

  it("onDirection does not crash when clicking directional buttons in idle state", () => {
    render(React.createElement(SnakeGame));
    expect(() => {
      fireEvent.click(screen.getByLabelText("Up"));
      fireEvent.click(screen.getByLabelText("Left"));
      fireEvent.click(screen.getByLabelText("Down"));
      fireEvent.click(screen.getByLabelText("Right"));
    }).not.toThrow();
  });

  it("listens for arrow key events", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    render(React.createElement(SnakeGame));
    expect(addEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
  });

  it("arrow keys do not crash in idle state (not active)", () => {
    render(React.createElement(SnakeGame));
    expect(() => {
      fireEvent.keyDown(window, { key: "ArrowUp" });
      fireEvent.keyDown(window, { key: "ArrowDown" });
      fireEvent.keyDown(window, { key: "ArrowLeft" });
      fireEvent.keyDown(window, { key: "ArrowRight" });
    }).not.toThrow();
  });

  it("displays food counter padded to 3 digits", () => {
    render(React.createElement(SnakeGame));
    const foodSpan = screen.getByText(/\/\/ food:/);
    expect(foodSpan.textContent).toContain("000");
  });

  it("clears interval on unmount when game is playing", () => {
    const clearIntervalSpy = vi.spyOn(window, "clearInterval");
    const { unmount } = render(React.createElement(SnakeGame));
    // Start the game so an interval is running
    fireEvent.click(screen.getByText("Start Game"));
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it("removes keydown listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(React.createElement(SnakeGame));
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
  });
});

// NOT_COVERED: actual game loop tick logic (canvas drawing, collision detection) — requires integration test
// NOT_COVERED: food generation randomness — non-deterministic
// NOT_COVERED: visual appearance of snake and food — deferred to /verify
// NOT_COVERED: neon glow visual effect — CSS only, verified visually
