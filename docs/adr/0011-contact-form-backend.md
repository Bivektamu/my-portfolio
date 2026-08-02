# 0011 — Contact Form Backend

**Status**: Accepted
**Feature**: Contact form backend (API route + email) (Roadmap #35)
**Date**: 2026-08-02

## Summary

A Next.js API route that receives contact form submissions, validates server-side, rate limits, and sends email notifications via a transactional email service.

## Context

The contact form (feature #34) captures name, email, and message. On submit, the form data needs to be sent to the site owner. The design shows a thank-you state after successful submission and inline error messages for validation failures.

## Requirements

### AC-1: API route
A POST endpoint at `/api/contact` accepts JSON body with `{ name, email, message }`. Returns 200 on success, 400 on validation failure, 429 on rate limit.

### AC-2: Server-side validation
Name: required, 2-100 chars. Email: required, valid email format. Message: required, 10-2000 chars. Returns specific error messages for each field.

### AC-3: Email sending
On valid submission, sends an email to the site owner (bivekgurung9@gmail.com) with the form data. Uses a transactional email service.

### AC-4: Rate limiting
Maximum 3 submissions per hour from the same IP address. Returns 429 with a retry-after message.

### AC-5: Error handling
Network errors, email service failures, and unexpected errors return appropriate status codes with user-facing messages.

## Decision

Use a Next.js API route (`app/api/contact/route.js`) with the App Router route handler pattern. Email sending uses Nodemailer with a Gmail SMTP transport (since the owner email is Gmail). Rate limiting uses a simple in-memory store (Map with IP keys and timestamps) — sufficient for a personal portfolio with low traffic.

The API route validates with a simple validation function, rate-limits with an in-memory store, and sends email via Nodemailer. Environment variables store SMTP credentials (`SMTP_USER`, `SMTP_PASS`).

## Build plan

### 1. Create API route file (AC-1, AC-2)
`src/app/api/contact/route.js` with POST handler, request parsing, and validation.

### 2. Implement email sending (AC-3)
Nodemailer transport configuration and email template.

### 3. Add rate limiting (AC-4)
In-memory rate limit store with IP-based tracking.

### 4. Error handling and response formatting (AC-5)
Consistent JSON error responses with field-level messages.

### 5. Environment configuration
Add SMTP_USER and SMTP_PASS to .env.local.example. Document in README.
