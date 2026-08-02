// covers: AC-1 (structure — About section with file explorer layout)
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import About from "@/components/sections/About";

describe("About", () => {
  it("renders section with id 'about'", () => {
    render(React.createElement(About));
    expect(document.getElementById("about")).toBeInTheDocument();
  });

  it("renders file explorer sidebar with folders", () => {
    render(React.createElement(About));
    expect(screen.getByText("personal-info")).toBeInTheDocument();
    expect(screen.getByText("professional-info")).toBeInTheDocument();
    expect(screen.getByText("hobbies")).toBeInTheDocument();
  });

  it("expands folder on click", () => {
    render(React.createElement(About));
    const personalInfo = screen.getByText("personal-info");
    fireEvent.click(personalInfo);
    // After expanding, file items should appear
    expect(screen.getByText("bio.md")).toBeInTheDocument();
    expect(screen.getByText("contacts.md")).toBeInTheDocument();
  });

  it("collapses folder on second click", () => {
    render(React.createElement(About));
    const personalInfo = screen.getByText("personal-info");
    fireEvent.click(personalInfo); // expand
    fireEvent.click(personalInfo); // collapse
    // File items should no longer be visible
    expect(screen.queryByText("bio.md")).toBeNull();
  });

  it("shows code panel with line numbers", () => {
    render(React.createElement(About));
    // The code panel shows line numbers (numbers 1, 2, 3, ...)
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("renders gist cards with usernames and star counts", () => {
    render(React.createElement(About));
    // Multiple elements contain "bivekgurung" — use getAllByText
    const usernames = screen.getAllByText("bivekgurung");
    expect(usernames.length).toBeGreaterThanOrEqual(1);
    // Star count with ★ symbol
    const starElements = screen.getAllByText(/★/);
    expect(starElements.length).toBeGreaterThanOrEqual(1);
    // Gist titles
    expect(screen.getByText("useParallax")).toBeInTheDocument();
    expect(screen.getByText("MagneticButton")).toBeInTheDocument();
  });

  it("shows code-snippet bio content with developer object", () => {
    render(React.createElement(About));
    // Multiple "const" instances — use getAllByText
    const constElements = screen.getAllByText(/const/);
    expect(constElements.length).toBeGreaterThanOrEqual(1);
    const devElements = screen.getAllByText(/developer/);
    expect(devElements.length).toBeGreaterThanOrEqual(1);
    // Check for braces (the object literal)
    const braces = screen.getAllByText("{");
    expect(braces.length).toBeGreaterThanOrEqual(1);
  });
});
