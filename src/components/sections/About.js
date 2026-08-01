"use client";

import { useRef } from "react";
import Image from "next/image";
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
          <motion.div className={styles.textCol} style={{ y: yText }}>
            <h2 className={styles.heading}>LET ME INTRODUCE MYSELF</h2>
            <p>
              Hi, I am Bivek. I am a front end developer with 7 years of
              extensive professional experience and skills in React, Redux
              Toolkit, React Context API, Rest API, TypeScript, JavaScript,
              jQuery, WordPress, PHP, HTML5, CSS3, SASS, LESS, etc.
            </p>
          </motion.div>

          <motion.div className={styles.imageCol} style={{ y: yImage }}>
            <Image
              src="/images/banner2.svg"
              alt="About illustration"
              width={500}
              height={500}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
