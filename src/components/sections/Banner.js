"use client";

import { useScroll, useTransform, motion } from "motion/react";
import { socials } from "@/data/socials.json";
import { FiGithub, FiLinkedin, FiMail, FiTwitter } from "react-icons/fi";
import SnakeGame from "@/components/snake/SnakeGame";
import styles from "./Banner.module.css";

const ICON_MAP = { FiGithub, FiLinkedin, FiMail, FiTwitter };

export default function Banner() {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 600], [0, -80]);
  const yGame = useTransform(scrollY, [0, 600], [0, 30]);

  return (
    <section id="home" className={styles.banner}>
      {/* Background blurs */}
      <div className={styles.blurBlue} />
      <div className={styles.blurGreen} />

      <div className={styles.foreground}>
        <div className={styles.content}>
          {/* Left column: Introduction */}
          <motion.div className={styles.intro} style={{ y: yText }}>
            <p className={styles.greeting}>
              <span className={styles.comment}>{"// "}</span>
              Hi there, I&apos;m
            </p>
            <h1 className={styles.name}>Bivek Gurung</h1>
            <p className={styles.jobTitle}>Front End Developer</p>

            <div className={styles.socialLinks}>
              {socials.map((s) => {
                const Icon = ICON_MAP[s.icon];
                if (!Icon) return null;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noreferrer"
                    className={styles.socialBtn}
                    aria-label={s.label}
                  >
                    <Icon />
                    <span>{s.label}</span>
                  </a>
                );
              })}
            </div>

            <div className={styles.actions}>
              <a href="#project" className={styles.cta}>
                View My Work
              </a>
              <a href="/pdf/Bivek_Gurung_Resume.pdf" className={styles.resume} target="_blank" rel="noreferrer">
                Resume
              </a>
            </div>
          </motion.div>

          {/* Right column: Snake game */}
          <motion.div className={styles.gameArea} style={{ y: yGame }}>
            <SnakeGame />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
