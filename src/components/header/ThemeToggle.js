"use client";

import { useState, useEffect, useCallback } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || "light");
  }, []);

  const toggle = useCallback(() => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  }, [theme]);

  const label = `Switch to ${theme === "light" ? "dark" : "light"} mode`;

  return (
    <button
      onClick={toggle}
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
