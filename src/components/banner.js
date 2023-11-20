import React, { useEffect, useState, useContext } from "react"

import { Container, Flex, H1, H3, H4, Btn } from "../styles/globalStyles"
import { BannerSection } from "../styles/bannerStyles"


import GlobalContext from "../context"

import { ExternalLink } from 'react-external-link'



const Banner = () => {

    const { settings, setSettings } = useContext(GlobalContext)


    const [flag, setflag] = useState(true)

    const { loading } = settings

    useEffect(() => {

        const secRef = document.getElementById('home')
        const indexOfSec = (Array.from(secRef.parentNode.children).indexOf(secRef))

        const nav = document.getElementById('nav')

        const navItem = (nav.childNodes[indexOfSec])


        document.addEventListener('scroll', scrolled)

        function scrolled() {

            const secTop = secRef.offsetTop
            const secH = secRef.getBoundingClientRect().height
            const headerH = document.getElementById('header').getBoundingClientRect().height
            const scrolledVal = window.scrollY + headerH

            if (scrolledVal > secTop && scrolledVal < secTop + secH) {
                setflag(true)
                navItem.classList.add('active')

            }
            else {
                setflag(false)
                navItem.classList.remove('active')

            }

        }


        return () => { document.removeEventListener('scroll', scrolled) }

    }, [loading])


    return (


        <BannerSection id="home" className={flag && 'active'}>

            <Container id="hire-btn">
                <Flex>
                    <div className="grid__6 site__title">
                        <H3>Hey</H3>
                        <H1>I am Bivek</H1>
                        <H4 style={{ marginBottom: "40px" }}>Front End Developer</H4>
                        <Btn>
                            {/* setSettings */}
                            <ExternalLink
                                onMouseEnter={() => setSettings({ ...settings, cursor: 'hovered' })}
                                onMouseLeave={() => setSettings({ ...settings, cursor: '' })}
                                href="tel:0452424565">
                                hire me
                            </ExternalLink>
                        </Btn>
                    </div>

                    <div className="grid__6 banner-image">
                        <img src="/images/banner-image.png" alt="banner" />
                    </div>
                </Flex>
            </Container>

        </BannerSection>


    )
}


export default Banner
