import { Container, Flex, H2 } from "../styles/globalStyles";
import { AboutSection } from "../styles/aboutStyles";
import { useScroll, useTransform, motion } from "motion/react";
import { useRef } from "react";

const About = () => {
  
      const targetRef = useRef(null)
      const {scrollYProgress} = useScroll({
          target: targetRef,
          offset:["start end", "end start"]
      })
  

  const yText = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const yImage = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  return (
    <AboutSection id="about" ref={targetRef}>
      <Container>
        <Flex className="row__reverse">
          <motion.div className="grid__6 site__title" style={{ y: yText }}>
            <H2 style={{ marginBottom: "20px" }}>LET ME INTRODUCE MYSELF</H2>
            <p style={{ width: "70%" }}>
              Hi, I am Bivek. I am a front end developer with 7 years of
              extensive professional experience and skills in React, Redux
              Toolkit, React Context API, Rest API, TypeScript, JavaScript,
              jQuery, WordPress, PHP, HTML5, CSS3, SASS, LESS, etc.{" "}
              {/* I believe anything can be overcome through commitment and hardwork. Always up for learning new things. */}
            </p>
            <br />

            {/* <Btn>
                <ExternalLink href="/pdf/Bivek_Gurung_Resume.pdf">
                    My Resume
                </ExternalLink>
            </Btn> */}
          </motion.div>

          <motion.div style={{ y: yImage }} className="grid__6 about-image">
            <img src="/images/banner2.svg" alt="" />
          </motion.div>
        </Flex>
      </Container>
    </AboutSection>
  );
};

export default About;
