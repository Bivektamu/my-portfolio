// covers: AC-7 — No BlobScene import, Banner renders the hero content
// (intro text, github code line, game area, background glows) inside the SiteFrame
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// SnakeGame is an internal dependency — mock it to keep focus on Banner structure
vi.mock("@/components/snake/SnakeGame", () => ({
  default: () => React.createElement("div", { "data-testid": "mock-snake" }, "Snake"),
}));

import Banner from "@/components/sections/Banner";

describe("Banner", () => {
  it("renders section with id 'home'", () => {
    render(React.createElement(Banner));
    expect(document.getElementById("home")).toBeInTheDocument();
  });

  // ── Hero text ──
  it("renders greeting text", () => {
    render(React.createElement(Banner));
    expect(screen.getByText("Hi all. I am")).toBeInTheDocument();
  });

  it("renders the developer name", () => {
    render(React.createElement(Banner));
    expect(screen.getByText("Bivek Gurung")).toBeInTheDocument();
  });

  it("renders the job title", () => {
    render(React.createElement(Banner));
    expect(screen.getByText("> Front-end developer")).toBeInTheDocument();
  });

  it("renders the comment lines", () => {
    render(React.createElement(Banner));
    expect(screen.getByText("// complete the game to continue")).toBeInTheDocument();
    expect(screen.getByText("// find my profile on Github:")).toBeInTheDocument();
  });

  it("renders the github code line as a clickable link", () => {
    render(React.createElement(Banner));
    const link = screen.getByText(/https:\/\/github.com\/bivekgurung/);
    expect(link.closest("a")).toHaveAttribute("href", "https://github.com/bivekgurung");
  });

  // ── Game area ──
  it("renders snake game area", () => {
    render(React.createElement(Banner));
    expect(screen.getByTestId("mock-snake")).toBeInTheDocument();
  });

  // ── Background glows ──
  it("renders background glow divs", () => {
    const { container } = render(React.createElement(Banner));
    const glows = container.querySelectorAll('[class*="glow"]');
    expect(glows.length).toBeGreaterThanOrEqual(2);
  });

  // ── AC-7: 3D blob removed ──
  it("does NOT import or render BlobScene (AC-7: 3D blob removed)", () => {
    const bannerSource = Banner.toString();
    expect(bannerSource).not.toContain("BlobScene");
    expect(bannerSource).not.toContain("react-three-fiber");
    expect(bannerSource).not.toContain("@react-three");
  });
});
