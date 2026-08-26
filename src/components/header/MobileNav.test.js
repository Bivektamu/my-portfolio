// covers: AC-1 (navigation structure with path-based routing)
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

import MobileNav from "@/components/header/MobileNav";

const LINKS = [
  { href: "/", label: "_hello" },
  { href: "/about", label: "_about-me" },
  { href: "/projects", label: "_projects" },
  { href: "/skills", label: "_skills" },
  { href: "/contact", label: "_contact-me" },
];

describe("MobileNav", () => {
  it("renders hamburger button", () => {
    render(React.createElement(MobileNav, { links: LINKS, currentPath: "/" }));
    expect(screen.getByLabelText("Toggle navigation")).toBeInTheDocument();
  });

  it("renders all nav links with correct hrefs", () => {
    render(React.createElement(MobileNav, { links: LINKS, currentPath: "/" }));
    LINKS.forEach((link) => {
      const el = screen.getByText(link.label);
      expect(el).toBeInTheDocument();
      expect(el.closest("a")).toHaveAttribute("href", link.href);
    });
  });

  it("toggles nav open on hamburger click", () => {
    render(React.createElement(MobileNav, { links: LINKS, currentPath: "/" }));
    const btn = screen.getByLabelText("Toggle navigation");

    // Initially closed
    expect(btn.classList.toString()).not.toContain("open");

    // Click to open
    fireEvent.click(btn);
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
  });

  it("closes nav when a link is clicked", () => {
    render(React.createElement(MobileNav, { links: LINKS, currentPath: "/" }));
    const btn = screen.getByLabelText("Toggle navigation");

    // Open first
    fireEvent.click(btn);

    // Click a link
    const firstLink = screen.getByText("_hello");
    fireEvent.click(firstLink);

    // After click, the nav should close
    expect(btn.classList.toString()).not.toContain("open");
  });

  it("sets aria-expanded on hamburger button", () => {
    render(React.createElement(MobileNav, { links: LINKS, currentPath: "/" }));
    const btn = screen.getByLabelText("Toggle navigation");

    // Initially closed — aria-expanded should be false
    expect(btn.getAttribute("aria-expanded")).toBe("false");

    // Click to open
    fireEvent.click(btn);
    expect(btn.getAttribute("aria-expanded")).toBe("true");

    // Click to close
    fireEvent.click(btn);
    expect(btn.getAttribute("aria-expanded")).toBe("false");
  });

  it("highlights active route link based on currentPath", () => {
    render(React.createElement(MobileNav, { links: LINKS, currentPath: "/" }));
    // currentPath is "/" — the home link should have active class
    const homeLink = screen.getByText("_hello");
    expect(homeLink.closest("a").className).toContain("active");
  });

  it("highlights about link when currentPath is /about", () => {
    render(React.createElement(MobileNav, { links: LINKS, currentPath: "/about" }));
    const aboutLink = screen.getByText("_about-me");
    expect(aboutLink.closest("a").className).toContain("active");
  });
});
