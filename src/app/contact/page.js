import Contact from "@/components/sections/Contact";
import SiteFrame from "@/components/layout/SiteFrame";

export const metadata = {
  title: "Contact | Bivek Gurung",
  description: "Get in touch with Bivek Gurung. Send a message or connect on social media.",
};

export default function ContactPage() {
  return (
    <SiteFrame>
      <Contact />
    </SiteFrame>
  );
}
