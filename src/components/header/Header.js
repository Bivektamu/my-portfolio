import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import MobileNav from "./MobileNav";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { id: "home", label: "_hello" },
  { id: "about", label: "_about-me" },
  { id: "project", label: "_projects" },
  { id: "skill", label: "_skills" },
  { id: "contact", label: "_contact-me" },
];

export default function Header() {
  return (
    <header id="header" className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>bivek_gurung</span>
          <ThemeToggle />
        </Link>

        <MobileNav links={NAV_LINKS} />
      </div>
    </header>
  );
}
