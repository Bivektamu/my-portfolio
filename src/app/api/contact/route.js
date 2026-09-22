import { NextResponse } from "next/server";
import { verifyTurnstile } from "./turnstile";

// Simple in-memory rate limit store.
// Note: on serverless hosting this store is per instance and ephemeral, so
// the limit is a best-effort guard, not a hard production guarantee. A shared
// store (for example Upstash or Redis) would be needed for strict enforcement.
const rateLimitStore = new Map();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

// Best-effort client IP. Netlify sets the real client IP in
// x-nf-client-connection-ip on serverless functions; fall back to the first
// entry of x-forwarded-for (set by proxies, leftmost is the original client).
function getClientIp(request) {
  const netlifyIp = request.headers.get("x-nf-client-connection-ip");
  if (netlifyIp) return netlifyIp;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  return request.headers.get("x-real-ip") || "unknown";
}

function validate(data) {
  const errors = {};
  if (!data.name || typeof data.name !== "string" || data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email.";
  }
  if (!data.message || typeof data.message !== "string" || data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters.";
  }
  if (data.name && data.name.length > 100) errors.name = "Name is too long.";
  if (data.message && data.message.length > 2000) errors.message = "Message is too long.";
  return errors;
}

const OWNER_EMAIL = "bivek.tamu@gmail.com";

// Sends the two emails for a valid submission. This is best effort: when SMTP
// credentials are set, both emails go out through Gmail SMTP, and any failure
// is logged so the route can still report success. Without credentials the
// send is skipped and the submission is logged instead.
async function sendEmails({ name, email, message }) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    console.log("[Contact] SMTP credentials not set, email sending skipped.");
    return;
  }

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: smtpUser, pass: smtpPass },
      // Bound the worst case so a slow SMTP outage cannot stall the request.
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    await Promise.all([
      transporter.sendMail({
        from: `"Portfolio site" <${smtpUser}>`,
        to: OWNER_EMAIL,
        replyTo: email,
        subject: `Portfolio contact from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      }),
      transporter.sendMail({
        from: `"Bivek Gurung" <${smtpUser}>`,
        to: email,
        subject: "Thanks for reaching out",
        text: `Hi ${name},\n\nThanks for your message on my portfolio. I read every note and will get back to you as soon as I can.\n\nBest regards,\nBivek`,
      }),
    ]);

    console.log("[Contact] Notification and thank you emails sent.");
  } catch (error) {
    console.error("[Contact] Email sending failed, submission kept:", error);
  }
}

export async function POST(request) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;

    if (!rateLimitStore.has(ip)) {
      rateLimitStore.set(ip, []);
    }
    const timestamps = rateLimitStore.get(ip).filter((t) => t > windowStart);
    if (timestamps.length >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }
    timestamps.push(now);
    rateLimitStore.set(ip, timestamps);

    // Parse body
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { errors: { form: "Invalid request body." } },
        { status: 400 }
      );
    }
    const { name, email, message, captchaToken } = body;

    // Server-side validation
    const errors = validate({ name, email, message });
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Bot protection. Runs after the cheap guards so a spam burst spends its
    // rate limit before it can trigger outbound Cloudflare calls. A rejection
    // uses the { error } shape the client branches on with a 403 status.
    const verification = await verifyTurnstile(captchaToken, ip);
    if (!verification.ok) {
      return NextResponse.json(
        { error: "We could not verify your submission. Please try again." },
        { status: 403 }
      );
    }

    // Record the submission without logging personal data, then send the
    // emails. Sending is best effort, so this never changes the response.
    console.log(`[Contact] Form submission received (message length: ${message.length}).`);
    await sendEmails({ name: name.trim(), email: email.trim(), message: message.trim() });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[Contact] Error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
