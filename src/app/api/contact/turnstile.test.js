// covers: AC-2 (siteverify call), AC-3 (accept only on success + action + hostname),
// AC-4 (reject every failure cause), AC-5 (fail open when our side is at fault)
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { verifyTurnstile } from "@/app/api/contact/turnstile";

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const originalSecret = process.env.TURNSTILE_SECRET;
const originalHostnames = process.env.TURNSTILE_HOSTNAMES;

let fetchMock;
let consoleLogSpy;
let consoleWarnSpy;
let consoleErrorSpy;

function setEnv({ secret, hostnames } = {}) {
  if (secret === undefined) delete process.env.TURNSTILE_SECRET;
  else process.env.TURNSTILE_SECRET = secret;
  if (hostnames === undefined) delete process.env.TURNSTILE_HOSTNAMES;
  else process.env.TURNSTILE_HOSTNAMES = hostnames;
}

function restoreEnv() {
  if (originalSecret === undefined) delete process.env.TURNSTILE_SECRET;
  else process.env.TURNSTILE_SECRET = originalSecret;
  if (originalHostnames === undefined) delete process.env.TURNSTILE_HOSTNAMES;
  else process.env.TURNSTILE_HOSTNAMES = originalHostnames;
}

// A stand-in for Cloudflare's answer. `ok`/`status` shape the HTTP response,
// `body` is what json() resolves to.
function siteverifyResponse(body, { ok = true, status = 200 } = {}) {
  return Promise.resolve({ ok, status, json: async () => body });
}

function sentParams(callIndex = 0) {
  const body = fetchMock.mock.calls[callIndex][1].body;
  return body instanceof URLSearchParams ? Object.fromEntries(body) : body;
}

// Every console argument stringified, so a test can assert nothing leaked.
function allLoggedText() {
  return [consoleLogSpy, consoleWarnSpy, consoleErrorSpy]
    .flatMap((spy) => spy.mock.calls)
    .flat()
    .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg) ?? ""))
    .join("\n");
}

describe("verifyTurnstile", () => {
  beforeEach(() => {
    fetchMock = vi.fn(() =>
      siteverifyResponse({ success: true, action: "contact", hostname: "bivekgurung.com" })
    );
    vi.stubGlobal("fetch", fetchMock);
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    restoreEnv();
    vi.unstubAllGlobals();
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe("the siteverify call (AC-2)", () => {
    it("posts the secret, the token and the client IP to the siteverify endpoint", async () => {
      setEnv({ secret: "test-secret", hostnames: "bivekgurung.com" });

      const result = await verifyTurnstile("token-abc", "198.51.100.9");

      expect(result.ok).toBe(true);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toBe(SITEVERIFY_URL);
      const init = fetchMock.mock.calls[0][1];
      expect(init.method).toBe("POST");
      expect(init.headers["Content-Type"]).toBe("application/x-www-form-urlencoded");
      expect(sentParams()).toEqual({
        secret: "test-secret",
        response: "token-abc",
        remoteip: "198.51.100.9",
      });
    });

    it("bounds the outbound call with an abort signal", async () => {
      setEnv({ secret: "test-secret" });

      await verifyTurnstile("token-abc", "198.51.100.9");

      expect(fetchMock.mock.calls[0][1].signal).toBeDefined();
    });

    it("AC-5 omits remoteip when the client IP is the unknown sentinel", async () => {
      // getClientIp falls back to the literal "unknown". Cloudflare answers a
      // malformed remoteip with success: false, which would 403 a real visitor.
      setEnv({ secret: "test-secret" });

      await verifyTurnstile("token-abc", "unknown");

      expect(sentParams().remoteip).toBeUndefined();
      expect(sentParams().response).toBe("token-abc");
    });

    it("AC-5 omits remoteip when the client IP is an empty string", async () => {
      setEnv({ secret: "test-secret" });

      await verifyTurnstile("token-abc", "");

      expect(sentParams().remoteip).toBeUndefined();
    });

    it("keeps the secret out of the request URL and out of the logs", async () => {
      setEnv({ secret: "super-secret-value", hostnames: "bivekgurung.com" });
      fetchMock.mockImplementation(() => siteverifyResponse({ success: false }));

      await verifyTurnstile("token-abc", "198.51.100.9");

      expect(fetchMock.mock.calls[0][0]).not.toContain("super-secret-value");
      expect(allLoggedText()).not.toContain("super-secret-value");
    });
  });

  describe("accepting a submission (AC-3)", () => {
    it("accepts when success is true, the action is contact and the hostname is allowed", async () => {
      setEnv({ secret: "test-secret", hostnames: "bivekgurung.com,www.bivekgurung.com" });

      const result = await verifyTurnstile("token-abc", "198.51.100.9");

      expect(result).toEqual({ ok: true });
    });

    it("trims the hostname allowlist and ignores empty entries", async () => {
      setEnv({ secret: "test-secret", hostnames: " bivekgurung.com , ,www.bivekgurung.com " });

      const result = await verifyTurnstile("token-abc", "198.51.100.9");

      expect(result.ok).toBe(true);
    });

    it("AC-3 skips the hostname check when TURNSTILE_HOSTNAMES is unset", async () => {
      setEnv({ secret: "test-secret" });
      fetchMock.mockImplementation(() =>
        siteverifyResponse({ success: true, action: "contact", hostname: "anything.example" })
      );

      const result = await verifyTurnstile("token-abc", "198.51.100.9");

      expect(result.ok).toBe(true);
    });

    it("AC-3 skips the hostname check when TURNSTILE_HOSTNAMES is an empty string", async () => {
      setEnv({ secret: "test-secret", hostnames: "" });
      fetchMock.mockImplementation(() =>
        siteverifyResponse({ success: true, action: "contact", hostname: "anything.example" })
      );

      const result = await verifyTurnstile("token-abc", "198.51.100.9");

      expect(result.ok).toBe(true);
    });
  });

  describe("rejecting a submission (AC-4)", () => {
    it("rejects a missing token without calling Cloudflare", async () => {
      setEnv({ secret: "test-secret" });

      const result = await verifyTurnstile(undefined, "198.51.100.9");

      expect(result).toEqual({ ok: false, reason: "invalid-token" });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("rejects a non string token without calling Cloudflare", async () => {
      setEnv({ secret: "test-secret" });

      const result = await verifyTurnstile(12345, "198.51.100.9");

      expect(result).toEqual({ ok: false, reason: "invalid-token" });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("rejects an empty token without calling Cloudflare", async () => {
      setEnv({ secret: "test-secret" });

      const result = await verifyTurnstile("", "198.51.100.9");

      expect(result).toEqual({ ok: false, reason: "invalid-token" });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("accepts a token at exactly the 2048 character boundary", async () => {
      setEnv({ secret: "test-secret" });

      const result = await verifyTurnstile("a".repeat(2048), "198.51.100.9");

      expect(result.ok).toBe(true);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("rejects a token one character past the boundary without calling Cloudflare", async () => {
      setEnv({ secret: "test-secret" });

      const result = await verifyTurnstile("a".repeat(2049), "198.51.100.9");

      expect(result).toEqual({ ok: false, reason: "invalid-token" });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("rejects when success is false and logs the Cloudflare error codes", async () => {
      setEnv({ secret: "test-secret" });
      fetchMock.mockImplementation(() =>
        siteverifyResponse({ success: false, "error-codes": ["invalid-input-response"] })
      );

      const result = await verifyTurnstile("token-abc", "198.51.100.9");

      expect(result).toEqual({ ok: false, reason: "not-successful" });
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("invalid-input-response")
      );
    });

    it("rejects when success is missing from the response", async () => {
      setEnv({ secret: "test-secret" });
      fetchMock.mockImplementation(() =>
        siteverifyResponse({ action: "contact", hostname: "bivekgurung.com" })
      );

      const result = await verifyTurnstile("token-abc", "198.51.100.9");

      expect(result).toEqual({ ok: false, reason: "not-successful" });
    });

    it("rejects when the action does not match contact", async () => {
      setEnv({ secret: "test-secret" });
      fetchMock.mockImplementation(() =>
        siteverifyResponse({ success: true, action: "login", hostname: "bivekgurung.com" })
      );

      const result = await verifyTurnstile("token-abc", "198.51.100.9");

      expect(result).toEqual({ ok: false, reason: "action-mismatch" });
    });

    it("rejects when the action is absent", async () => {
      setEnv({ secret: "test-secret" });
      fetchMock.mockImplementation(() =>
        siteverifyResponse({ success: true, hostname: "bivekgurung.com" })
      );

      const result = await verifyTurnstile("token-abc", "198.51.100.9");

      expect(result).toEqual({ ok: false, reason: "action-mismatch" });
    });

    it("rejects when the hostname is outside the allowlist", async () => {
      setEnv({ secret: "test-secret", hostnames: "bivekgurung.com,www.bivekgurung.com" });
      fetchMock.mockImplementation(() =>
        siteverifyResponse({ success: true, action: "contact", hostname: "evil.example" })
      );

      const result = await verifyTurnstile("token-abc", "198.51.100.9");

      expect(result).toEqual({ ok: false, reason: "hostname-mismatch" });
    });
  });

  describe("failing open when our side is at fault (AC-5)", () => {
    it("accepts and logs when TURNSTILE_SECRET is not set", async () => {
      setEnv({});

      const result = await verifyTurnstile("token-abc", "198.51.100.9");

      expect(result).toEqual({ ok: true, failOpen: true });
      expect(fetchMock).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("TURNSTILE_SECRET not set")
      );
    });

    it("accepts and logs when the missing secret means an absent token is also fine", async () => {
      setEnv({});

      const result = await verifyTurnstile(undefined, "198.51.100.9");

      expect(result).toEqual({ ok: true, failOpen: true });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("accepts and logs when the request throws a network error", async () => {
      setEnv({ secret: "test-secret" });
      fetchMock.mockImplementation(() => Promise.reject(new Error("network down")));

      const result = await verifyTurnstile("token-abc", "198.51.100.9");

      expect(result).toEqual({ ok: true, failOpen: true });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("fail open"),
        expect.any(Error)
      );
    });

    it("accepts and logs when the request is aborted by the timeout", async () => {
      setEnv({ secret: "test-secret" });
      fetchMock.mockImplementation(() =>
        Promise.reject(new DOMException("The operation was aborted.", "TimeoutError"))
      );

      const result = await verifyTurnstile("token-abc", "198.51.100.9");

      expect(result).toEqual({ ok: true, failOpen: true });
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it("accepts and logs when Cloudflare answers non 200", async () => {
      setEnv({ secret: "test-secret" });
      fetchMock.mockImplementation(() => siteverifyResponse({}, { ok: false, status: 502 }));

      const result = await verifyTurnstile("token-abc", "198.51.100.9");

      expect(result).toEqual({ ok: true, failOpen: true });
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("fail open"));
    });

    it("accepts and logs when the response body is not valid JSON", async () => {
      setEnv({ secret: "test-secret" });
      fetchMock.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => {
            throw new SyntaxError("Unexpected token < in JSON at position 0");
          },
        })
      );

      const result = await verifyTurnstile("token-abc", "198.51.100.9");

      expect(result).toEqual({ ok: true, failOpen: true });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("fail open"),
        expect.any(Error)
      );
    });
  });
});

// NOT_COVERED: a real Cloudflare answer needs a live widget, a live secret and
// network access, so every branch above is exercised against a stubbed fetch.
