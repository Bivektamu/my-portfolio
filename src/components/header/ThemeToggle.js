"use client";

import { useState, useEffect, useCallback } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || "light");
  }, []);

  const toggle = useCallback(() => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  }, [theme]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    },
    [toggle],
  );

  const label = `Switch to ${theme === "light" ? "dark" : "light"} mode`;

  return (
    <button
      onClick={toggle}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={label}
      title={label}
      style={{
        display: "inline-block",
        width: "12px",
        height: "12px",
        background: "var(--color-accent)",
        borderRadius: "50%",
        cursor: "pointer",
        border: "none",
        padding: 0,
        margin: "0 2px",
      }}
    />
  );
}
