"use client";

import { useState } from "react";
import { useActiveSection } from "@/components/animations/ScrollSpy";
import styles from "./Header.module.css";

export default function MobileNav({ links }) {
  const [open, setOpen] = useState(false);
  const activeSection = useActiveSection();

  const handleClick = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        className={`${styles.hamburger} ${open ? styles.open : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`${styles.nav} ${open ? styles.open : ""}`}>
        <div className={styles.navHeader}>
          <span className={styles.navLabel}>navigate</span>
        </div>
        <ul className={styles.navList}>
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={`${styles.navLink} ${link.id === activeSection ? styles.active : ""}`}
                onClick={handleClick}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
