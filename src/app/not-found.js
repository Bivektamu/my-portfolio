import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.foreground}>
        <div className={styles.content}>
          <h1 className={styles.code}>404</h1>
          <p className={styles.text}>
            <span className={styles.comment}>{"// "}</span>
            Page not found
          </p>
          <p className={styles.hint}>
            The requested path does not exist on this server.
          </p>
          <Link href="/" className={styles.homeLink}>
            {"$ cd /home"}
          </Link>
        </div>
      </div>
    </div>
  );
}
