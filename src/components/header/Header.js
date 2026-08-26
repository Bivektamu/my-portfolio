"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import MobileNav from "./MobileNav";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { href: "/", label: "_hello" },
  { href: "/about", label: "_about-me" },
  { href: "/projects", label: "_projects" },
  { href: "/skills", label: "_skills" },
  { href: "/contact", label: "_contact-me" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header id="header" className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>bivek_gurung</span>
          <ThemeToggle />
        </Link>

        <MobileNav links={NAV_LINKS} currentPath={pathname} />
      </div>
    </header>
  );
}
