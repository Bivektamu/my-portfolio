// covers: AC-1 (about route renders About section only)
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import AboutPage, { metadata } from "@/app/about/page";

vi.mock("@/components/sections/About", () => ({
  default: () => React.createElement("section", { "data-testid": "section-about" }, "About"),
}));

describe("AboutPage", () => {
  it("renders About section only", () => {
    render(React.createElement(AboutPage));
    expect(screen.getByTestId("section-about")).toBeInTheDocument();
  });

  it("does not render other sections", () => {
    render(React.createElement(AboutPage));
    expect(screen.queryByTestId("section-banner")).toBeNull();
    expect(screen.queryByTestId("section-projects")).toBeNull();
    expect(screen.queryByTestId("section-skills")).toBeNull();
    expect(screen.queryByTestId("section-contact")).toBeNull();
  });

  it("exports metadata with title and description", () => {
    expect(metadata.title).toContain("About");
    expect(metadata.description).toBeTruthy();
  });
});
