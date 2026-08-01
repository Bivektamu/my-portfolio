"use client";

import Image from "next/image";
import { useScroll, useTransform, motion } from "motion/react";
import styles from "./Banner.module.css";

export default function Banner() {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 600], [0, -150]);
  const yImage = useTransform(scrollY, [0, 600], [0, 50]);

  return (
    <section id="home" className={styles.banner}>
      <div className={styles.container}>
        <div className={styles.row}>
          <motion.div className={styles.textCol} style={{ y: yText }}>
            <p className={styles.greeting}>Hi there,</p>
            <h1 className={styles.name}>I am Bivek</h1>
          </motion.div>

          <motion.div className={styles.imageCol} style={{ y: yImage }}>
            <Image
              src="/images/banner1.svg"
              alt="Banner illustration"
              width={500}
              height={500}
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
