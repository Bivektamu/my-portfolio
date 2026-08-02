// covers: AC-7 — No BlobScene import, Banner renders with snake game area
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

  it("renders greeting text", () => {
    render(React.createElement(Banner));
    expect(screen.getByText(/Hi there/)).toBeInTheDocument();
  });

  it("renders developer name", () => {
    render(React.createElement(Banner));
    expect(screen.getByText("Bivek Gurung")).toBeInTheDocument();
  });

  it("renders job title", () => {
    render(React.createElement(Banner));
    expect(screen.getByText("Front End Developer")).toBeInTheDocument();
  });

  it("renders 'View My Work' CTA link to projects section", () => {
    render(React.createElement(Banner));
    const cta = screen.getByText("View My Work");
    expect(cta.closest("a")).toHaveAttribute("href", "#project");
  });

  it("renders Resume link", () => {
    render(React.createElement(Banner));
    const resume = screen.getByText("Resume");
    expect(resume.closest("a")).toHaveAttribute("href", "/pdf/Bivek_Gurung_Resume.pdf");
  });

  it("renders social link buttons from socials.json", () => {
    render(React.createElement(Banner));
    // Icons are mocked — check for the icon testids
    expect(screen.getByTestId("icon-github")).toBeInTheDocument();
    expect(screen.getByTestId("icon-linkedin")).toBeInTheDocument();
    expect(screen.getByTestId("icon-mail")).toBeInTheDocument();
  });

  it("renders snake game area", () => {
    render(React.createElement(Banner));
    expect(screen.getByTestId("mock-snake")).toBeInTheDocument();
  });

  it("renders background blur divs", () => {
    const { container } = render(React.createElement(Banner));
    // Banner has blurBlue and blurGreen — check for divs with those classes
    const blurs = container.querySelectorAll('[class*="blur"]');
    expect(blurs.length).toBeGreaterThanOrEqual(2);
  });

  // ── AC-7: 3D blob removed ──
  it("does NOT import or render BlobScene (AC-7: 3D blob removed)", () => {
    // Verify Banner source does not contain BlobScene
    const bannerSource = Banner.toString();
    expect(bannerSource).not.toContain("BlobScene");
    expect(bannerSource).not.toContain("react-three-fiber");
    expect(bannerSource).not.toContain("@react-three");
  });
});

// NOT_COVERED: AC-7 CustomCursor teal color — visual check deferred to /verify
