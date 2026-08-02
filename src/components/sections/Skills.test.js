// covers: AC-1 (structure — Skills section with chips and experience panel)
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import Skills from "@/components/sections/Skills";

describe("Skills", () => {
  it("renders section with id 'skill'", () => {
    render(React.createElement(Skills));
    expect(document.getElementById("skill")).toBeInTheDocument();
  });

  it("renders tabs header with 'skills.ts'", () => {
    render(React.createElement(Skills));
    expect(screen.getByText("skills.ts")).toBeInTheDocument();
  });

  it("renders skill chips for each skill from skills.json", () => {
    render(React.createElement(Skills));
    expect(screen.getByText("React + Redux")).toBeInTheDocument();
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("HTML")).toBeInTheDocument();
    expect(screen.getByText("CSS")).toBeInTheDocument();
    expect(screen.getByText("MongoDB")).toBeInTheDocument();
    expect(screen.getByText("Git")).toBeInTheDocument();
  });

  it("renders experience card with '7' years", () => {
    render(React.createElement(Skills));
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("Years of")).toBeInTheDocument();
    expect(screen.getByText("Experience")).toBeInTheDocument();
  });

  it("renders Call Now button with phone link", () => {
    render(React.createElement(Skills));
    const callBtn = screen.getByText("Call Now").closest("a");
    expect(callBtn).toHaveAttribute("href", "tel:+61452424565");
  });

  it("renders phone icon", () => {
    render(React.createElement(Skills));
    expect(screen.getByTestId("icon-im-phone")).toBeInTheDocument();
  });
});
