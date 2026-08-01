import Image from "next/image";
import { ImPhone } from "react-icons/im";
import styles from "./Skills.module.css";

const SKILLS = [
  { name: "React + Redux", icon: "/images/skills/react_redux.png" },
  { name: "JavaScript", icon: "/images/skills/javascript.png" },
  { name: "jQuery", icon: "/images/skills/jquery.png" },
  { name: "HTML", icon: "/images/skills/html.png" },
  { name: "CSS", icon: "/images/skills/css.png" },
  { name: "SASS", icon: "/images/skills/sass.png" },
  { name: "MongoDB", icon: "/images/skills/mongodb.png" },
  { name: "REST API", icon: "/images/skills/rest.png" },
  { name: "Git", icon: "/images/skills/git.png" },
];

export default function Skills() {
  return (
    <section id="skill" className={styles.skills}>
      <div className={styles.container}>
        <h2 className={styles.heading}>MY SPECIALITY</h2>

        <div className={styles.row}>
          <div className={styles.grid}>
            {SKILLS.map((skill) => (
              <div key={skill.name} className={styles.skillCard}>
                <Image
                  src={skill.icon}
                  alt={skill.name}
                  width={60}
                  height={60}
                />
              </div>
            ))}
          </div>

          <div className={styles.experience}>
            <div className={styles.bgPanel} />

            <div className={styles.expHeader}>
              <span className={styles.years}>7</span>
              <div className={styles.expText}>
                <span>Years of</span>
                <span>Working</span>
                <span>Experience</span>
              </div>
            </div>

            <div className={styles.callArea}>
              <a
                href="tel:+61452424565"
                className={styles.phoneIcon}
                aria-label="Call now"
              >
                <ImPhone />
              </a>
              <a href="tel:+61452424565" className={styles.callNow}>
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
