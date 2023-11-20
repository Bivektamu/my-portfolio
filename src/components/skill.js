import React, {useState } from "react"

import { Container, Flex, H2, H1, H4 } from "../styles/globalStyles"
import { SkillSection, ExperienceWrapper } from "../styles/skillStyles"

import { ImPhone } from "react-icons/im";

const Skill = () => {

  const [flag, setflag] = useState(false)




    document.addEventListener('scroll', scrolled)

    function scrolled() {

      
    const secRef = document.getElementById('skill')
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

    <SkillSection id='skill' className={flag && 'active'}>

      <Container>
        <H2 style={{ marginBottom: "50px" }}>MY SPECIALITY</H2>

        <Flex className="">
          <div className="grid__6">
            <Flex className="flex__wrap">

              <div className="grid__4">
                <div className="single__brand">
                  <img src="../images/skills/react_redux.png" alt="react + redux icon" className="skill__icon" />
                </div>
              </div>

              <div className="grid__4">
                <div className="single__brand">
                  <img src="../images/skills/javascript.png" alt="javascript icon" className="skill__icon" />
                </div>
              </div>

              <div className="grid__4">
                <div className="single__brand">
                  <img src="../images/skills/jquery.png" alt="jquery icon" className="skill__icon" />
                </div>
              </div>

              <div className="grid__4">
                <div className="single__brand">
                  <img src="../images/skills/html.png" alt="html icon" className="skill__icon" />
                </div>
              </div>

              <div className="grid__4">
                <div className="single__brand">
                  <img src="../images/skills/css.png" alt="css icon" className="skill__icon" />
                </div>
              </div>

              <div className="grid__4">
                <div className="single__brand">
                  <img src="../images/skills/sass.png" alt="sass icon" className="skill__icon" />
                </div>
              </div>


              <div className="grid__4">
                <div className="single__brand">
                  <img src="../images/skills/mongodb.png" alt="mongodb icon" className="skill__icon" />
                </div>
              </div>

              <div className="grid__4">
                <div className="single__brand">
                  <img src="../images/skills/rest.png" alt="rest icon" className="skill__icon" />
                </div>
              </div>

              <div className="grid__4">
                <div className="single__brand">
                  <img src="../images/skills/git.png" alt="git icon" className="skill__icon" />
                </div>
              </div>


            </Flex>
          </div>

          <div className="grid__6">
            <ExperienceWrapper>
              <Flex className="years__area align__top">
                <H1 className="years">6<sup>+</sup></H1>
                <H2>
                  <span>Years</span>
                  <span>Experience</span>
                  <span>Working</span>
                </H2>
              </Flex>
              <Flex className="flex__wrap call__area">

                <a href="tel:+61452424565"><ImPhone /></a>

                <div className="call__now">
                  <H4><a href="tel:+61452424565" style={{ textTransform: "uppercase" }}>Call Now</a></H4>
                </div>
              </Flex>
              <div className="bg-panel"></div>
            </ExperienceWrapper>
          </div>

        </Flex>
      </Container>

    </SkillSection>


  )
}


export default Skill
