"use client";

import { useState, useEffect } from "react";
import styles from "./Preloader.module.css";

export default function Preloader({ children }) {
  const [phase, setPhase] = useState("hidden");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const t1 = setTimeout(() => { if (!isCancelled) setPhase("blobVisible"); }, 500);
    const t2 = setTimeout(() => { if (!isCancelled) setPhase("blobAnimate"); }, 1500);
    const t3 = setTimeout(() => { if (!isCancelled) setPhase("headerVisible"); }, 2200);
    const t4 = setTimeout(() => { if (!isCancelled) setDone(true); }, 2600);

    const safetyTimeout = setTimeout(() => {
      if (!isCancelled) setDone(true);
    }, 5000);

    return () => {
      isCancelled = true;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(safetyTimeout);
    };
  }, []);

  if (!done) {
    return (
      <div className={styles.preloader}>
        <div
          className={`${styles.blob} ${
            phase === "blobVisible" || phase === "blobAnimate" || phase === "headerVisible"
              ? styles.visible
              : ""
          } ${phase === "blobAnimate" || phase === "headerVisible" ? styles.animate : ""}`}
        />
      </div>
    );
  }

  return <>{children}</>;
}
