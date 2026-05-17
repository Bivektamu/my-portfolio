import { useContext, useRef } from "react";
import { ContactSection } from "../styles/contactStyles";
import { Container, H2 } from "../styles/globalStyles";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { ExternalLink } from "react-external-link";
import { useScroll, useTransform, motion } from "motion/react";

import GlobalContext from "../context";

const Contact = () => {
  const { settings, setSettings } = useContext(GlobalContext);


  
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 195]);

  return (
    <ContactSection
    ref={targetRef}
      id="contact"
      style={{ background: `url(/images/footer-bg.png)` }}
    >
      <Container>
        <motion.div 
        style={{y}}
        className="social">
          <H2>Contact</H2>

          <ExternalLink
            onMouseEnter={() => setSettings({ ...settings, cursor: "hovered" })}
            onMouseLeave={() => setSettings({ ...settings, cursor: "" })}
            className="fb"
            href="https://github.com/Bivektamu/"
          >
            <FaGithub />
          </ExternalLink>

          <ExternalLink
            onMouseEnter={() => setSettings({ ...settings, cursor: "hovered" })}
            onMouseLeave={() => setSettings({ ...settings, cursor: "" })}
            className="gmail"
            href="mailto:bivek.tamu@gmail.com"
          >
            <SiGmail />
          </ExternalLink>

          <ExternalLink
            onMouseEnter={() => setSettings({ ...settings, cursor: "hovered" })}
            onMouseLeave={() => setSettings({ ...settings, cursor: "" })}
            className="linkedin"
            href="https://www.linkedin.com/in/bivek-gurung-b4602a62/"
          >
            <FaLinkedin />
          </ExternalLink>

          {/* <ExternalLink className='github' href="https://github.com/bivektamu/">
                        <FaGithub />
                    </ExternalLink> */}
        </motion.div>
      </Container>
    </ContactSection>
  );
};
export default Contact;
