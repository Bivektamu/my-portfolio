import React, { useContext } from "react";

import { Btn, Container, Flex, H2, H5 } from "../styles/globalStyles";
import { ProjectSection, ImageWrapper } from "../styles/projectStyles";

// import { AiFillGithub } from "react-icons/ai";
import { FaLink } from "react-icons/fa";
import { SiNpm } from "react-icons/si";

import GlobalContext from "../context";

import { ExternalLink } from "react-external-link";

const Project = () => {
  const { settings, setSettings } = useContext(GlobalContext);

  return (
    <ProjectSection id="project">
      <Container>
        <H2 style={{ marginBottom: "50px" }}>PROJECTS</H2>

        <Flex className="flex__wrap">
          <div className="grid__4">
            <ImageWrapper>
              <img src="/images/portfolio/la.jpg" alt="" className="img" />

              <ExternalLink
                className="link-wrapper"
                target="_blank"
                rel="noreferrer"
                href="https://www.lapropertyco.com.au/"
              >
                &nbsp;
              </ExternalLink>
            </ImageWrapper>
            <H5 style={{ marginTop: "16px" }}>La Property Co</H5>
          </div>

          <div className="grid__4">
            <ImageWrapper>
              <img src="/images/portfolio/carbon.jpg" alt="" className="img" />

              <div>
                <ExternalLink
                  className="link-wrapper"
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.carbon8.com.au/"
                >
                  &nbsp;
                </ExternalLink>
              </div>
            </ImageWrapper>
            <H5 style={{ marginTop: "16px" }}>Carbon 8</H5>
          </div>

          <div className="grid__4">
            <ImageWrapper>
              <img
                src="/images/portfolio/restaurant.jpg"
                className="img"
                alt=""
              />

              <ExternalLink
                className="link-wrapper"
                target="_blank"
                rel="noreferrer"
                href="https://restaurantapp.netlify.app/"
              >
                &nbsp;
              </ExternalLink>
            </ImageWrapper>
            <H5 style={{ marginTop: "16px" }}>RESTAURANT WEB APP</H5>
          </div>
        </Flex>
      </Container>
      <br />
      <br />
      <br />
      <br />
      <br />
      <Container>
        <H2 style={{ marginBottom: "50px" }}>NPM LIBRARIES</H2>

        <Flex className="flex__wrap">
          <div className="grid__4">
            <ImageWrapper>
              <img
                src="/images/portfolio/fancyslider.jpg"
                className="img"
                alt=""
              />

              <div className="link-wrapper">
                <Btn>
                  <ExternalLink
                    onMouseEnter={() =>
                      setSettings({ ...settings, cursor: "hovered" })
                    }
                    onMouseLeave={() =>
                      setSettings({ ...settings, cursor: "" })
                    }
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.npmjs.com/package/react-fancyslider"
                  >
                    NPM Link&nbsp;&nbsp;
                    <SiNpm />
                  </ExternalLink>
                </Btn>

                <Btn>
                  <ExternalLink
                    onMouseEnter={() =>
                      setSettings({ ...settings, cursor: "hovered" })
                    }
                    onMouseLeave={() =>
                      setSettings({ ...settings, cursor: "" })
                    }
                    target="_blank"
                    rel="noreferrer"
                    href="https://fancysliderdemo.netlify.app/"
                  >
                    View Live&nbsp;&nbsp;
                    <FaLink />
                  </ExternalLink>
                </Btn>
              </div>
            </ImageWrapper>
            <H5 style={{ marginTop: "16px" }}>Fancyslider Library</H5>
          </div>

          <div className="grid__4">
            <ImageWrapper>
              <img
                src="/images/portfolio/odometer.jpg"
                className="img"
                alt=""
              />

              <div className="link-wrapper">
                <Btn>
                  <ExternalLink
                    onMouseEnter={() =>
                      setSettings({ ...settings, cursor: "hovered" })
                    }
                    onMouseLeave={() =>
                      setSettings({ ...settings, cursor: "" })
                    }
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.npmjs.com/package/react-simple-odometer"
                  >
                    NPM Link&nbsp;&nbsp;
                    <SiNpm />
                  </ExternalLink>
                </Btn>

                <Btn>
                  <ExternalLink
                    onMouseEnter={() =>
                      setSettings({ ...settings, cursor: "hovered" })
                    }
                    onMouseLeave={() =>
                      setSettings({ ...settings, cursor: "" })
                    }
                    target="_blank"
                    rel="noreferrer"
                    href="https://simpleodometerdemo.netlify.app/"
                  >
                    View Live&nbsp;&nbsp;
                    <FaLink />
                  </ExternalLink>
                </Btn>
              </div>
            </ImageWrapper>
            <H5 style={{ marginTop: "16px" }}>Odometer Library</H5>
          </div>

          <div className="grid__4">
            <ImageWrapper>
              <img
                src="/images/portfolio/ticker_tape.jpg"
                className="img"
                alt=""
              />

              <div className="link-wrapper">
                <Btn>
                  <ExternalLink
                    onMouseEnter={() =>
                      setSettings({ ...settings, cursor: "hovered" })
                    }
                    onMouseLeave={() =>
                      setSettings({ ...settings, cursor: "" })
                    }
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.npmjs.com/package/react-ticker-tape"
                  >
                    NPM Link&nbsp;&nbsp;
                    <SiNpm />
                  </ExternalLink>
                </Btn>

                <Btn>
                  <ExternalLink
                    onMouseEnter={() =>
                      setSettings({ ...settings, cursor: "hovered" })
                    }
                    onMouseLeave={() =>
                      setSettings({ ...settings, cursor: "" })
                    }
                    target="_blank"
                    rel="noreferrer"
                    href="https://tickertapedemo.netlify.app/"
                  >
                    View Live&nbsp;&nbsp;
                    <FaLink />
                  </ExternalLink>
                </Btn>
              </div>
            </ImageWrapper>
            <H5 style={{ marginTop: "16px" }}>Fancyslider Library</H5>
          </div>
        </Flex>
      </Container>
    </ProjectSection>
  );
};

export default Project;
