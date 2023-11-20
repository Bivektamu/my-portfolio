import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"

import Banner from '../components/banner'
import About from "../components/about"
import Project from "../components/project"
import Skill from "../components/skill"
import Contact from "../components/contact"

const IndexPage = () => (
  <Layout>
    <Seo title="Bivek" />
    <Banner />
    <About />
    <Project />
    <Skill />
    <Contact />
  </Layout>
)

export default IndexPage
