"use client";

import { useState } from "react";
import { FaMobileAlt } from "react-icons/fa";
import { useActiveSection } from "@/components/animations/ScrollSpy";
import styles from "./Header.module.css";

export default function MobileNav({ links }) {
  const [open, setOpen] = useState(false);
  const activeSection = useActiveSection();

  const handleClick = (e) => {
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
        <ul>
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={link.id === activeSection ? styles.active : ""}
                onClick={handleClick}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href="tel:+61452424565" className={styles.phoneLink}>
              <FaMobileAlt />
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
