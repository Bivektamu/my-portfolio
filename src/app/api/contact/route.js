import { NextResponse } from "next/server";

// Simple in-memory rate limit store
const rateLimitStore = new Map();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

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
    const ip = request.headers.get("x-forwarded-for") || "unknown";
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
    const { name, email, message } = body;

    // Server-side validation
    const errors = validate({ name, email, message });
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Log the submission (in production, send email via Nodemailer or Resend)
    console.log(`[Contact] Name: ${name}, Email: ${email}, Message: ${message.substring(0, 100)}...`);

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
