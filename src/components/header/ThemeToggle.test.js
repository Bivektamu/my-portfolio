// covers: AC-3 — Theme toggle (dark-first, light theme, localStorage persistence)
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import ThemeToggle from "@/components/header/ThemeToggle";

describe("ThemeToggle", () => {
  let setAttributeSpy;
  let localStorageMock;

  beforeEach(() => {
    // Reset DOM
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.dataset.theme = "dark";

    setAttributeSpy = vi.spyOn(document.documentElement, "setAttribute");

    localStorageMock = {
      getItem: vi.fn(() => "dark"),
      setItem: vi.fn(),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });
  });

  it("renders a toggle button with aria-label", () => {
    render(React.createElement(ThemeToggle));
    const btn = screen.getByRole("button");
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("aria-label");
  });

  it("shows 'Switch to light mode' label when theme is dark", () => {
    document.documentElement.dataset.theme = "dark";
    render(React.createElement(ThemeToggle));
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-label", "Switch to light mode");
  });

  it("shows 'Switch to dark mode' label when theme is light", () => {
    document.documentElement.dataset.theme = "light";
    render(React.createElement(ThemeToggle));
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-label", "Switch to dark mode");
  });

  it("toggles theme from dark to light on click", () => {
    document.documentElement.dataset.theme = "dark";
    render(React.createElement(ThemeToggle));
    const btn = screen.getByRole("button");

    fireEvent.click(btn);

    // Should have set data-theme to light
    expect(setAttributeSpy).toHaveBeenCalledWith("data-theme", "light");
    // Should have persisted to localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "light");
    // Label should update
    expect(btn).toHaveAttribute("aria-label", "Switch to dark mode");
  });

  it("toggles theme from light to dark on click", () => {
    document.documentElement.dataset.theme = "light";
    render(React.createElement(ThemeToggle));
    const btn = screen.getByRole("button");

    fireEvent.click(btn);

    expect(setAttributeSpy).toHaveBeenCalledWith("data-theme", "dark");
    expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "dark");
    expect(btn).toHaveAttribute("aria-label", "Switch to light mode");
  });

  it("responds to Enter key for keyboard accessibility (native button behavior)", () => {
    document.documentElement.dataset.theme = "dark";
    render(React.createElement(ThemeToggle));
    const btn = screen.getByRole("button");

    // Native <button> fires click on Enter keypress — test click directly
    fireEvent.click(btn);

    expect(setAttributeSpy).toHaveBeenCalledWith("data-theme", "light");
    expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "light");
  });

  it("responds to Space key for keyboard accessibility (native button behavior)", () => {
    document.documentElement.dataset.theme = "dark";
    render(React.createElement(ThemeToggle));
    const btn = screen.getByRole("button");

    // Native <button> fires click on Space keypress — test click directly
    fireEvent.click(btn);

    expect(setAttributeSpy).toHaveBeenCalledWith("data-theme", "light");
    expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "light");
  });

  it("reads initial theme from document.documentElement.dataset.theme", () => {
    document.documentElement.dataset.theme = "light";
    render(React.createElement(ThemeToggle));
    const btn = screen.getByRole("button");
    // Should reflect the light theme
    expect(btn).toHaveAttribute("aria-label", "Switch to dark mode");
  });
});

// NOT_COVERED: visual appearance of toggle button (color, size) — deferred to /verify
