// Cloudflare Turnstile verification for the contact form (ADR 0015).
//
// This is the load bearing server verdict: a submission is accepted only when
// siteverify reports success, an action of "contact" and a hostname in the
// configured allowlist. Everything that points at OUR side being broken (a
// missing secret, a network error, a timeout, a non 200 reply) fails OPEN and
// accepts, so a real visitor is never blocked by our own problem. Only
// Cloudflare answering "no" fails closed.

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Bounded so the combined worst case (siteverify plus SMTP) stays inside the
// hosting function budget. siteverify normally answers well under a second.
const TIMEOUT_MS = 2500;

// A real token is far shorter than this. The bound stops an oversized body
// from being forwarded to Cloudflare.
const MAX_TOKEN_LENGTH = 2048;

function siteverifyTimeoutSignal(ms) {
  if (
    typeof AbortSignal !== "undefined" &&
    typeof AbortSignal.timeout === "function"
  ) {
    return AbortSignal.timeout(ms);
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  timer.unref?.();
  return controller.signal;
}

function allowedHostnames() {
  return (process.env.TURNSTILE_HOSTNAMES || "")
    .split(",")
    .map((hostname) => hostname.trim())
    .filter(Boolean);
}

/**
 * Verify a Turnstile token against Cloudflare's siteverify endpoint.
 *
 * @param {unknown} token the token captured by the widget (captchaToken)
 * @param {string} clientIp best effort client IP from getClientIp
 * @returns {Promise<{ ok: boolean, failOpen?: boolean, reason?: string }>}
 *   `ok: true` means accept; `failOpen: true` marks the accepts we granted
 *   because our own configuration or Cloudflare was at fault.
 */
export async function verifyTurnstile(token, clientIp) {
  const secret = process.env.TURNSTILE_SECRET;

  if (!secret) {
    console.log(
      "[Turnstile] TURNSTILE_SECRET not set, verification skipped (fail open)."
    );
    return { ok: true, failOpen: true };
  }

  if (
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > MAX_TOKEN_LENGTH
  ) {
    console.warn("[Turnstile] Submission rejected: missing or oversized token.");
    return { ok: false, reason: "invalid-token" };
  }

  const params = new URLSearchParams();
  params.append("secret", secret);
  params.append("response", token);
  // Send remoteip only when a real IP was found. getClientIp falls back to the
  // literal "unknown", and Cloudflare answers a malformed remoteip with
  // success: false, which would 403 a real visitor (AC-5).
  if (clientIp && clientIp !== "unknown") {
    params.append("remoteip", clientIp);
  }

  let data;
  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
      signal: siteverifyTimeoutSignal(TIMEOUT_MS),
    });

    if (!res.ok) {
      console.error(
        `[Turnstile] siteverify returned ${res.status}, accepting submission (fail open).`
      );
      return { ok: true, failOpen: true };
    }

    data = await res.json();
  } catch (error) {
    console.error(
      "[Turnstile] siteverify request failed, accepting submission (fail open):",
      error
    );
    return { ok: true, failOpen: true };
  }

  if (data?.success !== true) {
    const errorCodes = JSON.stringify(data?.["error-codes"] || []);
    console.warn(
      `[Turnstile] Submission rejected: success was not true (error-codes: ${errorCodes}).`
    );
    return { ok: false, reason: "not-successful" };
  }

  if (data.action !== "contact") {
    console.warn(
      `[Turnstile] Submission rejected: unexpected action "${data.action}".`
    );
    return { ok: false, reason: "action-mismatch" };
  }

  const hostnames = allowedHostnames();
  if (hostnames.length > 0 && !hostnames.includes(data.hostname)) {
    console.warn(
      `[Turnstile] Submission rejected: hostname "${data.hostname}" is not in the allowlist.`
    );
    return { ok: false, reason: "hostname-mismatch" };
  }

  return { ok: true };
}
