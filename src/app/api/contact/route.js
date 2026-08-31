import { NextResponse } from "next/server";

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
    const { name, email, message } = body;

    // Server-side validation
    const errors = validate({ name, email, message });
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Log the submission without personal data (in production, send email via
    // Nodemailer or Resend)
    console.log(`[Contact] Form submission received (message length: ${message.length}).`);

    // TODO: Configure SMTP credentials and uncomment to send real emails
    // const nodemailer = await import("nodemailer");
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    // });
    // await transporter.sendMail({
    //   from: process.env.SMTP_USER,
    //   to: "bivekgurung9@gmail.com",
    //   subject: `Portfolio Contact: ${name}`,
    //   text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    // });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[Contact] Error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
