import React, { useState } from "react"

import { Container, Flex, H2, Btn } from "../styles/globalStyles"
import { AboutSection } from "../styles/aboutStyles"

import { ExternalLink } from 'react-external-link'


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
              Hi, I am Bivek. I am a front end developer with 7 years of extensive professional experience and skills in React, Redux Toolkit, React Context API, Rest API, TypeScript, JavaScript, jQuery, WordPress, PHP, HTML5, CSS3, SASS, LESS, etc.              {/* I believe anything can be overcome through commitment and hardwork. Always up for learning new things. */}
            </p>
            <br />
            <Btn>
                {/* setSettings */}
                <ExternalLink href="/pdf/Bivek_Gurung_Resume.pdf">
                    My Resume
                </ExternalLink>
            </Btn>
          </div>

          <div className="grid__6 about-image">
            <img src="/images/banner2.svg" alt="" />
            
          </div>

        </Flex>
      </Container>

    </AboutSection>


  )
}


export default About
