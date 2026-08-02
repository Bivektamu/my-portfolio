import { Poppins } from "next/font/google";
import Header from "@/components/header/Header";
import CustomCursor from "@/components/cursor/CustomCursor";
import Preloader from "@/components/preloader/Preloader";
import ScrollSpy from "@/components/animations/ScrollSpy";
import NoiseOverlay from "@/components/animations/NoiseOverlay";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

const SECTION_IDS = ["home", "about", "project", "skill", "contact"];

export const metadata = {
  title: "Bivek | Bivek Jang Gurung | Bivek Portfolio",
  description: "This is a portfolio website for Bivek Jang Gurung.",
  authors: [{ name: "Bivek Jang Gurung" }],
  icons: {
    icon: "/images/fav.png",
  },
  openGraph: {
    title: "Bivek | Portfolio",
    description: "Front end developer with 7 years of experience.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU" className={poppins.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <Preloader>
          <ScrollSpy sectionIds={SECTION_IDS}>
            <Header />
            <CustomCursor />
            <NoiseOverlay />
            <main>{children}</main>
          </ScrollSpy>
        </Preloader>
      </body>
    </html>
  );
}
