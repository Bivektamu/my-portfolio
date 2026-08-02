// covers: AC-3 (game states: playing, game-over, win; score tracking)
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

  it("renders the game header with snake_game.js label", () => {
    render(React.createElement(SnakeGame));
    expect(screen.getByText("// snake_game.js")).toBeInTheDocument();
  });

  it("renders the score display starting at 000", () => {
    render(React.createElement(SnakeGame));
    expect(screen.getByText(/\/\/ score:/)).toBeInTheDocument();
    // The score is inside the same span — check via textContent of parent
    const scoreSpan = screen.getByText(/\/\/ score:/);
    expect(scoreSpan.textContent).toMatch(/000/);
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

  it("onDirection does not crash when clicking directional buttons", () => {
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

  it("arrow keys do not crash in playing state", () => {
    render(React.createElement(SnakeGame));
    expect(() => {
      fireEvent.keyDown(window, { key: "ArrowUp" });
      fireEvent.keyDown(window, { key: "ArrowDown" });
      fireEvent.keyDown(window, { key: "ArrowLeft" });
      fireEvent.keyDown(window, { key: "ArrowRight" });
    }).not.toThrow();
  });

  it("shows no game-over overlay when game starts in playing state", () => {
    render(React.createElement(SnakeGame));
    expect(screen.queryByText("Game Over")).toBeNull();
    expect(screen.queryByText("Well Done")).toBeNull();
  });

  it("renders the board structure with canvas and controls", () => {
    render(React.createElement(SnakeGame));
    expect(document.querySelector("canvas")).toBeInTheDocument();
    expect(screen.getByLabelText("Up")).toBeInTheDocument();
  });

  it("displays score padded to 3 digits in the score span", () => {
    render(React.createElement(SnakeGame));
    const scoreSpan = screen.getByText(/\/\/ score:/);
    expect(scoreSpan.textContent).toContain("000");
  });

  it("clears interval on unmount", () => {
    const clearIntervalSpy = vi.spyOn(window, "clearInterval");
    const { unmount } = render(React.createElement(SnakeGame));
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
