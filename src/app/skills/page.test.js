// covers: AC-1 (skills route renders Skills section only)
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import SkillsPage, { metadata } from "@/app/skills/page";

vi.mock("@/components/sections/Skills", () => ({
  default: () => React.createElement("section", { "data-testid": "section-skills" }, "Skills"),
}));

describe("SkillsPage", () => {
  it("renders Skills section only", () => {
    render(React.createElement(SkillsPage));
    expect(screen.getByTestId("section-skills")).toBeInTheDocument();
  });

  it("does not render other sections", () => {
    render(React.createElement(SkillsPage));
    expect(screen.queryByTestId("section-banner")).toBeNull();
    expect(screen.queryByTestId("section-about")).toBeNull();
    expect(screen.queryByTestId("section-projects")).toBeNull();
    expect(screen.queryByTestId("section-contact")).toBeNull();
  });

  it("exports metadata with title and description", () => {
    expect(metadata.title).toContain("Skills");
    expect(metadata.description).toBeTruthy();
  });
});
