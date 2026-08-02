"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ImPhone } from "react-icons/im";
import styles from "./Skills.module.css";

const SKILLS = [
  { name: "React + Redux", icon: "/images/skills/react_redux.png" },
  { name: "JavaScript", icon: "/images/skills/javascript.png" },
  { name: "jQuery", icon: "/images/skills/jquery.png" },
  { name: "HTML", icon: "/images/skills/html.png" },
  { name: "CSS", icon: "/images/skills/css.png" },
  { name: "SASS", icon: "/images/skills/sass.png" },
  { name: "MongoDB", icon: "/images/skills/mongodb.png" },
  { name: "REST API", icon: "/images/skills/rest.png" },
  { name: "Git", icon: "/images/skills/git.png" },
];

const skillVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.06,
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function Skills() {
  return (
    <section id="skill" className={styles.skills}>
      <div className={styles.container}>
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          MY SPECIALITY
        </motion.h2>

        <div className={styles.row}>
          <div className={styles.grid}>
            {SKILLS.map((skill, i) => (
              <motion.div
                key={skill.name}
                className={styles.skillCard}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={skillVariants}
              >
                <Image
                  src={skill.icon}
                  alt={skill.name}
                  width={60}
                  height={60}
                  sizes="60px"
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            className={styles.experience}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.bgPanel} />

            <div className={styles.expHeader}>
              <span className={styles.years}>7</span>
              <div className={styles.expText}>
                <span>Years of</span>
                <span>Working</span>
                <span>Experience</span>
              </div>
            </div>

            <div className={styles.callArea}>
              <a
                href="tel:+61452424565"
                className={styles.phoneIcon}
                aria-label="Call now"
              >
                <ImPhone />
              </a>
              <a href="tel:+61452424565" className={styles.callNow}>
                Call Now
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
