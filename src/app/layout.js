import { Fira_Code, Inter } from "next/font/google";
import Header from "@/components/header/Header";
import CustomCursor from "@/components/cursor/CustomCursor";
import PageTransition from "@/components/animations/PageTransition";
import NoiseOverlay from "@/components/animations/NoiseOverlay";
import "./globals.css";

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-fira-code",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

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
    <html lang="en-AU" className={`${firaCode.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header />
        <CustomCursor />
        <NoiseOverlay />
        <PageTransition>
          <main id="main-content">{children}</main>
        </PageTransition>
      </body>
    </html>
  );
}
