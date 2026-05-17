
import { Container, Flex, H1, H3 } from "../styles/globalStyles"
import { BannerSection } from "../styles/bannerStyles"
import { useScroll, useTransform, motion } from "motion/react"

const Banner = () => {

    const {scrollY} = useScroll()

    const yText = useTransform(scrollY, [0, 600], [0, -150]);
    const yImage = useTransform(scrollY, [0, 600], [0, 50]);
    return (
        <BannerSection id="home" >
            <Container id="hire-btn">
                <Flex>
                    <motion.div className="grid__6 site__title" 
                    style={{y: yText}}>
                        <H3 className="wow fadeInUp">Hi there,</H3>
                        <H1 className="wow fadeInUp delay-2">I am Bivek</H1>
                        {/* <H4 style={{ marginBottom: "40px" }}>Front End Developer</H4> */}
                    </motion.div>

                    <motion.div
                    style={{y: yImage}}
                    className="grid__6 banner-image">
                        <img src="/images/banner1.svg" alt="banner" />
                    </motion.div>
                </Flex>
            </Container>

        </BannerSection>


    )
}


export default Banner
