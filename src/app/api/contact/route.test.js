// covers: AC-3 (form validation, server-side), AC-7 (API route exists)
import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "@/app/api/contact/route";

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
  });
});

// NOT_COVERED: actual email sending — requires SMTP credentials (Nodemailer/Resend not configured)
