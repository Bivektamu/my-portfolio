// covers: idle state with start-game button, skip button, keyboard instructions,
// food meter, and D-pad controls
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import SnakeGame, { wouldSelfCollide } from "@/components/snake/SnakeGame";

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

  it("prevents the default (page scroll) for arrow keys while playing", () => {
    const preventDefaultSpy = vi.spyOn(KeyboardEvent.prototype, "preventDefault");
    render(React.createElement(SnakeGame));
    fireEvent.click(screen.getByText("start-game"));

    fireEvent.keyDown(window, { key: "ArrowUp" });
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("does not call preventDefault for arrow keys in idle state", () => {
    const preventDefaultSpy = vi.spyOn(KeyboardEvent.prototype, "preventDefault");
    render(React.createElement(SnakeGame));

    fireEvent.keyDown(window, { key: "ArrowUp" });
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  // ── Self-collision logic ──
  describe("wouldSelfCollide", () => {
    // Snake heading right: head at (5,5), body trailing to the left.
    const snake = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ];

    it("allows moving into the tail cell when not eating (tail advances)", () => {
      const newHead = { x: 3, y: 5 }; // the tail cell
      expect(wouldSelfCollide(snake, newHead, false)).toBe(false);
    });

    it("disallows moving into the tail cell when eating (tail stays)", () => {
      const newHead = { x: 3, y: 5 }; // the tail cell
      expect(wouldSelfCollide(snake, newHead, true)).toBe(true);
    });

    it("disallows moving into the body", () => {
      const newHead = { x: 4, y: 5 }; // a mid-body cell
      expect(wouldSelfCollide(snake, newHead, false)).toBe(true);
    });

    it("allows moving into an empty cell", () => {
      const newHead = { x: 6, y: 5 };
      expect(wouldSelfCollide(snake, newHead, false)).toBe(false);
    });
  });

  // ── Game over pauses the loop ──
  it("stops the game loop and shows the overlay when the snake hits a wall", () => {
    const clearIntervalSpy = vi.spyOn(window, "clearInterval");
    render(React.createElement(SnakeGame));
    fireEvent.click(screen.getByText("start-game"));

    // Snake starts at x=8 heading right; 8 ticks reach x=16 (wall collision).
    act(() => {
      vi.advanceTimersByTime(150 * 8);
    });

    expect(screen.getByText("game over")).toBeInTheDocument();
    expect(clearIntervalSpy).toHaveBeenCalled();

    // Loop must be stopped: more time passing changes nothing (no crash, overlay stays).
    act(() => {
      vi.advanceTimersByTime(150 * 10);
    });
    expect(screen.getByText("game over")).toBeInTheDocument();
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
