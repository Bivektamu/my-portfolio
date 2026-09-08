"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

const FALLBACK_GA_MEASUREMENT_ID = "G-V9W1PD2NDW";

// Read lazily so tests can stub the variable after import.
function measurementId() {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || FALLBACK_GA_MEASUREMENT_ID;
}

export default function GoogleAnalytics() {
  const pathname = usePathname();

  // Send one page view for the landing route and one for every client side
  // navigation. gtag.js is loaded after first paint, so queue through the
  // dataLayer shim until the real gtag exists (blocked scripts degrade to no
  // tracking, never to errors).
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    if (typeof window.gtag !== "function") {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
    }

    window.gtag("config", measurementId(), {
      page_path: pathname + window.location.search,
    });
  }, [pathname]);

  // AC-1: tracking scripts exist only in production builds.
  if (process.env.NODE_ENV !== "production") return null;

  const id = measurementId();

  return (
    <>
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}', { send_page_view: false });`,
        }}
      />
    </>
  );
}
