# 0011 — Contact Form Backend

**Status**: Accepted
**Feature**: Contact form backend (API route + email) (Roadmap #35)
**Date**: 2026-08-02

## Summary

A Next.js API route that receives contact form submissions, validates server-side, rate limits, and sends email via Nodemailer with Gmail SMTP: a notification to the site owner and a thank-you reply to the visitor.

## Context

The contact form (feature #34) captures name, email, and message. On submit, the form data needs to be sent to the site owner, and the visitor receives a thank-you acknowledgement. The in-app form already shows a thank-you state after successful submission, plus inline error messages for validation failures.

## Requirements

### AC-1: API route
A POST endpoint at `/api/contact` accepts JSON body with `{ name, email, message }`. Returns 200 on success, 400 on validation failure, 429 on rate limit.

### AC-2: Server-side validation
Name: required, 2-100 chars. Email: required, valid email format. Message: required, 10-2000 chars. Returns specific error messages for each field.

### AC-3: Email sending
On valid submission, sends two emails via Nodemailer with Gmail SMTP: a notification to the site owner (bivek.tamu@gmail.com) with the sender's name, email, and message, and a thank-you acknowledgement to the visitor at their submitted email address. Email sending is best-effort: if SMTP fails, the submission is logged and the request still succeeds.

### AC-4: Rate limiting
Maximum 3 submissions per hour from the same IP address. Returns 429 with a retry-after message.

### AC-5: Error handling
Unexpected request errors return 500 with a user-facing message. Email delivery failure is logged and does not fail the request (the submission still returns 200 and the in-app thank-you still shows).

## Decision

Use a Next.js API route (`app/api/contact/route.js`) with the App Router route handler pattern. Email sending uses Nodemailer with a Gmail SMTP transport (since the owner email is Gmail): one notification to the owner and one thank-you reply to the visitor, both best-effort. Rate limiting uses a simple in-memory store (Map with IP keys and timestamps) — sufficient for a personal portfolio with low traffic.

The API route validates with a simple validation function, rate-limits with an in-memory store, and sends email via Nodemailer. Environment variables store SMTP credentials: `SMTP_USER` is the admin Gmail (`bivek.tamu@gmail.com`) and `SMTP_PASS` is a Gmail app password (not the normal account password). Set both in the Netlify dashboard.

## Build plan

### 1. Create API route file (AC-1, AC-2)
`src/app/api/contact/route.js` with POST handler, request parsing, and validation.

### 2. Implement email sending (AC-3, AC-5)
Nodemailer + Gmail SMTP transport. Two sends per submission (owner notification and visitor thank-you), both best-effort and logged on failure.

### 3. Add rate limiting (AC-4)
In-memory rate limit store with IP-based tracking.

### 4. Error handling and response formatting (AC-5)
Consistent JSON error responses with field-level messages.

### 5. Environment configuration
Add SMTP_USER and SMTP_PASS to .env.local.example, document in README, and set both in the Netlify dashboard.

## Amendment (2026-08-31)

Added the visitor thank-you email to AC-3 and made email delivery best-effort so a submission is never lost when SMTP is down. Status moved to In Progress because the roadmap feature (#35) is being built; email sending had never been implemented (it only logged to the console).
