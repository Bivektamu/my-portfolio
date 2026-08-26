"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";

export default function MobileNav({ links, currentPath }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        className={`${styles.hamburger} ${open ? styles.open : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
        aria-expanded={open}
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
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.navLink} ${link.href === currentPath ? styles.active : ""}`}
                onClick={handleClick}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
