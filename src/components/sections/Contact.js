"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import Script from "next/script";
import { motion } from "motion/react";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import styles from "./Contact.module.css";

const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

// Public site key for the widget that already exists in the Cloudflare account.
// Read lazily so tests can stub the variable after import (mirrors the GA
// measurement ID pattern in GoogleAnalytics.js).
const FALLBACK_TURNSTILE_SITE_KEY = "0x4AAAAAAE-1qMMz6WJgOOy_";

function turnstileSiteKey() {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || FALLBACK_TURNSTILE_SITE_KEY;
}

const SCRIPT_BLOCKED_MESSAGE =
  "We could not load the verification widget. Please allow challenges.cloudflare.com in your browser (an ad blocker may be blocking it) and try again.";
const SERVER_BLOCKED_MESSAGE =
  "We could not verify your submission. Please try again.";

function validateForm(data) {
  const errors = {};
  // Trim first so client validation matches the server (which trims).
  const name = (data.name || "").trim();
  const email = (data.email || "").trim();
  const message = (data.message || "").trim();
  if (!name || name.length < 2) errors.name = "Name must be at least 2 characters.";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Please enter a valid email.";
  if (!message || message.length < 10)
    errors.message = "Message must be at least 10 characters.";
  return errors;
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  // idle | submitting | success | error | blocked
  const [status, setStatus] = useState("idle");
  // "server" (the token was rejected) | "script" (the widget never loaded)
  const [blockedReason, setBlockedReason] = useState(null);
  // loading | ready | blocked
  const [scriptState, setScriptState] = useState("loading");

  const widgetContainerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const tokenRef = useRef("");

  // A token is single use and expires after 5 minutes, so the widget is reset
  // after every attempt and on expiry, which mints the next attempt a fresh
  // token. Without it a retry would always carry a spent token.
  const resetWidget = useCallback(() => {
    tokenRef.current = "";
    if (typeof window === "undefined" || !window.turnstile || widgetIdRef.current === null) {
      return;
    }
    try {
      window.turnstile.reset(widgetIdRef.current);
    } catch {
      // A widget that is no longer mounted cannot be reset. The success path
      // replaces the whole form, so there is nothing to recover here.
    }
  }, []);

  // Turnstile keeps every rendered widget in an internal map and runs a
  // watcher over it. When the widget's container leaves the DOM without
  // turnstile.remove(), that watcher logs "Cannot find Widget ..., consider
  // using turnstile.remove() to clean up a widget." So the widget is removed
  // exactly when its container goes away (the success view, or leaving the
  // route), which is distinct from reset, used while the container stays put.
  const removeWidget = useCallback(() => {
    tokenRef.current = "";
    const id = widgetIdRef.current;
    widgetIdRef.current = null;
    if (typeof window === "undefined" || !window.turnstile || id === null) return;
    try {
      window.turnstile.remove(id);
    } catch {
      // The widget was already gone. There is nothing left to clean up.
    }
  }, []);

  // The thank you view replaces the form, taking the widget container with it.
  useEffect(() => {
    if (status === "success") removeWidget();
  }, [status, removeWidget]);

  // Unmounting (a route change away from /contact) takes the container away too.
  useEffect(() => removeWidget, [removeWidget]);

  const handleScriptLoad = useCallback(() => {
    if (typeof window === "undefined" || !window.turnstile || !widgetContainerRef.current) {
      setScriptState("blocked");
      return;
    }
    if (widgetIdRef.current !== null) return;
    try {
      widgetIdRef.current = window.turnstile.render(widgetContainerRef.current, {
        sitekey: turnstileSiteKey(),
        action: "contact",
        callback: (token) => {
          tokenRef.current = token;
        },
        "expired-callback": () => {
          // The token went stale while the visitor was still typing. Replace it
          // before submit so a slow visitor is not rejected for a stale token.
          resetWidget();
        },
        "error-callback": () => {
          tokenRef.current = "";
        },
      });
      setScriptState("ready");
    } catch {
      setScriptState("blocked");
    }
  }, [resetWidget]);

  const handleScriptError = useCallback(() => {
    setScriptState("blocked");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const validationErrors = validateForm(form);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      // The verification script never arrived (an ad blocker or a network
      // filter blocked it). Hold the submit instead of sending a request the
      // server would reject with 403.
      if (scriptState !== "ready" || typeof window === "undefined" || !window.turnstile) {
        setStatus("blocked");
        setBlockedReason("script");
        return;
      }

      setStatus("submitting");
      setBlockedReason(null);
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, captchaToken: tokenRef.current || "" }),
        });

        // Branch on the status explicitly. The route returns the { error }
        // shape for 403, 429 and 500 alike, so the mere presence of an error
        // field cannot tell a rejected token apart from a server failure.
        if (res.status === 403) {
          resetWidget();
          setStatus("blocked");
          setBlockedReason("server");
          return;
        }

        if (!res.ok) {
          resetWidget();
          const data = await res.json().catch(() => ({}));
          if (data.errors) {
            setErrors(data.errors);
            setStatus("idle");
          } else {
            setStatus("error");
          }
          return;
        }

        // Success: the thank you view replaces the form, so the widget's
        // container goes with it. The effect below removes the widget then.
        setStatus("success");
      } catch {
        resetWidget();
        setStatus("error");
      }
    },
    [form, scriptState, resetWidget]
  );

  // Generate code snippet preview from form data (memoized to avoid re-renders)
  const codeSnippet = useMemo(
    () => `const message = {
  name: "${form.name || "John Doe"}",
  email: "${form.email || "john@example.com"}",
  message: "${form.message || "Hello, I'd like to connect!"}",
};`,
    [form.name, form.email, form.message]
  );

  const blockedMessage =
    scriptState === "blocked" || blockedReason === "script"
      ? SCRIPT_BLOCKED_MESSAGE
      : status === "blocked"
        ? SERVER_BLOCKED_MESSAGE
        : null;

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.foreground}>
        <div className={styles.tabs}>
          <div className={styles.tab}>
            <span>contact.ts</span>
          </div>
        </div>

        <div className={styles.panels}>
          {/* Form panel */}
          <div className={styles.formPanel}>
            {status === "success" ? (
              <motion.div
                className={styles.thankYou}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className={styles.thankYouTitle}>Thank You!</h2>
                <p className={styles.thankYouText}>
                  Your message has been accepted. You will receive an answer very soon.
                </p>
              </motion.div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={`${styles.field} ${errors.name ? styles.fieldError : ""}`}>
                  <label className={styles.label} htmlFor="contact-name">_name</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Your name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                  />
                  {errors.name && (
                    <span id="contact-name-error" role="alert" className={styles.errorMsg}>
                      <span className={styles.errorIcon}>!</span>
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className={`${styles.field} ${errors.email ? styles.fieldError : ""}`}>
                  <label className={styles.label} htmlFor="contact-email">_email</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="your@email.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                  />
                  {errors.email && (
                    <span id="contact-email-error" role="alert" className={styles.errorMsg}>
                      <span className={styles.errorIcon}>!</span>
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className={`${styles.field} ${errors.message ? styles.fieldError : ""}`}>
                  <label className={styles.label} htmlFor="contact-message">_message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    className={styles.textarea}
                    placeholder="Your message..."
                    rows={5}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                  />
                  {errors.message && (
                    <span id="contact-message-error" role="alert" className={styles.errorMsg}>
                      <span className={styles.errorIcon}>!</span>
                      {errors.message}
                    </span>
                  )}
                </div>

                {status === "error" && (
                  <p role="alert" className={styles.errorMsg}>
                    Something went wrong. Please try again.
                  </p>
                )}

                {blockedMessage && (
                  <p role="alert" className={styles.errorMsg}>
                    <span className={styles.errorIcon}>!</span>
                    {blockedMessage}
                  </p>
                )}

                {/* Cloudflare Turnstile container. The widget is rendered into
                    this node explicitly once the script reports it has loaded. */}
                <div
                  ref={widgetContainerRef}
                  className={styles.turnstile}
                  data-action="contact"
                />

                <Script
                  id="cloudflare-turnstile"
                  src={TURNSTILE_SCRIPT_SRC}
                  strategy="afterInteractive"
                  // onLoad fires the first time the script loads. A client side
                  // navigation back to this page re-mounts the component while
                  // next/script finds the script already loaded, so it fires
                  // onReady instead. Both handlers render the widget, and the
                  // widget id guard keeps that idempotent.
                  onLoad={handleScriptLoad}
                  onReady={handleScriptLoad}
                  onError={handleScriptError}
                />

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* Code snippet panel */}
          <div className={styles.codePanel}>
            <div className={styles.codePanelHeader}>
              <span className={styles.codePanelLabel}>{"// message.ts"}</span>
            </div>
            <pre className={styles.codePreview}>{codeSnippet}</pre>
          </div>
        </div>

    
      </div>
    </section>
  );
}
