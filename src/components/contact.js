import { ContactSection } from '../styles/contactStyles'
import { Container, H2 } from '../styles/globalStyles'
import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa'
import { SiGmail } from 'react-icons/si'

import { ExternalLink } from 'react-external-link';

const Contact = () => {


    return (

        <ContactSection id="contact" style={{ background: `url(/images/footer-bg.png)` }} >

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
