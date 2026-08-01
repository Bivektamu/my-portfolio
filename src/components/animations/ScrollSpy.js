"use client";

import { useEffect, useState, createContext, useContext } from "react";

export const ActiveSectionContext = createContext("home");

export function useActiveSection() {
  return useContext(ActiveSectionContext);
}

export default function ScrollSpy({ children, sectionIds }) {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const headerHeight = 70;
    const observers = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(id);
          }
        },
        {
          rootMargin: `-${headerHeight}px 0px -60% 0px`,
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [sectionIds]);

  return (
    <ActiveSectionContext.Provider value={active}>
      {children}
    </ActiveSectionContext.Provider>
  );
}
