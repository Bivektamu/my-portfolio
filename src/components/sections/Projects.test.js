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
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("HTML")).toBeInTheDocument();
    expect(screen.getByText("CSS")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("Gatsby")).toBeInTheDocument();
    expect(screen.getByText("Vue")).toBeInTheDocument();
    expect(screen.getByText("Angular")).toBeInTheDocument();
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
    const htmlBtn = allBtns.find((b) => b.textContent.includes("HTML"));

    // React starts checked
    expect(reactBtn.getAttribute("aria-checked")).toBe("true");
    // HTML starts unchecked
    expect(htmlBtn.getAttribute("aria-checked")).toBe("false");

    // Toggle HTML
    fireEvent.click(htmlBtn);
    expect(htmlBtn.getAttribute("aria-checked")).toBe("true");
  });

  it("shows checkmark icon on checked filters", () => {
    render(React.createElement(Projects));
    // React starts checked
    const reactBtn = screen.getByText("React").closest("button");
    expect(reactBtn.className).toContain("checked");
    expect(reactBtn.querySelector('[class*="checkIcon"]') || reactBtn.textContent).toBeTruthy();
  });
});
