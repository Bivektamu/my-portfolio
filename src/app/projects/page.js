import Projects from "@/components/sections/Projects";
import SiteFrame from "@/components/layout/SiteFrame";

export const metadata = {
  title: "Projects | Bivek Gurung",
  description: "Explore Bivek Gurung's portfolio of front end development projects.",
};

export default function ProjectsPage() {
  return (
    <SiteFrame>
      <Projects />
    </SiteFrame>
  );
}
