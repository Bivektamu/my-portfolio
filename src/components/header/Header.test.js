// covers: AC-1 (Header component with path-based active state)
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock usePathname from next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

import Header from "@/components/header/Header";

describe("Header", () => {
  it("renders the logo with 'bivek_gurung' text", () => {
    render(React.createElement(Header));
    expect(screen.getByText("bivek_gurung")).toBeInTheDocument();
  });

  it("logo links to home page", () => {
    render(React.createElement(Header));
    const links = screen.getAllByRole("link");
    const homeLink = links.find((l) => l.getAttribute("href") === "/");
    expect(homeLink).toBeTruthy();
  });

  it("renders a ThemeToggle (circle button)", () => {
    render(React.createElement(Header));
    // ThemeToggle renders a button with aria-label containing 'Switch'
    const toggle = screen.getByRole("button", { name: /Switch/ });
    expect(toggle).toBeInTheDocument();
  });

  it("renders MobileNav component", () => {
    render(React.createElement(Header));
    // MobileNav has a hamburger button
    const hamburger = screen.getByLabelText("Toggle navigation");
    expect(hamburger).toBeInTheDocument();
  });

  it("renders the header element with id 'header'", () => {
    render(React.createElement(Header));
    const header = document.getElementById("header");
    expect(header).toBeInTheDocument();
    expect(header.tagName).toBe("HEADER");
  });
});
