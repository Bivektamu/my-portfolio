"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGithub } from "react-icons/fi";
import styles from "./SiteFrame.module.css";

const GITHUB_URL = "https://github.com/bivektamu";
const LINKEDIN_URL = "https://www.linkedin.com/in/bivek-gurung-b4602a62/";

const NAV_LINKS = [
  { href: "/", label: "_hello" },
  { href: "/about", label: "_about-me" },
  { href: "/projects", label: "_projects" },
  { href: "/contact", label: "_contact-me" },
];

function tabClass(href, pathname) {
  return href === pathname ? `${styles.tab} ${styles.tabActive}` : styles.tab;
}

export default function SiteFrame({ children }) {
  const pathname = usePathname();

  return (
    <div className={styles.page}>
      <div className={styles.window}>
        <nav className={styles.navbar} aria-label="Primary">
          <span className={styles.brand}>bivek_gurung</span>
          <Link href="/" className={tabClass("/", pathname)}>
            _hello
          </Link>
          <Link href="/about" className={tabClass("/about", pathname)}>
            _about-me
          </Link>
          <Link href="/projects" className={tabClass("/projects", pathname)}>
            _projects
          </Link>
          <span className={styles.navSpacer} />
          <Link href="/contact" className={tabClass("/contact", pathname)}>
            _contact-me
          </Link>
        </nav>

        <div className={styles.main}>{children}</div>

        <footer className={styles.footer}>
          <span className={styles.footerLabel}>find me in:</span>
         
          <a
            className={styles.footerBtn}
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            in
          </a>
          <span className={styles.footerSpacer} />
          <a className={styles.footerGithub} href={GITHUB_URL} target="_blank" rel="noreferrer">
            <span>@bivektamu</span>
            <FiGithub />
          </a>
        </footer>
      </div>
    </div>
  );
}
