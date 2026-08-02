"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { FaLink } from "react-icons/fa";
import { SiNpm } from "react-icons/si";
import styles from "./Projects.module.css";

const PROJECTS = [
  {
    title: "La Property Co",
    image: "/images/portfolio/la.jpg",
    link: "https://www.lapropertyco.com.au/",
    npm: null,
    live: "https://www.lapropertyco.com.au/",
  },
  {
    title: "Mobje Commerce",
    image: "/images/portfolio/mobje_commerce.png",
    link: "https://mobjecommerce.netlify.app/",
    npm: null,
    live: "https://mobjecommerce.netlify.app/",
  },
  {
    title: "RESTAURANT WEB APP",
    image: "/images/portfolio/restaurant.jpg",
    link: "https://restaurantapp.netlify.app/",
    npm: null,
    live: "https://restaurantapp.netlify.app/",
  },
];

const LIBRARIES = [
  {
    title: "Fancyslider Library",
    image: "/images/portfolio/fancyslider.jpg",
    npm: "https://www.npmjs.com/package/react-fancyslider",
    live: "https://fancysliderdemo.netlify.app/",
  },
  {
    title: "Odometer Library",
    image: "/images/portfolio/odometer.jpg",
    npm: "https://www.npmjs.com/package/react-simple-odometer",
    live: "https://simpleodometerdemo.netlify.app/",
  },
  {
    title: "Ticker Tape Library",
    image: "/images/portfolio/ticker_tape.jpg",
    npm: "https://www.npmjs.com/package/react-ticker-tape",
    live: "https://tickertapedemo.netlify.app/",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

function ProjectCard({ item, index }) {
  return (
    <motion.div
      className={styles.card}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={cardVariants}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
        />
        <div className={styles.overlay}>
          {item.live && (
            <a
              href={item.live}
              target="_blank"
              rel="noreferrer"
              className={styles.overlayLink}
            >
              <FaLink /> Live
            </a>
          )}
          {item.npm && (
            <a
              href={item.npm}
              target="_blank"
              rel="noreferrer"
              className={styles.overlayLink}
            >
              <SiNpm /> NPM
            </a>
          )}
        </div>
      </div>
      <div className={styles.cardBody}>
        <p className={styles.cardTitle}>{item.title}</p>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="project" className={styles.projects}>
      <div className={styles.container}>
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          PROJECTS
        </motion.h2>

        <div className={styles.grid}>
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.title} item={project} index={i} />
          ))}
        </div>

        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          NPM LIBRARIES
        </motion.h2>

        <div className={styles.grid}>
          {LIBRARIES.map((lib, i) => (
            <ProjectCard key={lib.title} item={lib} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
