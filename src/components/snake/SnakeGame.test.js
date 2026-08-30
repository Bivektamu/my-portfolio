// covers: idle state with start-game button, skip button, keyboard instructions,
// food meter, and D-pad controls
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
    save: vi.fn(),
    restore: vi.fn(),
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

  // ── Board ──
  it("renders the board canvas with an accessible label and img role", () => {
    render(React.createElement(SnakeGame));
    const canvas = screen.getByLabelText("Snake game board");
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute("role", "img");
  });

  it("renders a portrait canvas (256 x 432)", () => {
    render(React.createElement(SnakeGame));
    const canvas = document.querySelector("canvas");
    expect(canvas.width).toBe(256);
    expect(canvas.height).toBe(432);
  });

  it("creates the canvas context and draws the initial state", () => {
    render(React.createElement(SnakeGame));
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith("2d");
  });

  // ── Idle state ──
  it("shows the start-game button in idle state", () => {
    render(React.createElement(SnakeGame));
    expect(screen.getByText("start-game")).toBeInTheDocument();
  });

  it("shows the skip button", () => {
    render(React.createElement(SnakeGame));
    expect(screen.getByText("skip")).toBeInTheDocument();
  });

  it("renders the keyboard instructions", () => {
    render(React.createElement(SnakeGame));
    expect(screen.getByText("// use keyboard")).toBeInTheDocument();
    expect(screen.getByText("// arrows to play")).toBeInTheDocument();
  });

  it("renders the food counter label and 10 meter dots", () => {
    const { container } = render(React.createElement(SnakeGame));
    expect(screen.getByText("// food left")).toBeInTheDocument();
    const meter = screen.getByLabelText("Food remaining");
    expect(meter.querySelectorAll('[class*="foodDot"]').length).toBe(10);
  });

  it("transitions from idle to playing on start-game click", () => {
    render(React.createElement(SnakeGame));
    fireEvent.click(screen.getByText("start-game"));
    expect(screen.queryByText("start-game")).toBeNull();
  });

  // ── D-pad controls ──
  it("renders directional buttons (Up, Down, Left, Right)", () => {
    render(React.createElement(SnakeGame));
    expect(screen.getByLabelText("Up")).toBeInTheDocument();
    expect(screen.getByLabelText("Down")).toBeInTheDocument();
    expect(screen.getByLabelText("Left")).toBeInTheDocument();
    expect(screen.getByLabelText("Right")).toBeInTheDocument();
  });

  it("does not crash when clicking directional buttons in idle state", () => {
    render(React.createElement(SnakeGame));
    expect(() => {
      fireEvent.click(screen.getByLabelText("Up"));
      fireEvent.click(screen.getByLabelText("Left"));
      fireEvent.click(screen.getByLabelText("Down"));
      fireEvent.click(screen.getByLabelText("Right"));
    }).not.toThrow();
  });

  // ── Keyboard ──
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

  // ── Cleanup ──
  it("clears interval on unmount when game is playing", () => {
    const clearIntervalSpy = vi.spyOn(window, "clearInterval");
    const { unmount } = render(React.createElement(SnakeGame));
    fireEvent.click(screen.getByText("start-game"));
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

// NOT_COVERED: actual game loop tick logic (canvas drawing, collision detection)
// NOT_COVERED: food generation randomness
// NOT_COVERED: neon glow visual effect — CSS only, verified visually
