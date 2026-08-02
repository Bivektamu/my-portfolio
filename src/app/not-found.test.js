// covers: AC-1 (structure — 404 page exists in code-editor aesthetic)
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import NotFound from "@/app/not-found";

describe("NotFound (404 page)", () => {
  it("renders 404 status code text", () => {
    render(React.createElement(NotFound));
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders 'Page not found' message", () => {
    render(React.createElement(NotFound));
    expect(screen.getByText(/Page not found/)).toBeInTheDocument();
  });

  it("renders a code comment prefix", () => {
    render(React.createElement(NotFound));
    expect(screen.getByText("//")).toBeInTheDocument();
  });

  it("renders a home link with terminal command style", () => {
    render(React.createElement(NotFound));
    const link = screen.getByRole("link");
    expect(link).toHaveTextContent(/\$ cd \/home/);
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders hint text about non-existent path", () => {
    render(React.createElement(NotFound));
    expect(screen.getByText(/The requested path does not exist/)).toBeInTheDocument();
  });
});
