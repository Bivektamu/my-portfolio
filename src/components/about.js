import React, { useState } from "react"

import { Container, Flex, H2 } from "../styles/globalStyles"
import { AboutSection } from "../styles/aboutStyles"


const About = () => {

  const [flag, setflag] = useState(false)

    document.addEventListener('scroll', scrolled)

    
    function scrolled() {
      const secRef = document.getElementById('about')

      const indexOfSec = (Array.from(secRef.parentNode.children).indexOf(secRef))
  
      const nav = document.getElementById('nav')
      const navItem = (nav.childNodes[indexOfSec])
  
      const headerH = document.getElementById('header').getBoundingClientRect().height
  
  
      const secTop = secRef.offsetTop
      const secH = secRef.getBoundingClientRect().height

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


  const classNm = flag ? 'active' : ''

  return (

    <AboutSection id='about' className={classNm}>

      <Container>
        <Flex className="row__reverse">

          <div className="grid__6 site__title">
            <H2 style={{ marginBottom: "20px" }}>LET ME INTRODUCE MYSELF</H2>
            <p style={{ width: "70%" }}>
              6+ years of extensive professional experience and skills in HTML5, CSS3, SASS/SCSS, less, React.js, e.t.c. and specializing in PSD to HTML5 semantic conversion with keen attention to details. Working knowledge of design tools such as Sketch, Illustrator and Photoshop. Currently working as a freelancer and looking for full time opportunity.<br /><br />
              I believe anything can be overcome through commitment and hardwork. Always up for learning new things.
            </p>
          </div>

          <div className="grid__6 about-image">
            <img src="../images/about-me.png" alt="" />
          </div>

        </Flex>
      </Container>

    </AboutSection>


  )
}


export default About
