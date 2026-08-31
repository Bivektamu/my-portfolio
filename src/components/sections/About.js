"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { bio } from "@/data/personal.json";
import styles from "./About.module.css";

const PROFILE = {
  name: "Bivek Gurung",
  role: "Front End Developer",
  email: "bivekgurung9@gmail.com",
  phone: "+61452424565",
  location: "Australia",
  github: "https://github.com/bivektamu",
  linkedin: "https://www.linkedin.com/in/bivek-gurung-b4602a62/",
};

const FOLDERS = [
  {
    name: "personal-info",
    icon: "📁",
    files: [
      { name: "bio.md", icon: "📄", type: "bio" },
      { name: "contacts.md", icon: "📄", type: "contacts" },
    ],
  },
  {
    name: "professional-info",
    icon: "📁",
    files: [{ name: "experience.md", icon: "📄", type: "experience" }],
  },
  {
    name: "hobbies",
    icon: "📁",
    files: [{ name: "interests.md", icon: "📄", type: "interests" }],
  },
];

const EXPERIENCE = [
  {
    role: "Front End Developer",
    company: "Ondicom",
    period: "Jun 2017 - Feb 2025",
    type: "Full-time · Hybrid · North Sydney NSW",
    highlights: [
      "Progressed from Junior to Mid-level, shipping 200+ digital products across marketing and enterprise",
      "React, ES6+, TypeScript and component-driven architecture for scalability and maintainability",
      "Reusable UI component libraries, REST API integration and state management patterns",
      "WCAG accessibility, cross-browser compatibility and responsive design",
      "CMS migrations from legacy WordPress systems to React-driven, .NET-backed platforms",
      "Code reviews, frontend standards and mentoring junior developers",
    ],
  },
  {
    role: "Web Developer Intern",
    company: "Thinkun",
    period: "Jan 2017 - May 2017",
    type: "Internship · On-site · Newtown NSW",
    highlights: [
      "Custom WordPress themes built from scratch, turning designs into responsive sites",
      "Custom UI plugins to extend functionality and improve user experience",
      "HTML, CSS, SASS, JavaScript, jQuery, PHP and WordPress",
    ],
  },
];

const INTERESTS = [
  "exploring new technologies and the modern JavaScript ecosystem",
  "contributing to open-source projects",
  "hiking and spending time in the great outdoors",
];

/* ── Syntax-token helpers for the code-editor content ── */
const Kw = ({ children }) => <span className={styles.keyword}>{children}</span>;
const Var = ({ children }) => <span className={styles.variable}>{children}</span>;
const Op = ({ children }) => <span className={styles.operator}>{children}</span>;
const Brace = ({ children }) => <span className={styles.brace}>{children}</span>;
const Str = ({ children }) => <span className={styles.string}>{children}</span>;
const Prop = ({ children }) => <span className={styles.property}>{children}</span>;
const Com = ({ children }) => <span className={styles.comment}>{children}</span>;

function bioLines() {
  return [
    <p key="h0">
      <Com>{"// the developer"}</Com>
    </p>,
    <p key="0">
      <Kw>const</Kw> <Var>developer</Var> <Op>=</Op> <Brace>{"{"}</Brace>
    </p>,
    <p key="1">
      <Prop>name</Prop>: <Str>{`"${PROFILE.name}",`}</Str>
    </p>,
    <p key="2">
      <Prop>role</Prop>: <Str>{`"${PROFILE.role}",`}</Str>
    </p>,
    <p key="3">
      <Prop>location</Prop>: <Str>{`"${PROFILE.location}",`}</Str>
    </p>,
    <p key="4">
      <Prop>bio</Prop>: <Brace>[</Brace>
    </p>,
    ...bio.map((paragraph, i) => (
      <p key={`b${i}`}>
        <Str>{`    "${paragraph}",`}</Str>
      </p>
    )),
    <p key="5">
      <Brace>]</Brace>
    </p>,
    <p key="6">
      <Brace>{"}"}</Brace>
      <Op>;</Op>
    </p>,
  ];
}

function contactsLines() {
  return [
    <p key="h0">
      <Com>{"// how to reach me"}</Com>
    </p>,
    <p key="0">
      <Kw>const</Kw> <Var>contacts</Var> <Op>=</Op> <Brace>{"{"}</Brace>
    </p>,
    <p key="1">
      <Prop>email</Prop>: <Str>{`"${PROFILE.email}",`}</Str>
    </p>,
    <p key="2">
      <Prop>phone</Prop>: <Str>{`"${PROFILE.phone}",`}</Str>
    </p>,
    <p key="3">
      <Prop>location</Prop>: <Str>{`"${PROFILE.location}",`}</Str>
    </p>,
    <p key="4">
      <Prop>github</Prop>: <Str>{`"${PROFILE.github}",`}</Str>
    </p>,
    <p key="5">
      <Prop>linkedin</Prop>: <Str>{`"${PROFILE.linkedin}",`}</Str>
    </p>,
    <p key="6">
      <Brace>{"}"}</Brace>
      <Op>;</Op>
    </p>,
  ];
}

function experienceLines() {
  const lines = [
    <p key="h0">
      <Com>{"// professional experience"}</Com>
    </p>,
    <p key="0">
      <Kw>const</Kw> <Var>experience</Var> <Op>=</Op> <Brace>[</Brace>
    </p>,
  ];
  EXPERIENCE.forEach((job, i) => {
    lines.push(
      <p key={`open${i}`}>
        <Brace>{"{"}</Brace>
      </p>,
      <p key={`role${i}`}>
        <Prop>role</Prop>: <Str>{`"${job.role}",`}</Str>
      </p>,
      <p key={`company${i}`}>
        <Prop>company</Prop>: <Str>{`"${job.company}",`}</Str>
      </p>,
      <p key={`period${i}`}>
        <Prop>period</Prop>: <Str>{`"${job.period}",`}</Str>
      </p>,
      <p key={`type${i}`}>
        <Prop>type</Prop>: <Str>{`"${job.type}",`}</Str>
      </p>,
      <p key={`hl${i}`}>
        <Prop>highlights</Prop>: <Brace>[</Brace>
      </p>,
      ...job.highlights.map((highlight, j) => (
        <p key={`line${i}${j}`}>
          <Str>{`    "${highlight}",`}</Str>
        </p>
      )),
      <p key={`hlclose${i}`}>
        <Brace>]</Brace>
      </p>,
      <p key={`close${i}`}>
        <Brace>{"}"}</Brace>
        <Op>,</Op>
      </p>
    );
  });
  lines.push(
    <p key="end">
      <Brace>]</Brace>
      <Op>;</Op>
    </p>
  );
  return lines;
}

function interestsLines() {
  return [
    <p key="h0">
      <Com>{"// outside of work"}</Com>
    </p>,
    <p key="0">
      <Kw>const</Kw> <Var>interests</Var> <Op>=</Op> <Brace>[</Brace>
    </p>,
    ...INTERESTS.map((interest, i) => (
      <p key={`i${i}`}>
        <Str>{`  "${interest}",`}</Str>
      </p>
    )),
    <p key="1">
      <Brace>]</Brace>
      <Op>;</Op>
    </p>,
  ];
}

const CONTENT = {
  bio: bioLines,
  contacts: contactsLines,
  experience: experienceLines,
  interests: interestsLines,
};

export default function About() {
  const [expanded, setExpanded] = useState("personal-info");
  const [activeFile, setActiveFile] = useState("bio.md");
  const [activeFolder, setActiveFolder] = useState("personal-info");

  const toggleFolder = (name) => {
    setExpanded(expanded === name ? null : name);
  };

  const openFile = (folderName, fileName) => {
    setActiveFolder(folderName);
    setActiveFile(fileName);
  };

  const activeFileObj = FOLDERS.find((f) => f.name === activeFolder)?.files.find(
    (f) => f.name === activeFile
  );

  const lines = activeFileObj ? CONTENT[activeFileObj.type]() : [];

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
                aria-expanded={expanded === folder.name}
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
                <span>
                  {activeFolder} / {activeFile}
                </span>
              </div>
            )}
          </div>

          {/* Content panels */}
          <div className={styles.panels}>
            {/* Left: code file content */}
            <div className={styles.codePanel}>
              <div className={styles.codeHeader}>
                <span className={styles.codeLang}>{"// "}{activeFile}</span>
              </div>
              <div className={styles.codeContent}>
                <div className={styles.lineNumbers}>
                  {lines.map((_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>
                <motion.div
                  key={activeFile}
                  className={styles.codeText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  {lines}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
