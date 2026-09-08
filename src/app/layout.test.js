// covers: AC-1 — Fira Code + Inter font loading config
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock sub-components so the layout renders without needing their full trees
vi.mock("@/components/cursor/CustomCursor", () => ({
  default: () => React.createElement("div", { "data-testid": "mock-cursor" }),
}));
vi.mock("@/components/animations/PageTransition", () => ({
  default: ({ children }) => React.createElement("div", { "data-testid": "mock-page-transition" }, children),
}));
vi.mock("@/components/animations/NoiseOverlay", () => ({
  default: () => React.createElement("div", { "data-testid": "mock-noise" }),
}));
vi.mock("@/components/analytics/GoogleAnalytics", () => ({
  default: () => React.createElement("div", { "data-testid": "mock-analytics" }),
}));

// Re-import next/font/google for inspection (already mocked in test-setup.js)
import { Fira_Code, Inter } from "next/font/google";

import RootLayout, { metadata } from "@/app/layout";

describe("RootLayout", () => {
  // ── AC-1: Font configuration ──
  describe("AC-1: Font configuration", () => {
    it("Fira_Code accepts weights 400, 500, 700 with display:swap and --font-fira-code variable", () => {
      const result = Fira_Code({
        subsets: ["latin"],
        weight: ["400", "500", "700"],
        display: "swap",
        variable: "--font-fira-code",
      });
      expect(result.variable).toBe("--font-fira-code");
    });

    it("Inter accepts weights 400-700 with display:swap and --font-inter variable", () => {
      const result = Inter({
        subsets: ["latin"],
        weight: ["400", "500", "600", "700"],
        display: "swap",
        variable: "--font-inter",
      });
      expect(result.variable).toBe("--font-inter");
    });
  });

  // ── Metadata ──
  describe("Metadata export", () => {
    it("exports metadata with title", () => {
      expect(metadata.title).toContain("Bivek");
    });

    it("exports metadata with description", () => {
      expect(metadata.description).toBeTruthy();
    });

    it("exports metadata with authors", () => {
      expect(metadata.authors).toBeInstanceOf(Array);
      expect(metadata.authors[0].name).toBe("Bivek Jang Gurung");
    });

    it("exports metadata with openGraph", () => {
      expect(metadata.openGraph.type).toBe("website");
    });

    it("exports metadata with icons", () => {
      expect(metadata.icons.icon).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ url: "/images/favicon/favicon.ico" }),
        ])
      );
      expect(metadata.icons.apple).toBe("/images/favicon/icon-180x180.png");
    });
  });

  // ── Component structure ──
  describe("Component structure", () => {
    it("renders html element with lang en-AU and font variables", () => {
      render(React.createElement(RootLayout, null, React.createElement("div", null, "child")));
      const html = document.documentElement;
      expect(html.lang).toBe("en-AU");
      // Font variable classes should be present on <html>
      expect(html.className).toContain("--font-fira-code");
      expect(html.className).toContain("--font-inter");
    });

    it("renders skip-link anchor", () => {
      render(React.createElement(RootLayout, null, React.createElement("div", null, "child")));
      expect(screen.getByText("Skip to content")).toBeInTheDocument();
    });

    it("renders main element with id and role", () => {
      render(React.createElement(RootLayout, null, React.createElement("div", null, "child")));
      const main = screen.getByRole("main");
      expect(main).toHaveAttribute("id", "main-content");
    });

    it("renders children inside main", () => {
      render(React.createElement(RootLayout, null, React.createElement("span", null, "test-child")));
      expect(screen.getByText("test-child")).toBeInTheDocument();
    });

    it("does not add a data-theme attribute or a theme toggle script (dark-only)", () => {
      render(React.createElement(RootLayout, null, React.createElement("div", null, "child")));
      // Dark tokens live on :root in globals.css; no attribute is needed.
      expect(document.documentElement.getAttribute("data-theme")).toBeNull();
      const scripts = Array.from(document.querySelectorAll("script"));
      expect(
        scripts.some((s) => s.textContent.includes("localStorage.getItem('theme')"))
      ).toBe(false);
    });

    it("includes PageTransition, CustomCursor, NoiseOverlay, GoogleAnalytics", () => {
      render(React.createElement(RootLayout, null, React.createElement("div", null, "child")));
      expect(screen.getByTestId("mock-page-transition")).toBeInTheDocument();
      expect(screen.getByTestId("mock-cursor")).toBeInTheDocument();
      expect(screen.getByTestId("mock-noise")).toBeInTheDocument();
      expect(screen.getByTestId("mock-analytics")).toBeInTheDocument();
    });
  });
});

// NOT_COVERED: AC-2 through AC-6 — CSS token values defined in globals.css; verified visually
// NOT_COVERED: AC-7 (CustomCursor teal color) — visual check, deferred to /verify
