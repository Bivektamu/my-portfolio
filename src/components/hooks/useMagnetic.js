"use client";

import { useRef, useState, useEffect } from "react";

/**
 * Magnetic hover hook — makes an element gently pull toward the cursor.
 * Returns: { ref, style } — attach ref to the element and spread style.
 * @param {number} strength - pull strength (0.1–0.5 recommended)
 * @param {number} radius - effective radius in px
 */
export function useMagnetic(strength = 0.25, radius = 100) {
  const ref = useRef(null);
  const [style, setStyle] = useState({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const dist = Math.sqrt(distX * distX + distY * distY);

      if (dist < radius) {
        const pull = (1 - dist / radius) * strength;
        const targetX = distX * pull;
        const targetY = distY * pull;

        const animate = () => {
          currentRef.current.x +=
            (targetX - currentRef.current.x) * 0.12;
          currentRef.current.y +=
            (targetY - currentRef.current.y) * 0.12;
          setStyle({
            x: currentRef.current.x,
            y: currentRef.current.y,
          });
          rafRef.current = requestAnimationFrame(animate);
        };
        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(animate);
        }
      } else {
        const animate = () => {
          currentRef.current.x += (0 - currentRef.current.x) * 0.08;
          currentRef.current.y += (0 - currentRef.current.y) * 0.08;
          if (
            Math.abs(currentRef.current.x) < 0.05 &&
            Math.abs(currentRef.current.y) < 0.05
          ) {
            currentRef.current.x = 0;
            currentRef.current.y = 0;
            setStyle({ x: 0, y: 0 });
            if (rafRef.current) {
              cancelAnimationFrame(rafRef.current);
              rafRef.current = null;
            }
            return;
          }
          setStyle({
            x: currentRef.current.x,
            y: currentRef.current.y,
          });
          rafRef.current = requestAnimationFrame(animate);
        };
        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(animate);
        }
      }
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [strength, radius]);

  return { ref, style: { transform: `translate(${style.x}px, ${style.y}px)` } };
}
