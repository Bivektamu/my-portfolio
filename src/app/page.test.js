// covers: AC-1 (home page renders Banner only)
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import HomePage from "@/app/page";

// Mock Banner component to keep test focused
vi.mock("@/components/sections/Banner", () => ({
  default: () => React.createElement("section", { "data-testid": "section-banner" }, "Banner"),
}));

describe("HomePage", () => {
  it("renders Banner section only", () => {
    render(React.createElement(HomePage));
    expect(screen.getByTestId("section-banner")).toBeInTheDocument();
  });

  it("does not render other sections", () => {
    render(React.createElement(HomePage));
    expect(screen.queryByTestId("section-about")).toBeNull();
    expect(screen.queryByTestId("section-projects")).toBeNull();
    expect(screen.queryByTestId("section-skills")).toBeNull();
    expect(screen.queryByTestId("section-contact")).toBeNull();
  });
});
