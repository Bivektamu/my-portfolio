import About from "@/components/sections/About";
import SiteFrame from "@/components/layout/SiteFrame";

export const metadata = {
  title: "About | Bivek Gurung",
  description: "Learn more about Bivek Gurung, a front end developer with 7 years of experience.",
};

export default function AboutPage() {
  return (
    <SiteFrame>
      <About />
    </SiteFrame>
  );
}
