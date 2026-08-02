"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { FaLink } from "react-icons/fa";
import { SiNpm } from "react-icons/si";
import { projects, libraries } from "@/data/projects.json";
import styles from "./Projects.module.css";

const ALL_ITEMS = [...projects, ...libraries];

const TECHNOLOGIES = [
  { name: "React", checked: true },
  { name: "JavaScript", checked: true },
  { name: "HTML", checked: false },
  { name: "CSS", checked: false },
  { name: "Next.js", checked: true },
  { name: "Gatsby", checked: false },
  { name: "Vue", checked: false },
  { name: "Angular", checked: false },
];

export default function Projects() {
  const [techFilters, setTechFilters] = useState(TECHNOLOGIES);

  const toggleTech = (name) => {
    setTechFilters((prev) =>
      prev.map((t) => (t.name === name ? { ...t, checked: !t.checked } : t))
    );
  };

  return (
    <section id="project" className={styles.projects}>
      <div className={styles.foreground}>
        {/* Technology filter sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <span className={styles.sidebarTitle}>{"// technologies"}</span>
          </div>
          <div className={styles.techList}>
            {techFilters.map((tech) => (
              <button
                key={tech.name}
                className={`${styles.techItem} ${tech.checked ? styles.checked : ""}`}
                onClick={() => toggleTech(tech.name)}
              >
                <span className={styles.checkbox}>
                  {tech.checked && <span className={styles.checkIcon}>✓</span>}
                </span>
                <span>{tech.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Project cards */}
        <div className={styles.main}>
          <div className={styles.tabs}>
            <div className={styles.tab}>
              <span>projects</span>
            </div>
          </div>
          <div className={styles.grid}>
            {ALL_ITEMS.map((item, i) => (
              <motion.div
                key={item.title}
                className={styles.card}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={styles.cardImage}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDesc}>{item.live ? "Live project" : "NPM package"}</p>
                  <div className={styles.cardLinks}>
                    {item.live && (
                      <a href={item.live} target="_blank" rel="noreferrer" className={styles.cardLink}>
                        <FaLink /> Live
                      </a>
                    )}
                    {item.npm && (
                      <a href={item.npm} target="_blank" rel="noreferrer" className={styles.cardLink}>
                        <SiNpm /> NPM
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
