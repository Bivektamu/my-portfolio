// covers: AC-1 (contact route renders Contact section only)
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import ContactPage, { metadata } from "@/app/contact/page";

vi.mock("@/components/sections/Contact", () => ({
  default: () => React.createElement("section", { "data-testid": "section-contact" }, "Contact"),
}));

describe("ContactPage", () => {
  it("renders Contact section only", () => {
    render(React.createElement(ContactPage));
    expect(screen.getByTestId("section-contact")).toBeInTheDocument();
  });

  it("does not render other sections", () => {
    render(React.createElement(ContactPage));
    expect(screen.queryByTestId("section-banner")).toBeNull();
    expect(screen.queryByTestId("section-about")).toBeNull();
    expect(screen.queryByTestId("section-projects")).toBeNull();
    expect(screen.queryByTestId("section-skills")).toBeNull();
  });

  it("exports metadata with title and description", () => {
    expect(metadata.title).toContain("Contact");
    expect(metadata.description).toBeTruthy();
  });
});
