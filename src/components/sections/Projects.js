import Image from "next/image";
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

function ProjectCard({ item }) {
  return (
    <div className={styles.card}>
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
      <p className={styles.cardTitle}>{item.title}</p>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="project" className={styles.projects}>
      <div className={styles.container}>
        <h2 className={styles.heading}>PROJECTS</h2>
        <div className={styles.grid}>
          {PROJECTS.map((project) => (
            <ProjectCard key={project.title} item={project} />
          ))}
        </div>

        <h2 className={styles.heading} style={{ marginTop: "40px" }}>
          NPM LIBRARIES
        </h2>
        <div className={styles.grid}>
          {LIBRARIES.map((lib) => (
            <ProjectCard key={lib.title} item={lib} />
          ))}
        </div>
      </div>
    </section>
  );
}
