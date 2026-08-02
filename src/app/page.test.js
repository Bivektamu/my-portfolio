// covers: AC-1 (section structure)
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import HomePage from "@/app/page";

// Mock section components to keep test focused on composition
vi.mock("@/components/sections/Banner", () => ({
  default: () => React.createElement("section", { "data-testid": "section-banner" }, "Banner"),
}));
vi.mock("@/components/sections/About", () => ({
  default: () => React.createElement("section", { "data-testid": "section-about" }, "About"),
}));
vi.mock("@/components/sections/Projects", () => ({
  default: () => React.createElement("section", { "data-testid": "section-projects" }, "Projects"),
}));
vi.mock("@/components/sections/Skills", () => ({
  default: () => React.createElement("section", { "data-testid": "section-skills" }, "Skills"),
}));
vi.mock("@/components/sections/Contact", () => ({
  default: () => React.createElement("section", { "data-testid": "section-contact" }, "Contact"),
}));

describe("HomePage", () => {
  it("renders all 5 sections: Banner, About, Projects, Skills, Contact", () => {
    render(React.createElement(HomePage));

    expect(screen.getByTestId("section-banner")).toBeInTheDocument();
    expect(screen.getByTestId("section-about")).toBeInTheDocument();
    expect(screen.getByTestId("section-projects")).toBeInTheDocument();
    expect(screen.getByTestId("section-skills")).toBeInTheDocument();
    expect(screen.getByTestId("section-contact")).toBeInTheDocument();
  });

  it("renders sections in correct order via test IDs", () => {
    const { container } = render(React.createElement(HomePage));
    const ids = ["section-banner", "section-about", "section-projects", "section-skills", "section-contact"];
    const positions = ids.map((id) => {
      const el = container.querySelector("[data-testid=\"" + id + "\"]");
      return el ? Array.from(container.querySelectorAll("[data-testid]")).indexOf(el) : -1;
    });
    // Each position should be greater than the previous
    positions.forEach((pos, i) => {
      expect(pos).toBeGreaterThan(-1);
      if (i > 0) expect(pos).toBeGreaterThan(positions[i - 1]);
    });
  });
});
