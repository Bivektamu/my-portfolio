"use client";

import { motion } from "motion/react";
import { FiGithub, FiLinkedin, FiMail, FiTwitter } from "react-icons/fi";
import styles from "./Contact.module.css";

const SOCIALS = [
  { href: "https://github.com/bivekgurung", icon: FiGithub, label: "GitHub" },
  {
    href: "https://www.linkedin.com/in/bivek-gurung-145880145/",
    icon: FiLinkedin,
    label: "LinkedIn",
  },
  { href: "mailto:bivekgurung9@gmail.com", icon: FiMail, label: "Email" },
  { href: "#", icon: FiTwitter, label: "Twitter" },
];

const linkVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function Contact() {
  return (
    <section
      id="contact"
      className={styles.contact}
      style={{ backgroundImage: "url(/images/footer-bg.png)" }}
    >
      <div className={styles.container}>
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Let&apos;s Connect
        </motion.h2>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Have a project in mind? Let&apos;s build something great together.
        </motion.p>

        <div className={styles.social}>
          {SOCIALS.map((social, i) => (
            <motion.a
              key={social.label}
              href={social.href}
              target={social.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noreferrer"
              className={styles.socialLink}
              aria-label={social.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={linkVariants}
            >
              <social.icon />
            </motion.a>
          ))}
        </div>

        <motion.p
          className={styles.copyright}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          &copy; {new Date().getFullYear()} Bivek Gurung. All rights reserved.
        </motion.p>
      </div>
    </section>
  );
}
