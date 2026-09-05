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

});

// NOT_COVERED: real inbox delivery stays manual because it needs a live SMTP account and inbox.
