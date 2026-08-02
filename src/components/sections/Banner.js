"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useScroll, useTransform, motion } from "motion/react";
import styles from "./Banner.module.css";

const BlobScene = dynamic(() => import("@/components/3d/BlobScene"), {
  ssr: false,
  loading: () => null,
});

/* ── Staggered character reveal ── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.03, delayChildren: 0.15 },
  },
};

const charVariants = {
  hidden: { opacity: 0, y: 40, rotateX: -90 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

function AnimatedCharacters({ text }) {
  const chars = Array.from(text);
  return (
    <motion.h1
      className={styles.name}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          variants={charVariants}
          className={char === " " ? styles.space : undefined}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
  );
}

/* ── Banner ── */
export default function Banner() {
  const { scrollY } = useScroll();
  const [has3D, setHas3D] = useState(false);

  useEffect(() => {
    setHas3D(window.innerWidth >= 768);
  }, []);

  const yText = useTransform(scrollY, [0, 600], [0, -150]);
  const yImage = useTransform(scrollY, [0, 600], [0, 50]);
  const yBg = useTransform(scrollY, [0, 600], [0, -30]);

  return (
    <section
      id="home"
      className={styles.banner}
      style={{ "--bg-y": yBg }}
      {...(has3D ? { "data-3d": "" } : {})}
    >
      {has3D && <BlobScene />}
      <div className={styles.container}>
        <div className={styles.row}>
          <motion.div className={styles.textCol} style={{ y: yText }}>
            <motion.p
              className={styles.greeting}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              Hi there,
            </motion.p>

            <AnimatedCharacters text="I am Bivek" />

            <motion.a
              href="#project"
              className={styles.cta}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              View My Work
              <span className={styles.ctaArrow}>&darr;</span>
            </motion.a>
          </motion.div>

          <motion.div className={styles.imageCol} style={{ y: yImage }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Image
                src="/images/banner1.svg"
                alt="Banner illustration"
                width={500}
                height={500}
                sizes="(max-width: 768px) 260px, 500px"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
