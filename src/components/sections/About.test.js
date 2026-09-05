// covers: AC-1 (structure — About section with file explorer layout),
// and per-file content switching
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

  it("starts with personal-info expanded so files are visible", () => {
    render(React.createElement(About));
    expect(screen.getByText("bio.md")).toBeInTheDocument();
    expect(screen.getByText("contacts.md")).toBeInTheDocument();
  });

  it("collapses a folder on click and re-expands on second click", () => {
    render(React.createElement(About));
    const personalInfo = screen.getByText("personal-info");
    fireEvent.click(personalInfo); // collapse
    expect(screen.queryByText("bio.md")).toBeNull();

    fireEvent.click(personalInfo); // expand again
    expect(screen.getByText("bio.md")).toBeInTheDocument();
  });

  it("sets aria-expanded on folder toggle buttons", () => {
    render(React.createElement(About));
    const personalBtn = screen.getByText("personal-info").closest("button");
    const professionalBtn = screen.getByText("professional-info").closest("button");

    // personal-info starts expanded, professional-info starts collapsed
    expect(personalBtn.getAttribute("aria-expanded")).toBe("true");
    expect(professionalBtn.getAttribute("aria-expanded")).toBe("false");

    // Toggle personal-info off and on
    fireEvent.click(personalBtn);
    expect(personalBtn.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(personalBtn);
    expect(personalBtn.getAttribute("aria-expanded")).toBe("true");
  });

  it("shows code panel with line numbers", () => {
    render(React.createElement(About));
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("shows the bio content by default", () => {
    render(React.createElement(About));
    const devElements = screen.getAllByText(/developer/);
    expect(devElements.length).toBeGreaterThanOrEqual(1);
    const constElements = screen.getAllByText(/const/);
    expect(constElements.length).toBeGreaterThanOrEqual(1);
  });

  it("switches to contacts content when contacts.md is clicked", () => {
    render(React.createElement(About));
    fireEvent.click(screen.getByText("contacts.md"));
    expect(screen.getByText(/bivek.tamu@gmail.com/)).toBeInTheDocument();
  });

  it("switches to experience content when experience.md is clicked", () => {
    render(React.createElement(About));
    fireEvent.click(screen.getByText("professional-info"));
    fireEvent.click(screen.getByText("experience.md"));
    expect(screen.getByText(/Ondicom/)).toBeInTheDocument();
    expect(screen.getByText(/Thinkun/)).toBeInTheDocument();
  });

  it("switches to interests content when interests.md is clicked", () => {
    render(React.createElement(About));
    fireEvent.click(screen.getByText("hobbies"));
    fireEvent.click(screen.getByText("interests.md"));
    expect(screen.getByText(/hiking/)).toBeInTheDocument();
  });

});
