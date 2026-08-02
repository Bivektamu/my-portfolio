"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ImPhone } from "react-icons/im";
import { skills } from "@/data/skills.json";
import styles from "./Skills.module.css";

export default function Skills() {
  return (
    <section id="skill" className={styles.skills}>
      <div className={styles.foreground}>
        <div className={styles.tabs}>
          <div className={styles.tab}>
            <span>skills.ts</span>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.skillGrid}>
            {skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                className={styles.skillChip}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src={skill.icon}
                  alt={skill.name}
                  width={24}
                  height={24}
                  sizes="24px"
                />
                <span>{skill.name}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className={styles.experience}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.expCard}>
              <span className={styles.expYears}>7</span>
              <div className={styles.expLabel}>
                <span>Years of</span>
                <span>Experience</span>
              </div>
            </div>
            <a href="tel:+61452424565" className={styles.callBtn} aria-label="Call">
              <ImPhone />
              <span>Call Now</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
