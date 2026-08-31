// covers: AC-1 (structure — Projects section with tech filter checkboxes)
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import Projects from "@/components/sections/Projects";

describe("Projects", () => {
  it("renders section with id 'project'", () => {
    render(React.createElement(Projects));
    expect(document.getElementById("project")).toBeInTheDocument();
  });

  it("renders technology filter sidebar", () => {
    render(React.createElement(Projects));
    expect(screen.getByText("// technologies")).toBeInTheDocument();
  });

  it("renders all technology filter checkboxes", () => {
    render(React.createElement(Projects));
    ["React", "JavaScript", "TypeScript", "HTML", "CSS", "SASS", "Gatsby",
     "Redux", "GraphQL", "MongoDB", "Node.js", "Tailwind", "Stripe", "AWS"]
      .forEach((tech) => {
        expect(screen.getByText(tech)).toBeInTheDocument();
      });
  });

  it("starts with all filters unchecked and all projects visible", () => {
    render(React.createElement(Projects));
    const allBtns = screen.getAllByRole("checkbox");
    allBtns.forEach((btn) => {
      expect(btn.getAttribute("aria-checked")).toBe("false");
    });
    expect(screen.getByText("La Property Co")).toBeInTheDocument();
    expect(screen.getByText("Mobje Commerce")).toBeInTheDocument();
    expect(screen.getByText("Ticker Tape Library")).toBeInTheDocument();
  });

  it("toggles technology filter on click", () => {
    render(React.createElement(Projects));
    const htmlBtn = screen.getByText("HTML").closest("button");
    // HTML starts unchecked
    expect(htmlBtn.className).not.toContain("checked");

    fireEvent.click(htmlBtn);
    // After click, HTML should be checked
    expect(htmlBtn.className).toContain("checked");
  });

  it("filters the grid when a technology is selected", () => {
    render(React.createElement(Projects));
    fireEvent.click(screen.getByText("Gatsby"));

    // Only the Restaurant app uses Gatsby
    expect(screen.getByText("RESTAURANT WEB APP")).toBeInTheDocument();
    expect(screen.queryByText("La Property Co")).toBeNull();
    expect(screen.queryByText("Mobje Commerce")).toBeNull();
  });

  it("shows empty state when no project matches the selection", () => {
    render(React.createElement(Projects));
    fireEvent.click(screen.getByText("Gatsby"));
    fireEvent.click(screen.getByText("MongoDB"));

    expect(screen.getByText("// no projects match the selected technologies")).toBeInTheDocument();
    expect(screen.queryByText("RESTAURANT WEB APP")).toBeNull();
  });

  it("shows all projects again when filters are cleared", () => {
    render(React.createElement(Projects));
    fireEvent.click(screen.getByText("Gatsby"));
    expect(screen.queryByText("La Property Co")).toBeNull();

    fireEvent.click(screen.getByText("Gatsby"));
    expect(screen.getByText("La Property Co")).toBeInTheDocument();
  });

  it("renders project cards", () => {
    render(React.createElement(Projects));
    expect(screen.getByText("La Property Co")).toBeInTheDocument();
    expect(screen.getByText("Mobje Commerce")).toBeInTheDocument();
  });

  it("renders tabs header with 'projects'", () => {
    render(React.createElement(Projects));
    expect(screen.getByText("projects")).toBeInTheDocument();
  });

  it("sets role=checkbox and aria-checked on tech filter buttons", () => {
    render(React.createElement(Projects));
    const allBtns = screen.getAllByRole("checkbox");

    expect(allBtns.length).toBeGreaterThanOrEqual(1);

    const reactBtn = allBtns.find((b) => b.textContent.includes("React"));

    // React starts unchecked
    expect(reactBtn.getAttribute("aria-checked")).toBe("false");

    // Toggle React
    fireEvent.click(reactBtn);
    expect(reactBtn.getAttribute("aria-checked")).toBe("true");
  });

  it("shows checkmark icon on checked filters", () => {
    render(React.createElement(Projects));
    const htmlBtn = screen.getByText("HTML").closest("button");
    fireEvent.click(htmlBtn);
    expect(htmlBtn.className).toContain("checked");
    expect(htmlBtn.querySelector('[class*="checkIcon"]')).toBeTruthy();
  });
});
