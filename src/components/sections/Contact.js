import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section
      id="contact"
      className={styles.contact}
      style={{ backgroundImage: "url(/images/footer-bg.png)" }}
    >
      <div className={styles.container}>
        <h2 className={styles.heading}>Contact</h2>

        <div className={styles.social}>
          <a
            href="https://github.com/Bivektamu/"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>

          <a
            href="mailto:bivek.tamu@gmail.com"
            aria-label="Email"
          >
            <SiGmail />
          </a>

          <a
            href="https://www.linkedin.com/in/bivek-gurung-b4602a62/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </section>
  );
}
