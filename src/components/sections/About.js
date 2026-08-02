"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { bio } from "@/data/personal.json";
import styles from "./About.module.css";

const FOLDERS = [
  {
    name: "personal-info",
    icon: "📁",
    files: [
      { name: "bio.md", icon: "📄", content: "bio" },
      { name: "contacts.md", icon: "📄", content: "contacts" },
    ],
  },
  {
    name: "professional-info",
    icon: "📁",
    files: [
      { name: "experience.md", icon: "📄", content: "experience" },
      { name: "education.md", icon: "📄", content: "education" },
    ],
  },
  {
    name: "hobbies",
    icon: "📁",
    files: [
      { name: "interests.md", icon: "📄", content: "interests" },
    ],
  },
];

const CODE_SNIPPETS = [
  {
    id: 1,
    title: "useParallax",
    username: "bivekgurung",
    avatar: "/images/fav.png",
    stars: 12,
    code: `export function useParallax(ref, offset) {\n  const { scrollYProgress } = useScroll({\n    target: ref,\n    offset: offset || ["start end", "end start"],\n  });\n  return useTransform(scrollYProgress, [0, 1], [50, -50]);\n}`,
  },
  {
    id: 2,
    title: "MagneticButton",
    username: "bivekgurung",
    avatar: "/images/fav.png",
    stars: 8,
    code: `export function MagneticButton({ children }) {\n  const ref = useRef(null);\n  const { x, y } = useMagnetic(ref, 0.3, 120);\n  return (\n    <button ref={ref} style={{ transform: \`translate(\${x}px, \${y}px)\` }}>\n      {children}\n    </button>\n  );\n}`,
  },
];

export default function About() {
  const [expanded, setExpanded] = useState(null);
  const [activeFile, setActiveFile] = useState("bio.md");
  const [activeFolder, setActiveFolder] = useState("personal-info");

  const toggleFolder = (name) => {
    setExpanded(expanded === name ? null : name);
  };

  const openFile = (folderName, fileName) => {
    setActiveFolder(folderName);
    setActiveFile(fileName);
  };

  const activeFileObj = FOLDERS.find((f) => f.name === activeFolder)
    ?.files.find((f) => f.name === activeFile);

  const lineNumbers = Array.from({ length: bio.length + 2 }, (_, i) => i + 1);

  return (
    <section id="about" className={styles.about}>
      <div className={styles.foreground}>
        {/* File explorer sidebar */}
        <div className={styles.sidebar}>
          {FOLDERS.map((folder) => (
            <div key={folder.name} className={styles.folderGroup}>
              <button
                className={`${styles.folderTitle} ${expanded === folder.name ? styles.expanded : ""}`}
                onClick={() => toggleFolder(folder.name)}
              >
                <span className={styles.arrow}>{expanded === folder.name ? "▾" : "▸"}</span>
                <span className={styles.icon}>{folder.icon}</span>
                <span>{folder.name}</span>
              </button>
              {expanded === folder.name && (
                <div className={styles.folderFiles}>
                  {folder.files.map((file) => (
                    <button
                      key={file.name}
                      className={`${styles.fileItem} ${activeFile === file.name && activeFolder === folder.name ? styles.activeFile : ""}`}
                      onClick={() => openFile(folder.name, file.name)}
                    >
                      <span className={styles.icon}>{file.icon}</span>
                      <span>{file.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Main content area */}
        <div className={styles.main}>
          {/* Tabs */}
          <div className={styles.tabs}>
            {activeFileObj && (
              <div className={styles.tab}>
                <span className={styles.tabIcon}>{activeFileObj.icon}</span>
                <span>{activeFolder} / {activeFile}</span>
              </div>
            )}
          </div>

          {/* Content panels */}
          <div className={styles.panels}>
            {/* Left: Code snippet bio */}
            <div className={styles.codePanel}>
              <div className={styles.codeHeader}>
                <span className={styles.codeLang}>{"// about.tsx"}</span>
              </div>
              <div className={styles.codeContent}>
                <div className={styles.lineNumbers}>
                  {lineNumbers.map((n) => (
                    <span key={n}>{n}</span>
                  ))}
                </div>
                <div className={styles.codeText}>
                  <p>
                    <span className={styles.keyword}>const</span>{" "}
                    <span className={styles.variable}>developer</span>{" "}
                    <span className={styles.operator}>=</span>{" "}
                    <span className={styles.brace}>{"{"}</span>
                  </p>
                  {bio.map((paragraph, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <span className={styles.string}>  bio: &quot;{paragraph}&quot;,</span>
                    </motion.p>
                  ))}
                  <p>
                    <span className={styles.brace}>{"}"}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Gist cards */}
            <div className={styles.gistPanel}>
              <div className={styles.codeHeader}>
                <span className={styles.codeLang}>{"// gists"}</span>
              </div>
              <div className={styles.gistList}>
                {CODE_SNIPPETS.map((snippet) => (
                  <motion.div
                    key={snippet.id}
                    className={styles.gistCard}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className={styles.gistHeader}>
                      <div className={styles.gistUser}>
                        <div className={styles.gistAvatar} />
                        <div className={styles.gistUserInfo}>
                          <span className={styles.gistUsername}>{snippet.username}</span>
                          <span className={styles.gistTimestamp}>2 days ago</span>
                        </div>
                      </div>
                      <div className={styles.gistActions}>
                        <span className={styles.gistStars}>★ {snippet.stars}</span>
                      </div>
                    </div>
                    <div className={styles.gistCodeBlock}>
                      <pre className={styles.gistCode}>{snippet.code}</pre>
                    </div>
                    <div className={styles.gistFooter}>
                      <span className={styles.gistTitle}>{snippet.title}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
