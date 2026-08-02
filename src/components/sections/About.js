"use client";

import Image from "next/image";
import { useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";
import styles from "./About.module.css";

export default function About() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const yImage = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section id="about" className={styles.about} ref={targetRef}>
      <div className={styles.container}>
        <div className={styles.row}>
          <motion.div className={styles.imageCol} style={{ y: yImage }}>
            <div className={styles.imageFrame}>
              <Image
                src="/images/about-me.png"
                alt="Bivek Gurung"
                width={400}
                height={500}
                sizes="(max-width: 768px) 280px, 400px"
                style={{ objectFit: "cover", width: "auto", height: "auto" }}
              />
              <div className={styles.imageAccent} />
            </div>
          </motion.div>

          <motion.div className={styles.textCol} style={{ y: yText }}>
            <motion.h2
              className={styles.heading}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              About Me
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              I&apos;m a passionate front-end developer based in Australia with
              a focus on creating modern, performant web applications.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              I specialize in React, Next.js, and the modern JavaScript
              ecosystem. I love building clean, accessible interfaces that feel
              great to use and look beautiful.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              When I&apos;m not coding, you&apos;ll find me exploring new
              technologies, contributing to open-source, or hiking in the great
              outdoors.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
