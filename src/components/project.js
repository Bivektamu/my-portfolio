import React, {  useState, useContext } from "react"


import { Btn, Container, Flex, H2, H5 } from "../styles/globalStyles"
import { ProjectSection, ImageWrapper } from "../styles/projectStyles"

import { AiFillGithub } from "react-icons/ai"
import { FaLink, FaNpm } from "react-icons/fa";
import { SiNpm } from "react-icons/si";

import GlobalContext from "../context"

import { ExternalLink } from 'react-external-link'


const Project = () => {

  const { settings, setSettings } = useContext(GlobalContext)
  const [flag, setflag] = useState(false)

    document.addEventListener('scroll', scrolled)


    function scrolled() {
      const secRef = document.getElementById('project')

      const indexOfSec = (Array.from(secRef.parentNode.children).indexOf(secRef))
  
      const nav = document.getElementById('nav')
  
      const navItem = (nav.childNodes[indexOfSec])
      const secTop = secRef.offsetTop
      const secH = secRef.getBoundingClientRect().height
      const headerH = document.getElementById('header').getBoundingClientRect().height
      const scrolledVal = window.scrollY + headerH + 10

      if (scrolledVal > secTop && scrolledVal < secTop + secH) {
        setflag(true)
        navItem.classList.add('active')
      }
      else {
        setflag(false)
        navItem.classList.remove('active')
      }

    }


  return (

    <ProjectSection id="project" className={flag && 'active'}>

      <Container>
        <H2 style={{ marginBottom: "50px" }}>PROJECTS</H2>

        <Flex className="flex__wrap">

          <div className="grid__4">
            <ImageWrapper>
              <img src="/images/portfolio/restaurant.jpg" className="img" />

              <div className="link-wrapper">
                <Btn>
                  <ExternalLink
                    onMouseEnter={() => setSettings({ ...settings, cursor: 'hovered' })}
                    onMouseLeave={() => setSettings({ ...settings, cursor: '' })}
                    target="_blank" rel="noreferrer" href="https://github.com/Bivektamu/Restaurant-Webapp-V2">
                    View Code&nbsp;&nbsp;
                    <AiFillGithub />
                  </ExternalLink>

                </Btn>

                <Btn>
                  <ExternalLink
                    onMouseEnter={() => setSettings({ ...settings, cursor: 'hovered' })}
                    onMouseLeave={() => setSettings({ ...settings, cursor: '' })}
                    target="_blank" rel="noreferrer" href="https://restaurantapp.netlify.app/">
                    View Live&nbsp;&nbsp;
                    <FaLink />
                  </ExternalLink>
                </Btn>
              </div>

            </ImageWrapper>
            <H5 style={{ marginTop: "16px" }}>RESTAURANT WEB APP</H5>
          </div>

     
          <div className="grid__4">
            <ImageWrapper>

              <img src="/images/portfolio/estate.jpg" alt="" className="img" />

              <div className="link-wrapper">
                <Btn>
                  <ExternalLink
                    onMouseEnter={() => setSettings({ ...settings, cursor: 'hovered' })}
                    onMouseLeave={() => setSettings({ ...settings, cursor: '' })}
                    target="_blank" rel="noreferrer" href="https://github.com/Bivektamu/real-estate">
                    View Code&nbsp;&nbsp;
                    <AiFillGithub />
                  </ExternalLink>

                </Btn>

                <Btn>
                  <ExternalLink
                    onMouseEnter={() => setSettings({ ...settings, cursor: 'hovered' })}
                    onMouseLeave={() => setSettings({ ...settings, cursor: '' })}
                    target="_blank" rel="noreferrer" href="https://realestate-reactproject.netlify.app/">
                    View Live&nbsp;&nbsp;
                    <FaLink />
                  </ExternalLink>
                </Btn>
              </div>

            </ImageWrapper>
            <H5 style={{ marginTop: "16px" }}>REAL ESTATE WEB APP</H5>
          </div>

          <div className="grid__4">
            <ImageWrapper>

              <img src="/images/portfolio/eshop.jpg" alt="" className="img" />

              <div className="link-wrapper">
                <Btn>
                  <ExternalLink
                    onMouseEnter={() => setSettings({ ...settings, cursor: 'hovered' })}
                    onMouseLeave={() => setSettings({ ...settings, cursor: '' })}
                    target="_blank" rel="noreferrer" href="https://github.com/Bivektamu/eshop">
                    View Code&nbsp;&nbsp;
                    <AiFillGithub />
                  </ExternalLink>

                </Btn>

                <Btn>
                  <ExternalLink
                    onMouseEnter={() => setSettings({ ...settings, cursor: 'hovered' })}
                    onMouseLeave={() => setSettings({ ...settings, cursor: '' })}
                    target="_blank" rel="noreferrer" href="https://mobilestore-reactproject.netlify.app/">
                    View Live&nbsp;&nbsp;
                    <FaLink />
                  </ExternalLink>
                </Btn>
              </div>

            </ImageWrapper>
            <H5 style={{ marginTop: "16px" }}>MOBILE STORE WEB APP</H5>
          </div>


        </Flex>
      </Container>
<br />
      <Container>
        <H2 style={{ marginBottom: "50px" }}>NPM LIBRARIES</H2>

        <Flex className="flex__wrap">

          <div className="grid__4">
            <ImageWrapper>
              <img src="/images/portfolio/odometer.png" className="img" />

              <div className="link-wrapper">
                <Btn>
                  <ExternalLink
                    onMouseEnter={() => setSettings({ ...settings, cursor: 'hovered' })}
                    onMouseLeave={() => setSettings({ ...settings, cursor: '' })}
                    target="_blank" rel="noreferrer" href="https://www.npmjs.com/package/react-simple-odometer">
                    NPM Link&nbsp;&nbsp;
                    <SiNpm />
                  </ExternalLink>
                </Btn>

                <Btn>
                  <ExternalLink
                    onMouseEnter={() => setSettings({ ...settings, cursor: 'hovered' })}
                    onMouseLeave={() => setSettings({ ...settings, cursor: '' })}
                    target="_blank" rel="noreferrer" href="https://simpleodometerdemo.netlify.app/">
                    View Live&nbsp;&nbsp;
                    <FaLink />
                  </ExternalLink>
                </Btn>
              </div>

            </ImageWrapper>
            <H5 style={{ marginTop: "16px" }}>Odometer Library</H5>
          </div>

     


        </Flex>
      </Container>

    </ProjectSection >


  )
}


export default Project
