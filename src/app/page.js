import Banner from "@/components/sections/Banner";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import RevealOnScroll from "@/components/animations/RevealOnScroll";

export default function HomePage() {
  return (
    <>
      <Banner />
      <RevealOnScroll>
        <About />
      </RevealOnScroll>
      <RevealOnScroll>
        <Projects />
      </RevealOnScroll>
      <RevealOnScroll>
        <Skills />
      </RevealOnScroll>
      <Contact />
    </>
  );
}
