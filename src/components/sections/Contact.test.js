// covers: form validation states, plus AC-1, AC-4, AC-6, AC-7 and AC-8 for the
// Cloudflare Turnstile bot protection (ADR 0015)
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

// Local next/script mock (same behaviour as the shared harness one) that also
// records the props, so a test can fire onReady the way next/script does when
// it finds an already loaded script during a re-mount.
const scriptProps = vi.hoisted(() => ({ calls: [] }));

vi.mock("next/script", () => ({
  default: function Script(props) {
    scriptProps.calls.push(props);
    const attach = (el) => {
      if (!el) return;
      if (props.onLoad) el.addEventListener("load", props.onLoad);
      if (props.onError) el.addEventListener("error", props.onError);
    };
    return React.createElement(
      "script",
      { id: props.id, src: props.src, ref: attach, "data-testid": "next-script" },
      props.children
    );
  },
}));

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

describe("Contact bot protection", () => {
  const originalSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const VALID_FORM = {
    name: "Bivek Gurung",
    email: "visitor@test.com",
    message: "Hello there, I would like to connect with you!",
  };

  let fetchMock;

  function mockTurnstile() {
    const renderWidget = vi.fn(() => "widget-1");
    const reset = vi.fn();
    const remove = vi.fn();
    window.turnstile = { render: renderWidget, reset, remove };
    return { renderWidget, reset, remove };
  }

  function loadScript() {
    fireEvent.load(screen.getByTestId("next-script"));
  }

  function submittedBody() {
    return JSON.parse(fetchMock.mock.calls[0][1].body);
  }

  function fillForm() {
    fireEvent.change(screen.getByPlaceholderText("Your name"), {
      target: { value: VALID_FORM.name },
    });
    fireEvent.change(screen.getByPlaceholderText("your@email.com"), {
      target: { value: VALID_FORM.email },
    });
    fireEvent.change(screen.getByPlaceholderText("Your message..."), {
      target: { value: VALID_FORM.message },
    });
  }

  function submit() {
    fireEvent.click(screen.getByRole("button", { name: /Send Message/ }));
  }

  beforeEach(() => {
    fetchMock = vi.fn(() =>
      Promise.resolve({ ok: true, status: 200, json: async () => ({ success: true }) })
    );
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    delete window.turnstile;
    vi.unstubAllGlobals();
    if (originalSiteKey === undefined) delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    else process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = originalSiteKey;
  });

  it("AC-1 renders the widget with the contact action once the script loads", () => {
    const { renderWidget } = mockTurnstile();
    render(React.createElement(Contact));

    loadScript();

    expect(renderWidget).toHaveBeenCalledTimes(1);
    const options = renderWidget.mock.calls[0][1];
    expect(options.action).toBe("contact");
    expect(typeof options.sitekey).toBe("string");
    expect(options.sitekey.length).toBeGreaterThan(0);
  });

  it("AC-1 renders the widget from onReady, so returning to the page still gets one", () => {
    const { renderWidget } = mockTurnstile();
    render(React.createElement(Contact));

    const props = scriptProps.calls.at(-1);
    expect(typeof props.onReady).toBe("function");

    props.onReady();

    expect(renderWidget).toHaveBeenCalledTimes(1);
    expect(renderWidget.mock.calls[0][1].action).toBe("contact");
  });

  it("renders only one widget when onLoad and onReady both report the script", () => {
    const { renderWidget } = mockTurnstile();
    render(React.createElement(Contact));

    loadScript();
    scriptProps.calls.at(-1).onReady();

    expect(renderWidget).toHaveBeenCalledTimes(1);
  });

  it("AC-1 sends the captured token as captchaToken beside the form fields", async () => {
    const { renderWidget } = mockTurnstile();
    render(React.createElement(Contact));
    loadScript();
    renderWidget.mock.calls[0][1].callback("token-abc");

    fillForm();
    submit();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const body = submittedBody();
    expect(body.captchaToken).toBe("token-abc");
    expect(body.name).toBe(VALID_FORM.name);
    expect(body.email).toBe(VALID_FORM.email);
    expect(body.message).toBe(VALID_FORM.message);
  });

  it("AC-6 resets the widget after a failed attempt (AC-4 shows the blocked message on 403)", async () => {
    fetchMock.mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 403,
        json: async () => ({
          error: "We could not verify your submission. Please try again.",
        }),
      })
    );
    const { renderWidget, reset } = mockTurnstile();
    render(React.createElement(Contact));
    loadScript();
    renderWidget.mock.calls[0][1].callback("spent-token");

    fillForm();
    submit();

    await waitFor(() => expect(reset).toHaveBeenCalledWith("widget-1"));
    expect(screen.getByText(/We could not verify your submission/)).toBeInTheDocument();
  });

  it("AC-4 does not fold a 500 into the blocked state", async () => {
    fetchMock.mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: async () => ({ error: "Something went wrong. Please try again." }),
      })
    );
    mockTurnstile();
    render(React.createElement(Contact));
    loadScript();

    fillForm();
    submit();

    await waitFor(() =>
      expect(screen.getByText(/Something went wrong. Please try again./)).toBeInTheDocument()
    );
    expect(screen.queryByText(/We could not verify your submission/)).toBeNull();
  });

  it("AC-6 leaves the widget alone on the success path", async () => {
    const { renderWidget, reset } = mockTurnstile();
    render(React.createElement(Contact));
    loadScript();
    renderWidget.mock.calls[0][1].callback("token-abc");

    fillForm();
    submit();

    await waitFor(() => expect(screen.getByText(/Thank You!/)).toBeInTheDocument());
    expect(reset).not.toHaveBeenCalled();
  });

  it("removes the widget when the thank you view takes its container away", async () => {
    const { renderWidget, remove } = mockTurnstile();
    render(React.createElement(Contact));
    loadScript();
    renderWidget.mock.calls[0][1].callback("token-abc");

    fillForm();
    submit();

    await waitFor(() => expect(screen.getByText(/Thank You!/)).toBeInTheDocument());
    // Regression: an orphaned widget makes Turnstile's own watcher log
    // "Cannot find Widget ..., consider using turnstile.remove()".
    expect(remove).toHaveBeenCalledWith("widget-1");
  });

  it("removes the widget when the section unmounts (a route change)", async () => {
    const { renderWidget, remove } = mockTurnstile();
    const { unmount } = render(React.createElement(Contact));
    loadScript();
    expect(renderWidget).toHaveBeenCalledTimes(1);

    unmount();

    expect(remove).toHaveBeenCalledWith("widget-1");
  });

  it("AC-7 shows the script blocked message and holds the submit when the script errors", async () => {
    render(React.createElement(Contact));

    fireEvent.error(screen.getByTestId("next-script"));

    expect(screen.getByText(/We could not load the verification widget/)).toBeInTheDocument();

    fillForm();
    submit();

    await waitFor(() =>
      expect(screen.getByText(/We could not load the verification widget/)).toBeInTheDocument()
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("AC-7 holds the submit when window.turnstile never becomes available", async () => {
    render(React.createElement(Contact));

    fillForm();
    submit();

    await waitFor(() =>
      expect(screen.getByText(/We could not load the verification widget/)).toBeInTheDocument()
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("AC-8 resets the widget when the token expires before submit", () => {
    const { renderWidget, reset } = mockTurnstile();
    render(React.createElement(Contact));
    loadScript();

    renderWidget.mock.calls[0][1]["expired-callback"]();

    expect(reset).toHaveBeenCalledWith("widget-1");
  });

  it("AC-8 does not submit a token that expired while the visitor was typing", async () => {
    const { renderWidget } = mockTurnstile();
    render(React.createElement(Contact));
    loadScript();
    renderWidget.mock.calls[0][1].callback("stale-token");

    renderWidget.mock.calls[0][1]["expired-callback"]();

    fillForm();
    submit();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(submittedBody().captchaToken).toBe("");
  });

  it("AC-4 returns to the editable form with field errors when the server rejects the fields", async () => {
    fetchMock.mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: async () => ({ errors: { email: "Please enter a valid email." } }),
      })
    );
    mockTurnstile();
    render(React.createElement(Contact));
    loadScript();

    fillForm();
    submit();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(screen.getByText(/Please enter a valid email/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send Message/ })).toBeInTheDocument();
    expect(screen.queryByText(/We could not verify your submission/)).toBeNull();
    expect(screen.queryByText(/We could not load the verification widget/)).toBeNull();
  });

  it("resets the widget and shows the generic error when the request itself fails", async () => {
    fetchMock.mockImplementation(() => Promise.reject(new Error("network down")));
    const { renderWidget, reset } = mockTurnstile();
    render(React.createElement(Contact));
    loadScript();
    renderWidget.mock.calls[0][1].callback("token-abc");

    fillForm();
    submit();

    await waitFor(() =>
      expect(screen.getByText(/Something went wrong. Please try again./)).toBeInTheDocument()
    );
    expect(reset).toHaveBeenCalledWith("widget-1");
  });

  it("disables the submit button while the request is in flight", async () => {
    let settle;
    fetchMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          settle = resolve;
        })
    );
    mockTurnstile();
    render(React.createElement(Contact));
    loadScript();

    fillForm();
    submit();

    const sending = await screen.findByRole("button", { name: /Sending/ });
    expect(sending).toBeDisabled();

    await act(async () => {
      settle({ ok: true, status: 200, json: async () => ({ success: true }) });
    });

    await waitFor(() => expect(screen.getByText(/Thank You!/)).toBeInTheDocument());
  });

  it("AC-7 announces the blocked message through an alert role", async () => {
    render(React.createElement(Contact));

    fireEvent.error(screen.getByTestId("next-script"));

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(/We could not load the verification widget/);
  });

  it("shows no blocked message while the verification script is loading normally", () => {
    mockTurnstile();
    render(React.createElement(Contact));

    expect(screen.queryByText(/We could not load the verification widget/)).toBeNull();
    expect(screen.queryByText(/We could not verify your submission/)).toBeNull();
  });
});

// NOT_COVERED: a live Turnstile challenge cannot run in jsdom (window.turnstile is mocked),
// so the real widget's token minting, its 5 minute expiry timer, and Managed mode's
// behaviour on a suspicious network are confirmed by /verify in a browser instead.
