"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Cursor.module.css";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const cursorRef = useRef(null);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });
  const visibleRef = useRef(false);

  /* ── Hover detection on interactive elements ── */
  const onEnter = useCallback(() => setHovered(true), []);
  const onLeave = useCallback(() => setHovered(false), []);

  useEffect(() => {
    const attach = () => {
      const selectors = "a, button, [role=button], input, textarea, [data-magnetic]";
      document.querySelectorAll(selectors).forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };

    attach();
    const obs = new MutationObserver(attach);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => obs.disconnect();
  }, [onEnter, onLeave]);

  /* ── Mouse tracking with rAF lerp ── */
  useEffect(() => {
    const onMouseMove = (e) => {
      if (window.innerWidth > 999) {
        mouseRef.current = { x: e.clientX, y: e.clientY };
        if (!visibleRef.current) {
          visibleRef.current = true;
          if (cursorRef.current) cursorRef.current.style.opacity = "1";
        }
      } else {
        visibleRef.current = false;
        if (cursorRef.current) cursorRef.current.style.opacity = "0";
      }
    };

    const animate = () => {
      if (visibleRef.current) {
        const dx = mouseRef.current.x - currentRef.current.x;
        const dy = mouseRef.current.y - currentRef.current.y;
        currentRef.current.x += dx * 0.07;
        currentRef.current.y += dy * 0.07;
        setPos({ x: currentRef.current.x, y: currentRef.current.y });
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`${styles.cursor} ${hovered ? styles.hovered : ""}`}
      style={{
        left: pos.x,
        top: pos.y,
        opacity: 0,
      }}
    />
  );
}
