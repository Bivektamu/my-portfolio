"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Cursor.module.css";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const cursorRef = useRef(null);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });
  const visibleRef = useRef(false);

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
      className={styles.cursor}
      style={{
        left: pos.x,
        top: pos.y,
        opacity: 0,
      }}
    />
  );
}
