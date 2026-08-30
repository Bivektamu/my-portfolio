"use client";

import dynamic from "next/dynamic";
import styles from "./Banner.module.css";

const SnakeGame = dynamic(() => import("@/components/snake/SnakeGame"), {
  ssr: false,
  loading: () => <div className={styles.gamePlaceholder} aria-label="Loading snake game" />,
});

const GITHUB_URL = "https://github.com/bivekgurung";

export default function Banner() {
  return (
    <section id="home" className={styles.banner}>
      <div className={styles.glowTeal} aria-hidden="true" />
      <div className={styles.glowPurple} aria-hidden="true" />

      <div className={styles.hero}>
        {/* Left column: introduction */}
        <div className={styles.intro}>
          <p className={styles.greeting}>Hi all. I am</p>
          <h1 className={styles.name}>Bivek Gurung</h1>
          <p className={styles.jobTitle}>&gt; Front-end developer</p>

          <p className={styles.comment}>{"// "}complete the game to continue</p>
          <p className={styles.comment}>{"// "}find my profile on Github:</p>

          <p className={styles.codeLine}>
            <span className={styles.keyword}>const</span>
            <span className={styles.ident}> githubLink</span>
            <span className={styles.symbol}> = </span>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className={styles.url}>
              &quot;{GITHUB_URL}&quot;
            </a>
          </p>
        </div>

        {/* Right column: game panel */}
        <div className={styles.gameArea}>
          <SnakeGame />
        </div>
      </div>
    </section>
  );
}
