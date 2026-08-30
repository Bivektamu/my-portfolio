import Skills from "@/components/sections/Skills";
import SiteFrame from "@/components/layout/SiteFrame";

export const metadata = {
  title: "Skills | Bivek Gurung",
  description: "Bivek Gurung's technical skills and expertise in front end development.",
};

export default function SkillsPage() {
  return (
    <SiteFrame>
      <Skills />
    </SiteFrame>
  );
}
