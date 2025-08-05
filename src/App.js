import "./App.css";
import About from "./components/about";
import Banner from "./components/banner";
import Layout from "./components/layout";
import Project from "./components/project";
import Skill from "./components/skill";
import Contact from "./components/contact";
import Seo from "./components/seo";
import Blob from "./components/Blob";
import TagManager from "react-gtm-module";

function App() {

  const tagManagerArgs = {
    gtmId: process.env.REACT_APP_GTM_ID,
  };

  TagManager.initialize(tagManagerArgs);

  return (
    <Layout>
      <Seo
        description="This is a portfolio website for Bivek Jang Gurung."
        lang="eng-Au"
        meta=""
        title="Bivek | Bivek Jang Gurung | Bivek Portfolio"
        author="Bivek Jang Gurung"
      />
      <Blob />
      <Banner />
      <About />
      <Project />
      <Skill />
      <Contact />
    </Layout>
  );
}

export default App;
