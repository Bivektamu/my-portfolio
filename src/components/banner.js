
import { Container, Flex, H1, H3 } from "../styles/globalStyles"
import { BannerSection } from "../styles/bannerStyles"

const Banner = () => {
    return (
        <BannerSection id="home" >

            <Container id="hire-btn">
                <Flex>
                    <div className="grid__6 site__title">
                        <H3 className="wow fadeInUp">Hi there,</H3>
                        <H1 className="wow fadeInUp delay-2">I am Bivek</H1>
                        {/* <H4 style={{ marginBottom: "40px" }}>Front End Developer</H4> */}
                    </div>

                    <div className="grid__6 banner-image">
                        <img src="/images/banner1.svg" alt="banner" />
                    </div>
                </Flex>
            </Container>

        </BannerSection>


    )
}


export default Banner
