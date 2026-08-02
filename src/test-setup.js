// ── Common mocks for all component tests ──
import { vi } from "vitest";
import React from "react";

// ── next/font/google ──
vi.mock("next/font/google", () => ({
  Fira_Code: (opts) => ({
    variable: (opts && opts.variable) || "--font-fira-code",
    className: "fira-code-mock",
    style: { fontFamily: "'Fira Code', monospace" },
  }),
  Inter: (opts) => ({
    variable: (opts && opts.variable) || "--font-inter",
    className: "inter-mock",
    style: { fontFamily: "Inter, sans-serif" },
  }),
}));

// ── next/link ──
vi.mock("next/link", () => ({
  default: ({ children, href, className, ...props }) =>
    React.createElement("a", { href, className, ...props }, children),
}));

// ── next/image ──
vi.mock("next/image", () => ({
  default: (props) => React.createElement("img", { alt: props.alt || "", ...props }),
}));

// ── motion/react ──
vi.mock("motion/react", () => {
  function makeMotion(tag) {
    var Comp = function Comp(props) {
      var children = props.children, style = props.style, className = props.className;
      var rest = {};
      var skipKeys = { children: 1, style: 1, className: 1, variants: 1, initial: 1, whileInView: 1, viewport: 1, animate: 1, transition: 1 };
      for (var k in props) { if (!skipKeys[k]) rest[k] = props[k]; }
      return React.createElement(tag, Object.assign({ style: style, className: className }, rest), children);
    };
    Comp.displayName = "motion." + tag;
    return Comp;
  }

  return {
    useScroll: function () { return { scrollY: { get: function () { return 0; } }, scrollYProgress: { get: function () { return 0; } } }; },
    useTransform: function () { return { get: function () { return 0; } }; },
    motion: {
      div: makeMotion("div"),
      p: makeMotion("p"),
      span: makeMotion("span"),
      h1: makeMotion("h1"),
      h2: makeMotion("h2"),
      h3: makeMotion("h3"),
      button: makeMotion("button"),
      section: makeMotion("section"),
      a: makeMotion("a"),
      li: makeMotion("li"),
      ul: makeMotion("ul"),
    },
  };
});

// ── react-icons/fi ──
vi.mock("react-icons/fi", () => ({
  FiGithub: function (props) { return React.createElement("span", Object.assign({ "data-testid": "icon-github" }, props), "GH"); },
  FiLinkedin: function (props) { return React.createElement("span", Object.assign({ "data-testid": "icon-linkedin" }, props), "LI"); },
  FiMail: function (props) { return React.createElement("span", Object.assign({ "data-testid": "icon-mail" }, props), "MAIL"); },
  FiTwitter: function (props) { return React.createElement("span", Object.assign({ "data-testid": "icon-twitter" }, props), "TW"); },
}));

// ── react-icons/fa ──
vi.mock("react-icons/fa", () => ({
  FaLink: function (props) { return React.createElement("span", Object.assign({ "data-testid": "icon-fa-link" }, props), "LINK"); },
}));

// ── react-icons/si ──
vi.mock("react-icons/si", () => ({
  SiNpm: function (props) { return React.createElement("span", Object.assign({ "data-testid": "icon-si-npm" }, props), "NPM"); },
}));

// ── react-icons/im ──
vi.mock("react-icons/im", () => ({
  ImPhone: function (props) { return React.createElement("span", Object.assign({ "data-testid": "icon-im-phone" }, props), "PHONE"); },
}));
