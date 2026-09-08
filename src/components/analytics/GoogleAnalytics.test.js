// covers: AC-1 — production only; AC-2 — script loading; AC-3 — initial page
// view; AC-4 — route change page views; AC-5 — configurable measurement ID;
// AC-6 — graceful degradation; AC-7 — no duplicate first page view.
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import React from "react";

const { pathnameMock, scriptMock } = vi.hoisted(() => {
  const pathnameMock = vi.fn(() => "/");
  const scriptMock = vi.fn(() => null);
  return { pathnameMock, scriptMock };
});

vi.mock("next/script", () => ({
  default: (props) => {
    scriptMock(props);
    return null;
  },
}));

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameMock(),
}));

import GoogleAnalytics from "./GoogleAnalytics";

const FALLBACK_ID = "G-V9W1PD2NDW";
const gtagUrl = (id) => `https://www.googletagmanager.com/gtag/js?id=${id}`;

function renderInProduction(env = {}) {
  vi.stubEnv("NODE_ENV", "production");
  Object.entries(env).forEach(([key, value]) => vi.stubEnv(key, value));
  const gtagSpy = vi.fn();
  window.gtag = gtagSpy;
  const utils = render(React.createElement(GoogleAnalytics));
  return { ...utils, gtagSpy };
}

describe("GoogleAnalytics", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    scriptMock.mockClear();
    pathnameMock.mockReset();
    pathnameMock.mockReturnValue("/");
    delete window.gtag;
    delete window.dataLayer;
  });

  // ── AC-1: Production only ──
  describe("AC-1: Production only", () => {
    it("injects no script and tracks nothing outside production", () => {
      // vitest runs with NODE_ENV "test" unless stubbed.
      render(React.createElement(GoogleAnalytics));
      expect(scriptMock).not.toHaveBeenCalled();
      expect(window.gtag).toBeUndefined();
      expect(window.dataLayer).toBeUndefined();
    });
  });

  // ── AC-2: Script loading ──
  describe("AC-2: Script loading", () => {
    it("renders the external gtag.js script afterInteractive with the fallback id", () => {
      renderInProduction();
      expect(scriptMock).toHaveBeenCalledTimes(2);

      const srcProps = scriptMock.mock.calls[0][0];
      expect(srcProps.id).toBe("google-analytics");
      expect(srcProps.strategy).toBe("afterInteractive");
      expect(srcProps.src).toBe(gtagUrl(FALLBACK_ID));
    });

    it("renders the inline boot script with send_page_view disabled", () => {
      renderInProduction();
      const bootProps = scriptMock.mock.calls[1][0];
      expect(bootProps.id).toBe("google-analytics-init");
      expect(bootProps.strategy).toBe("afterInteractive");
      const bootCode = bootProps.dangerouslySetInnerHTML.__html;
      expect(bootCode).toContain("window.dataLayer = window.dataLayer || []");
      expect(bootCode).toContain(`gtag('config', '${FALLBACK_ID}', { send_page_view: false })`);
      expect(bootCode).toContain("gtag('js', new Date())");
    });
  });

  // ── AC-3 + AC-4 + AC-7: page views ──
  describe("Page views", () => {
    it("sends exactly one page view for the landing route", () => {
      const { gtagSpy } = renderInProduction();
      expect(gtagSpy).toHaveBeenCalledTimes(1);
      expect(gtagSpy).toHaveBeenCalledWith("config", FALLBACK_ID, {
        page_path: "/",
      });
    });

    it("sends a page view on every client side navigation", () => {
      const { gtagSpy, rerender } = renderInProduction();
      expect(gtagSpy).toHaveBeenCalledTimes(1);

      pathnameMock.mockReturnValue("/about");
      act(() => rerender(React.createElement(GoogleAnalytics)));

      expect(gtagSpy).toHaveBeenCalledTimes(2);
      expect(gtagSpy).toHaveBeenLastCalledWith("config", FALLBACK_ID, {
        page_path: "/about",
      });

      pathnameMock.mockReturnValue("/projects");
      act(() => rerender(React.createElement(GoogleAnalytics)));

      expect(gtagSpy).toHaveBeenCalledTimes(3);
      expect(gtagSpy).toHaveBeenLastCalledWith("config", FALLBACK_ID, {
        page_path: "/projects",
      });
    });

    it("includes the query string in the page path", () => {
      window.history.replaceState(null, "", "/?utm_source=test");
      const { gtagSpy } = renderInProduction();
      expect(gtagSpy).toHaveBeenLastCalledWith("config", FALLBACK_ID, {
        page_path: "/?utm_source=test",
      });
      window.history.replaceState(null, "", "/");
    });
  });

  // ── AC-5: Configurable measurement ID ──
  describe("AC-5: Configurable measurement ID", () => {
    it("uses NEXT_PUBLIC_GA_MEASUREMENT_ID when set", () => {
      const { gtagSpy } = renderInProduction({
        NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-TEST123",
      });
      expect(gtagSpy).toHaveBeenCalledWith("config", "G-TEST123", {
        page_path: "/",
      });
      expect(scriptMock.mock.calls[0][0].src).toBe(gtagUrl("G-TEST123"));
      expect(scriptMock.mock.calls[1][0].dangerouslySetInnerHTML.__html).toContain(
        "gtag('config', 'G-TEST123', { send_page_view: false })"
      );
    });
  });

  // ── AC-6: Graceful degradation ──
  describe("AC-6: Graceful degradation", () => {
    it("does not error when gtag is missing and queues commands instead", () => {
      vi.stubEnv("NODE_ENV", "production");
      // No window.gtag preset: the component installs its own dataLayer shim.
      expect(() => render(React.createElement(GoogleAnalytics))).not.toThrow();
      expect(window.dataLayer).toHaveLength(1);
    });
  });
});
