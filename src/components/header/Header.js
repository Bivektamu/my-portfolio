import Link from "next/link";
import { FaMobileAlt } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import MobileNav from "./MobileNav";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "project", label: "Projects" },
  { id: "skill", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export default function Header() {
  return (
    <header id="header" className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <p>BIV</p>
          <ThemeToggle />
          <p>EK</p>
        </Link>

        <MobileNav links={NAV_LINKS} />
      </div>
    </header>
  );
}
