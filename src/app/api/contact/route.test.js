// covers: AC-3 (form validation, server-side), AC-7 (API route exists)
import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "@/app/api/contact/route";

const emailMocks = vi.hoisted(() => ({
  createTransport: vi.fn(),
  sendMail: vi.fn(),
}));

vi.mock("nodemailer", () => ({
  createTransport: emailMocks.createTransport,
}));


let ipCounter = 0;
function uniqueIP() {
  return "192.168.1." + (++ipCounter);
}

function createRequest(body, headers = {}) {
  return {
    headers: new Map(Object.entries(headers)),
    json: async () => body,
  };
}

describe("Contact API route (POST /api/contact)", () => {
  describe("Validation", () => {
    it("returns 400 with errors when name is empty", async () => {
      const req = createRequest(
        { name: "", email: "test@test.com", message: "Hello there, this is a message." },
        { "x-forwarded-for": uniqueIP() }
      );
      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.errors.name).toBeDefined();
    });

    it("returns 400 with errors when name is too short", async () => {
      const req = createRequest(
        { name: "A", email: "test@test.com", message: "Hello there, this is a message." },
        { "x-forwarded-for": uniqueIP() }
      );
      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.errors.name).toBe("Name must be at least 2 characters.");
    });

    it("returns 400 with errors when email is invalid", async () => {
      const req = createRequest(
        { name: "Test", email: "not-an-email", message: "Hello there, this is a message." },
        { "x-forwarded-for": uniqueIP() }
      );
      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.errors.email).toBe("Please enter a valid email.");
    });

    it("returns 400 with errors when email is empty", async () => {
      const req = createRequest(
        { name: "Test", email: "", message: "Hello there, this is a message." },
        { "x-forwarded-for": uniqueIP() }
      );
      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.errors.email).toBeDefined();
    });

    it("returns 400 with errors when message is too short", async () => {
      const req = createRequest(
        { name: "Test", email: "test@test.com", message: "Hi" },
        { "x-forwarded-for": uniqueIP() }
      );
      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.errors.message).toBe("Message must be at least 10 characters.");
    });

    it("returns 400 with errors when message is empty", async () => {
      const req = createRequest(
        { name: "Test", email: "test@test.com", message: "" },
        { "x-forwarded-for": uniqueIP() }
      );
      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.errors.message).toBeDefined();
    });

    it("returns 400 when name exceeds 100 characters", async () => {
      const req = createRequest(
        {
          name: "A".repeat(101),
          email: "test@test.com",
          message: "Hello there, this is a valid message.",
        },
        { "x-forwarded-for": uniqueIP() }
      );
      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.errors.name).toBe("Name is too long.");
    });

    it("returns 400 when message exceeds 2000 characters", async () => {
      const req = createRequest(
        {
          name: "Test",
          email: "test@test.com",
          message: "A".repeat(2001),
        },
        { "x-forwarded-for": uniqueIP() }
      );
      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.errors.message).toBe("Message is too long.");
    });
  });

  describe("Success", () => {
    it("returns 200 with success:true on valid submission", async () => {
      const req = createRequest(
        { name: "Bivek", email: "bivek@test.com", message: "Hello, I would like to connect with you!" },
        { "x-forwarded-for": uniqueIP() }
      );
      const res = await POST(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });

    it("accepts name at exactly 2 characters", async () => {
      const req = createRequest(
        { name: "AB", email: "ab@test.com", message: "Just saying hello there!" },
        { "x-forwarded-for": uniqueIP() }
      );
      const res = await POST(req);
      expect(res.status).toBe(200);
    });

    it("accepts message at exactly 10 characters", async () => {
      const req = createRequest(
        { name: "Test", email: "t@test.com", message: "1234567890" },
        { "x-forwarded-for": uniqueIP() }
      );
      const res = await POST(req);
      expect(res.status).toBe(200);
    });
  });

  describe("Rate limiting", () => {
    it("returns 429 after exceeding rate limit for same IP", async () => {
      const ip = uniqueIP();
      // Send 3 requests (the limit)
      for (let i = 0; i < 3; i++) {
        const req = createRequest(
          { name: "Test", email: "t@t.com", message: "Message number " + (i + 1) + " here." },
          { "x-forwarded-for": ip }
        );
        const res = await POST(req);
        expect(res.status).toBe(200);
      }
      // 4th request should be rate limited
      const req = createRequest(
        { name: "Test", email: "t@t.com", message: "This should be rate limited now." },
        { "x-forwarded-for": ip }
      );
      const res = await POST(req);
      expect(res.status).toBe(429);
      const data = await res.json();
      expect(data.error).toContain("Too many submissions");
    });
  });

  describe("Error handling", () => {
    it("returns 500 when request body is not valid JSON", async () => {
      const badReq = {
        headers: new Map([["x-forwarded-for", uniqueIP()]]),
        json: async () => { throw new Error("Invalid JSON"); },
      };
      const res = await POST(badReq);
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.error).toBeDefined();
    });

    it("returns 400 instead of 500 when the JSON body is null", async () => {
      const req = createRequest(null, { "x-forwarded-for": uniqueIP() });
      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.errors.form).toBeDefined();
    });

    it("returns 400 when the JSON body is an array", async () => {
      const req = createRequest(["not", "an", "object"], { "x-forwarded-for": uniqueIP() });
      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.errors.form).toBeDefined();
    });
  });

  describe("Client IP detection", () => {
    it("prefers x-nf-client-connection-ip over x-forwarded-for", async () => {
      // 3 requests from the same Netlify client IP must hit the limit.
      for (let i = 0; i < 3; i++) {
        const req = createRequest(
          { name: "Test", email: "t@t.com", message: "Message number " + (i + 1) + " here." },
          { "x-nf-client-connection-ip": "203.0.113.7", "x-forwarded-for": "10.0.0.1" }
        );
        const res = await POST(req);
        expect(res.status).toBe(200);
      }
      const req = createRequest(
        { name: "Test", email: "t@t.com", message: "This should be rate limited now." },
        { "x-nf-client-connection-ip": "203.0.113.7", "x-forwarded-for": "10.0.0.1" }
      );
      const res = await POST(req);
      expect(res.status).toBe(429);
    });

    it("uses the first IP of a comma separated x-forwarded-for list", async () => {
      for (let i = 0; i < 3; i++) {
        const req = createRequest(
          { name: "Test", email: "t@t.com", message: "Message number " + (i + 1) + " here." },
          { "x-forwarded-for": "198.51.100.4, 10.0.0.2, 10.0.0.3" }
        );
        const res = await POST(req);
        expect(res.status).toBe(200);
      }
      const req = createRequest(
        { name: "Test", email: "t@t.com", message: "This should be rate limited now." },
        { "x-forwarded-for": "198.51.100.4, 10.0.0.2" }
      );
      const res = await POST(req);
      expect(res.status).toBe(429);
    });
  });
  describe("Email sending (AC-3, AC-5)", () => {
    const OWNER_EMAIL = "bivek.tamu@gmail.com";

    const originalSmtpUser = process.env.SMTP_USER;
    const originalSmtpPass = process.env.SMTP_PASS;

    let consoleLogSpy;
    let consoleErrorSpy;

    function setSmtpEnv(user, pass) {
      if (user === undefined) delete process.env.SMTP_USER;
      else process.env.SMTP_USER = user;
      if (pass === undefined) delete process.env.SMTP_PASS;
      else process.env.SMTP_PASS = pass;
    }

    function restoreSmtpEnv() {
      if (originalSmtpUser === undefined) delete process.env.SMTP_USER;
      else process.env.SMTP_USER = originalSmtpUser;
      if (originalSmtpPass === undefined) delete process.env.SMTP_PASS;
      else process.env.SMTP_PASS = originalSmtpPass;
    }

    beforeEach(() => {
      emailMocks.createTransport.mockReset();
      emailMocks.sendMail.mockReset();
      emailMocks.createTransport.mockReturnValue({ sendMail: emailMocks.sendMail });
      emailMocks.sendMail.mockResolvedValue({ messageId: "mock-message-id" });
    });

    afterEach(() => {
      restoreSmtpEnv();
      if (consoleLogSpy) consoleLogSpy.mockRestore();
      if (consoleErrorSpy) consoleErrorSpy.mockRestore();
    });

    it("AC-3 sends owner and visitor emails when SMTP is configured", async () => {
      setSmtpEnv("owner@gmail.com", "app-password");

      const req = createRequest(
        { name: "Bivek", email: "visitor@test.com", message: "Hello there, I would like to connect!" },
        { "x-forwarded-for": uniqueIP() }
      );

      const res = await POST(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);

      expect(emailMocks.createTransport).toHaveBeenCalledTimes(1);
      expect(emailMocks.sendMail).toHaveBeenCalledTimes(2);

      const ownerCall = emailMocks.sendMail.mock.calls[0][0];
      const visitorCall = emailMocks.sendMail.mock.calls[1][0];

      expect(ownerCall.to).toBe(OWNER_EMAIL);
      expect(ownerCall.replyTo).toBe("visitor@test.com");
      expect(ownerCall.text).toContain("Bivek");
      expect(ownerCall.text).toContain("visitor@test.com");
      expect(ownerCall.text).toContain("Hello there, I would like to connect!");

      expect(visitorCall.to).toBe("visitor@test.com");
      expect(visitorCall.subject).toBe("Thanks for reaching out");
    });

    it("AC-3 trims submitted values before building both emails", async () => {
      setSmtpEnv("owner@gmail.com", "app-password");

      const req = createRequest(
        { name: "  Bivek  ", email: "visitor@test.com", message: "   Hello there, this is my message.   " },
        { "x-forwarded-for": uniqueIP() }
      );

      const res = await POST(req);
      expect(res.status).toBe(200);

      const ownerCall = emailMocks.sendMail.mock.calls[0][0];
      const visitorCall = emailMocks.sendMail.mock.calls[1][0];

      expect(ownerCall.subject).toBe("Portfolio contact from Bivek");
      expect(ownerCall.text).toContain("Name: Bivek\n");
      expect(ownerCall.text).toContain("Email: visitor@test.com\n");
      expect(ownerCall.text).toContain("Hello there, this is my message.");
      expect(ownerCall.text).not.toContain("  Bivek");
      expect(ownerCall.text).not.toContain("   Hello");

      expect(visitorCall.to).toBe("visitor@test.com");
      expect(visitorCall.text).toContain("Hi Bivek,");
    });

    it("AC-5 still returns 200 when the SMTP transport rejects", async () => {
      setSmtpEnv("owner@gmail.com", "app-password");

      const smtpError = new Error("SMTP server unavailable");
      emailMocks.sendMail.mockRejectedValue(smtpError);
      consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const req = createRequest(
        { name: "Bivek", email: "visitor@test.com", message: "Hello there, this is a valid message." },
        { "x-forwarded-for": uniqueIP() }
      );

      const res = await POST(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy.mock.calls[0][0]).toContain("Email sending failed");
    });

    it("AC-5 skips sending and logs when SMTP credentials are absent", async () => {
      setSmtpEnv("owner@gmail.com", undefined);

      consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const req = createRequest(
        { name: "Bivek", email: "visitor@test.com", message: "Hello there, this is a valid message." },
        { "x-forwarded-for": uniqueIP() }
      );

      const res = await POST(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);

      expect(emailMocks.createTransport).not.toHaveBeenCalled();
      expect(emailMocks.sendMail).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        "[Contact] SMTP credentials not set, email sending skipped."
      );
    });
  });

  describe("Bot protection (AC-2, AC-3, AC-4, AC-5)", () => {
    const originalSecret = process.env.TURNSTILE_SECRET;
    const originalHostnames = process.env.TURNSTILE_HOSTNAMES;

    const VALID_BODY = {
      name: "Bivek",
      email: "bivek@test.com",
      message: "Hello, I would like to connect with you!",
    };

    let fetchMock;
    let consoleWarnSpy;
    let consoleErrorSpy;
    let consoleLogSpy;

    function setTurnstileEnv({ secret, hostnames } = {}) {
      if (secret === undefined) delete process.env.TURNSTILE_SECRET;
      else process.env.TURNSTILE_SECRET = secret;
      if (hostnames === undefined) delete process.env.TURNSTILE_HOSTNAMES;
      else process.env.TURNSTILE_HOSTNAMES = hostnames;
    }

    function restoreTurnstileEnv() {
      if (originalSecret === undefined) delete process.env.TURNSTILE_SECRET;
      else process.env.TURNSTILE_SECRET = originalSecret;
      if (originalHostnames === undefined) delete process.env.TURNSTILE_HOSTNAMES;
      else process.env.TURNSTILE_HOSTNAMES = originalHostnames;
    }

    function siteverifyResponse(body, { ok = true, status = 200 } = {}) {
      return Promise.resolve({ ok, status, json: async () => body });
    }

    function siteverifyParams(callIndex = 0) {
      const body = fetchMock.mock.calls[callIndex][1].body;
      return body instanceof URLSearchParams ? Object.fromEntries(body) : body;
    }

    function submitWithToken(token, ips = uniqueIP()) {
      const body = token === undefined ? { ...VALID_BODY } : { ...VALID_BODY, captchaToken: token };
      return createRequest(body, { "x-forwarded-for": ips });
    }

    beforeEach(() => {
      fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);
      consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
      restoreTurnstileEnv();
      vi.unstubAllGlobals();
      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
      consoleLogSpy.mockRestore();
    });

    it("AC-2, AC-3 accepts a passing token and calls siteverify with the secret, token and IP", async () => {
      setTurnstileEnv({ secret: "test-secret", hostnames: "bivekgurung.com,www.bivekgurung.com" });
      fetchMock.mockImplementation(() =>
        siteverifyResponse({ success: true, action: "contact", hostname: "bivekgurung.com" })
      );

      const ip = uniqueIP();
      const res = await POST(submitWithToken("token-abc", ip));

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toBe(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify"
      );
      expect(fetchMock.mock.calls[0][1].method).toBe("POST");
      const params = siteverifyParams();
      expect(params.secret).toBe("test-secret");
      expect(params.response).toBe("token-abc");
      expect(params.remoteip).toBe(ip);
    });

    it("AC-4 rejects with 403 and the { error } shape when the token is missing", async () => {
      setTurnstileEnv({ secret: "test-secret" });

      const res = await POST(submitWithToken(undefined));

      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toBeDefined();
      expect(data.errors).toBeUndefined();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("AC-4 rejects an oversized token without calling Cloudflare", async () => {
      setTurnstileEnv({ secret: "test-secret" });

      const res = await POST(submitWithToken("a".repeat(2049)));

      expect(res.status).toBe(403);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("AC-4 rejects when success is false and logs the Cloudflare error codes", async () => {
      setTurnstileEnv({ secret: "test-secret" });
      fetchMock.mockImplementation(() =>
        siteverifyResponse({ success: false, "error-codes": ["invalid-input-response"] })
      );

      const res = await POST(submitWithToken("token-abc"));

      expect(res.status).toBe(403);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("invalid-input-response")
      );
    });

    it("AC-4 rejects when the action does not match", async () => {
      setTurnstileEnv({ secret: "test-secret" });
      fetchMock.mockImplementation(() =>
        siteverifyResponse({ success: true, action: "login", hostname: "bivekgurung.com" })
      );

      const res = await POST(submitWithToken("token-abc"));

      expect(res.status).toBe(403);
      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("unexpected action"));
    });

    it("AC-4 rejects when the hostname is outside the allowlist", async () => {
      setTurnstileEnv({ secret: "test-secret", hostnames: "bivekgurung.com" });
      fetchMock.mockImplementation(() =>
        siteverifyResponse({ success: true, action: "contact", hostname: "evil.example" })
      );

      const res = await POST(submitWithToken("token-abc"));

      expect(res.status).toBe(403);
    });

    it("AC-3 skips the hostname check when TURNSTILE_HOSTNAMES is unset", async () => {
      setTurnstileEnv({ secret: "test-secret" });
      fetchMock.mockImplementation(() =>
        siteverifyResponse({ success: true, action: "contact", hostname: "anything.example" })
      );

      const res = await POST(submitWithToken("token-abc"));

      expect(res.status).toBe(200);
    });

    it("AC-5 accepts and logs when TURNSTILE_SECRET is missing", async () => {
      setTurnstileEnv({});

      const res = await POST(submitWithToken(undefined));

      expect(res.status).toBe(200);
      expect(fetchMock).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("TURNSTILE_SECRET not set")
      );
    });

    it("AC-5 accepts and logs when the siteverify request fails", async () => {
      setTurnstileEnv({ secret: "test-secret" });
      fetchMock.mockImplementation(() => Promise.reject(new Error("network down")));

      const res = await POST(submitWithToken("token-abc"));

      expect(res.status).toBe(200);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("fail open"),
        expect.anything()
      );
    });

    it("AC-5 accepts and logs when siteverify times out", async () => {
      setTurnstileEnv({ secret: "test-secret" });
      fetchMock.mockImplementation(() =>
        Promise.reject(new DOMException("The operation was aborted.", "TimeoutError"))
      );

      const res = await POST(submitWithToken("token-abc"));

      expect(res.status).toBe(200);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it("AC-5 accepts and logs when siteverify answers non 200", async () => {
      setTurnstileEnv({ secret: "test-secret" });
      fetchMock.mockImplementation(() => siteverifyResponse({}, { ok: false, status: 502 }));

      const res = await POST(submitWithToken("token-abc"));

      expect(res.status).toBe(200);
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("fail open"));
    });

    it("AC-5 omits remoteip when no client IP header is present", async () => {
      setTurnstileEnv({ secret: "test-secret" });
      fetchMock.mockImplementation(() =>
        siteverifyResponse({ success: true, action: "contact", hostname: "bivekgurung.com" })
      );

      const res = await POST(createRequest({ ...VALID_BODY, captchaToken: "token-abc" }));

      expect(res.status).toBe(200);
      const params = siteverifyParams();
      expect(params.remoteip).toBeUndefined();
      expect(params.response).toBe("token-abc");
    });

    it("AC-2 falls back to x-real-ip when it is the only IP header", async () => {
      setTurnstileEnv({ secret: "test-secret" });
      fetchMock.mockImplementation(() =>
        siteverifyResponse({ success: true, action: "contact", hostname: "bivekgurung.com" })
      );

      const res = await POST(
        createRequest({ ...VALID_BODY, captchaToken: "token-abc" }, { "x-real-ip": "203.0.113.42" })
      );

      expect(res.status).toBe(200);
      expect(siteverifyParams().remoteip).toBe("203.0.113.42");
    });

    it("AC-2 runs the cheap guards first: a validation failure never calls siteverify", async () => {
      setTurnstileEnv({ secret: "test-secret" });
      fetchMock.mockImplementation(() =>
        siteverifyResponse({ success: true, action: "contact", hostname: "bivekgurung.com" })
      );

      const res = await POST(
        createRequest(
          { name: "A", email: "not-an-email", message: "short", captchaToken: "token-abc" },
          { "x-forwarded-for": uniqueIP() }
        )
      );

      expect(res.status).toBe(400);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("AC-2 runs the cheap guards first: a rate limited request never calls siteverify", async () => {
      setTurnstileEnv({ secret: "test-secret" });
      fetchMock.mockImplementation(() =>
        siteverifyResponse({ success: true, action: "contact", hostname: "bivekgurung.com" })
      );

      const ip = uniqueIP();
      for (let i = 0; i < 3; i++) {
        const res = await POST(submitWithToken("token-" + i, ip));
        expect(res.status).toBe(200);
      }

      const limited = await POST(submitWithToken("token-4", ip));

      expect(limited.status).toBe(429);
      // Three siteverify calls for the three accepted slots, none for the 429.
      expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it("AC-4 keeps the Cloudflare error codes and the secret out of the response body", async () => {
      setTurnstileEnv({ secret: "super-secret-value" });
      fetchMock.mockImplementation(() =>
        siteverifyResponse({
          success: false,
          hostname: "bivekgurung.com",
          "error-codes": ["invalid-input-response"],
        })
      );

      const res = await POST(submitWithToken("token-abc"));

      expect(res.status).toBe(403);
      const raw = JSON.stringify(await res.json());
      expect(raw).toContain("We could not verify your submission");
      expect(raw).not.toContain("invalid-input-response");
      expect(raw).not.toContain("super-secret-value");
      expect(raw).not.toContain("siteverify");
    });

    it("AC-4 a rejected submission is never emailed to the owner", async () => {
      const originalUser = process.env.SMTP_USER;
      const originalPass = process.env.SMTP_PASS;
      process.env.SMTP_USER = "owner@gmail.com";
      process.env.SMTP_PASS = "app-password";
      emailMocks.createTransport.mockClear();
      emailMocks.sendMail.mockClear();
      emailMocks.createTransport.mockReturnValue({ sendMail: emailMocks.sendMail });

      try {
        setTurnstileEnv({ secret: "test-secret" });
        fetchMock.mockImplementation(() => siteverifyResponse({ success: false }));

        const res = await POST(submitWithToken("token-abc"));

        expect(res.status).toBe(403);
        // The transport is built inside sendEmails, so an untouched mock proves
        // the rejection returned before any email work started.
        expect(emailMocks.createTransport).not.toHaveBeenCalled();
        expect(emailMocks.sendMail).not.toHaveBeenCalled();
      } finally {
        if (originalUser === undefined) delete process.env.SMTP_USER;
        else process.env.SMTP_USER = originalUser;
        if (originalPass === undefined) delete process.env.SMTP_PASS;
        else process.env.SMTP_PASS = originalPass;
      }
    });
  });

});

// NOT_COVERED: real inbox delivery stays manual because it needs a live SMTP account and inbox.
// NOT_COVERED: a real Turnstile token cannot be minted without a browser and a live widget,
// so the live Cloudflare answer is confirmed by /verify instead.
// Turnstile branch coverage for the helper itself lives in src/app/api/contact/turnstile.test.js.
