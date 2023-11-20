import React, {  useState } from "react"

import { ContactSection } from '../styles/contactStyles'
import { Container, H2 } from '../styles/globalStyles'
import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa'
import { SiGmail } from 'react-icons/si'

import { ExternalLink } from 'react-external-link';

const Contact = () => {

    const [flag, setflag] = useState(false)


        document.addEventListener('scroll', scrolled)

        function scrolled() {

            const secRef = document.getElementById('contact')

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

        <ContactSection id="contact" style={{ background: `url(/images/footer-bg.png)` }} className={flag && 'active'} >

            <Container>

                <div className="social">
                    <H2>Contact</H2>

                    <ExternalLink className='fb' href="https://www.facebook.com/bivek.tamu.5">
                        <FaFacebook />
                    </ExternalLink>

                    <ExternalLink className='gmail' href="mailto:bivek.tamu@gmail.com">
                        <SiGmail />
                    </ExternalLink>

                    <ExternalLink className='linkedin' href="https://www.linkedin.com/in/bivek-gurung-b4602a62/">
                        <FaLinkedin />
                    </ExternalLink>

                    <ExternalLink className='github' href="https://github.com/bivektamu/">
                        <FaGithub />
                    </ExternalLink>
                </div>
            </Container>
        </ContactSection >
    )

}
export default Contact
