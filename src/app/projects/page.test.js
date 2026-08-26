// covers: AC-1 (projects route renders Projects section only)
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import ProjectsPage, { metadata } from "@/app/projects/page";

vi.mock("@/components/sections/Projects", () => ({
  default: () => React.createElement("section", { "data-testid": "section-projects" }, "Projects"),
}));

describe("ProjectsPage", () => {
  it("renders Projects section only", () => {
    render(React.createElement(ProjectsPage));
    expect(screen.getByTestId("section-projects")).toBeInTheDocument();
  });

  it("does not render other sections", () => {
    render(React.createElement(ProjectsPage));
    expect(screen.queryByTestId("section-banner")).toBeNull();
    expect(screen.queryByTestId("section-about")).toBeNull();
    expect(screen.queryByTestId("section-skills")).toBeNull();
    expect(screen.queryByTestId("section-contact")).toBeNull();
  });

  it("exports metadata with title and description", () => {
    expect(metadata.title).toContain("Projects");
    expect(metadata.description).toBeTruthy();
  });
});
