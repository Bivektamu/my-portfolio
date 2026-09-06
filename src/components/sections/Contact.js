"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import styles from "./Contact.module.css";


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
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

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

      setStatus("submitting");
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!res.ok) {
          const data = await res.json();
          if (data.errors) {
            setErrors(data.errors);
            setStatus("idle");
          } else {
            setStatus("error");
          }
          return;
        }

        setStatus("success");
      } catch {
        setStatus("error");
      }
    },
    [form]
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
