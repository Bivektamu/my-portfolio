// covers: AC-3 (form validation states)
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import Contact from "@/components/sections/Contact";

describe("Contact", () => {
  it("renders section with id 'contact'", () => {
    render(React.createElement(Contact));
    expect(document.getElementById("contact")).toBeInTheDocument();
  });

  it("associates labels with inputs via htmlFor and id", () => {
    render(React.createElement(Contact));
    const nameLabel = screen.getByText("_name");
    const emailLabel = screen.getByText("_email");
    const messageLabel = screen.getByText("_message");

    // React maps htmlFor to the DOM "for" attribute
    expect(nameLabel).toHaveAttribute("for", "contact-name");
    expect(emailLabel).toHaveAttribute("for", "contact-email");
    expect(messageLabel).toHaveAttribute("for", "contact-message");

    expect(document.getElementById("contact-name")).toBeInTheDocument();
    expect(document.getElementById("contact-email")).toBeInTheDocument();
    expect(document.getElementById("contact-message")).toBeInTheDocument();
  });

  it("renders name, email, and message fields", () => {
    render(React.createElement(Contact));
    expect(screen.getByPlaceholderText("Your name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("your@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your message...")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(React.createElement(Contact));
    expect(screen.getByRole("button", { name: /Send Message/ })).toBeInTheDocument();
  });

  it("shows validation error when submitting empty form", async () => {
    render(React.createElement(Contact));
    const submitBtn = screen.getByRole("button", { name: /Send Message/ });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Name must be at least 2 characters/)).toBeInTheDocument();
      expect(screen.getByText(/Please enter a valid email/)).toBeInTheDocument();
      expect(screen.getByText(/Message must be at least 10 characters/)).toBeInTheDocument();
    });
  });

  it("clears error when user starts typing in invalid field", async () => {
    render(React.createElement(Contact));
    const submitBtn = screen.getByRole("button", { name: /Send Message/ });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Name must be at least 2 characters/)).toBeInTheDocument();
    });

    // Type in name field
    const nameInput = screen.getByPlaceholderText("Your name");
    fireEvent.change(nameInput, { target: { value: "Bivek" } });

    await waitFor(() => {
      expect(screen.queryByText(/Name must be at least 2 characters/)).toBeNull();
    });
  });

  it("shows invalid email error for bad email format", async () => {
    render(React.createElement(Contact));
    const emailInput = screen.getByPlaceholderText("your@email.com");
    fireEvent.change(emailInput, { target: { value: "bad-email" } });

    const submitBtn = screen.getByRole("button", { name: /Send Message/ });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email/)).toBeInTheDocument();
    });
  });

  it("shows code snippet preview panel", () => {
    render(React.createElement(Contact));
    // The code panel starts with default values
    expect(screen.getByText(/"John Doe"/)).toBeInTheDocument();
    expect(screen.getByText(/"john@example.com"/)).toBeInTheDocument();
  });

  it("updates code snippet preview as user types", async () => {
    render(React.createElement(Contact));
    const nameInput = screen.getByPlaceholderText("Your name");
    
    fireEvent.change(nameInput, { target: { value: "Bivek" } });
    
    // Code snippet should update to show the typed name
    await waitFor(() => {
      expect(screen.getByText(/"Bivek"/)).toBeInTheDocument();
    });
  });

  it("renders tabs header with contact.ts", () => {
    render(React.createElement(Contact));
    expect(screen.getByText("contact.ts")).toBeInTheDocument();
  });
});

// NOT_COVERED: server-side validation errors from API — requires fetch mock
// NOT_COVERED: success/thank-you state — requires fetch mock
