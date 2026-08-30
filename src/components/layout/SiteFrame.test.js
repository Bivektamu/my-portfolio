// covers: SiteFrame renders the IDE window chrome — nav tabs with an active
// state, brand, and footer social bar — around any page content
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import SiteFrame from "@/components/layout/SiteFrame";

describe("SiteFrame", () => {
  it("renders the brand", () => {
    render(React.createElement(SiteFrame, null, React.createElement("div", null, "content")));
    expect(screen.getByText("bivek_gurung")).toBeInTheDocument();
  });

  it("renders all five nav tabs", () => {
    render(React.createElement(SiteFrame, null, React.createElement("div", null, "content")));
    expect(screen.getByText("_hello")).toBeInTheDocument();
    expect(screen.getByText("_about-me")).toBeInTheDocument();
    expect(screen.getByText("_projects")).toBeInTheDocument();
    expect(screen.getByText("_skills")).toBeInTheDocument();
    expect(screen.getByText("_contact-me")).toBeInTheDocument();
  });

  it("marks the home tab active on the home path (usePathname mocked to '/')", () => {
    render(React.createElement(SiteFrame, null, React.createElement("div", null, "content")));
    expect(screen.getByText("_hello").closest("a").className).toContain("tabActive");
    expect(screen.getByText("_about-me").closest("a").className).not.toContain("tabActive");
  });

  it("links each tab to its route", () => {
    render(React.createElement(SiteFrame, null, React.createElement("div", null, "content")));
    expect(screen.getByText("_about-me").closest("a")).toHaveAttribute("href", "/about");
    expect(screen.getByText("_projects").closest("a")).toHaveAttribute("href", "/projects");
    expect(screen.getByText("_skills").closest("a")).toHaveAttribute("href", "/skills");
    expect(screen.getByText("_contact-me").closest("a")).toHaveAttribute("href", "/contact");
  });

  it("renders the footer social bar", () => {
    render(React.createElement(SiteFrame, null, React.createElement("div", null, "content")));
    expect(screen.getByText("find me in:")).toBeInTheDocument();
    expect(screen.getByText("@bivekgurung")).toBeInTheDocument();
    expect(screen.getByTestId("icon-github")).toBeInTheDocument();
  });

  it("links the github footer to the profile", () => {
    render(React.createElement(SiteFrame, null, React.createElement("div", null, "content")));
    expect(screen.getByText("@bivekgurung").closest("a")).toHaveAttribute(
      "href",
      "https://github.com/bivekgurung"
    );
  });

  it("renders children inside the frame", () => {
    render(React.createElement(SiteFrame, null, React.createElement("p", null, "child-content")));
    expect(screen.getByText("child-content")).toBeInTheDocument();
  });
});
