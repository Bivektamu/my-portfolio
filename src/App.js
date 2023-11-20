import "./App.css";
import About from "./components/about";
import Banner from "./components/banner";
import Layout from "./components/layout";
import Project from "./components/project";
import Skill from "./components/skill";
import Contact from "./components/contact";
import Seo from "./components/seo";

function App() {
  return (
    <Layout>
      <Seo
        description="This is a portfolio website for Bivek Jang Gurung."
        lang="eng-Au"
        meta=""
        title="Bivek | Bivek Jang Gurung | Bivek Portfolio"
        author="Bivek Jang Gurung"
      />
      <Banner />
      <About />
      <Project />
      <Skill />
      <Contact />
    </Layout>
  );
}

export default App;
