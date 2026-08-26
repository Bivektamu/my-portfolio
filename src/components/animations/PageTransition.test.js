// covers: AC-2, AC-3, AC-4 (page fade transition wrapper renders children)
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import PageTransition from "@/components/animations/PageTransition";

describe("PageTransition", () => {
  it("renders children inside the transition wrapper", () => {
    render(
      React.createElement(
        PageTransition,
        null,
        React.createElement("span", null, "page-content")
      )
    );
    expect(screen.getByText("page-content")).toBeInTheDocument();
  });

  it("renders multiple child elements without dropping any", () => {
    render(
      React.createElement(
        PageTransition,
        null,
        React.createElement("span", null, "first"),
        React.createElement("span", null, "second")
      )
    );
    expect(screen.getByText("first")).toBeInTheDocument();
    expect(screen.getByText("second")).toBeInTheDocument();
  });
});

// NOT_COVERED: actual 150ms opacity fade animation — motion is mocked in unit tests;
//               the visual fade is verified in /verify
