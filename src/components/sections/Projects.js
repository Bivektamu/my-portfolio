"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { FaLink } from "react-icons/fa";
import { SiNpm } from "react-icons/si";
import { projects, libraries } from "@/data/projects.json";
import styles from "./Projects.module.css";

const ALL_ITEMS = [...projects, ...libraries];

const TECHNOLOGIES = [
  "React",
  "JavaScript",
  "TypeScript",
  "HTML",
  "CSS",
  "SASS",
  "Gatsby",
  "Redux",
  "GraphQL",
  "MongoDB",
  "Node.js",
  "Tailwind",
  "Stripe",
  "AWS",
].map((name) => ({ name, checked: false }));

export default function Projects() {
  const [techFilters, setTechFilters] = useState(TECHNOLOGIES);

  const toggleTech = (name) => {
    setTechFilters((prev) =>
      prev.map((t) => (t.name === name ? { ...t, checked: !t.checked } : t))
    );
  };

  // No filters selected shows everything; otherwise items must match every
  // selected technology.
  const visibleItems = useMemo(() => {
    const active = techFilters.filter((t) => t.checked).map((t) => t.name);
    if (active.length === 0) return ALL_ITEMS;
    return ALL_ITEMS.filter((item) =>
      active.every((tech) => Array.isArray(item.tech) && item.tech.includes(tech))
    );
  }, [techFilters]);

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
                role="checkbox"
                aria-checked={tech.checked}
              >
                <span className={styles.checkbox} aria-hidden="true">
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
            {visibleItems.length === 0 && (
              <p className={styles.empty}>
                {"// no projects match the selected technologies"}
              </p>
            )}
            {visibleItems.map((item, i) => (
              <motion.div
                key={item.title}
                className={styles.card}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={styles.cardImage}>
                  {/* fill + sizes is intentional here: card images are fluid
                      width inside a CSS grid, so dimensions are unknown */}
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
