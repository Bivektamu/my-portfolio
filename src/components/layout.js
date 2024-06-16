import React, { useState, useMemo, useEffect } from "react";

import Header from "./Header";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "../styles/globalStyles";

import CustomCursor from "../components/customCursor";

import GlobalContext from "../context";

const Layout = ({ children }) => {
  const [settings, setSettings] = useState({
    cursor: "",
    loading: true,
    theme:
      typeof window !== "undefined"
        ? localStorage.getItem("theme") || "light"
        : "light",
  });
  const [windowReady, setWindowReady] = useState(false);

  const { theme, loading } = settings;

  useEffect(() => {
    window.addEventListener("load", loaded);
    return () => {
      window.removeEventListener("load", loaded);
    };
  }, []);

  useEffect(() => {
    if (!theme) {
      localStorage.setItem("theme", "light");
      setSettings({ ...settings, theme: localStorage.getItem("theme") });
    } else {
      localStorage.setItem("theme", theme);
    }
  }, [theme, settings]);

  useEffect(() => {
    if (loading || !windowReady) return;

    const flag = preloader();

    const sections = document.querySelectorAll("main > section");
    let navItems = document.querySelectorAll("#nav > li");

    if (flag) document.addEventListener("scroll", scrolled);

    function scrolled() {
      const headerHeight = document
        .getElementById("header")
        .getBoundingClientRect().height;

      if (window.scrollY > 0) {
        document.getElementById("header")?.classList.add("fixed");
      } else {
        document.getElementById("header")?.classList.remove("fixed");
      }

      if (!navItems) {
        console.log("asdf");
        navItems = document.querySelectorAll("#nav > li");
      }

      for (let i = 0; i < sections.length; i++) {
        if (
          sections[i].getBoundingClientRect().top <= headerHeight &&
          sections[i].getBoundingClientRect().bottom >= headerHeight &&
          sections[i].classList.value.indexOf("active") < 0
        ) {
          const activeSec = document.querySelector("main  section.active");
          activeSec && activeSec.classList.remove("active");
          sections[i].classList.add("active");
          document
            .querySelector("#nav  > li.active")
            ?.classList.remove("active");
          console.log(navItems[i]);
          navItems[i]?.classList.add("active");
        }
      }
    }
    return () => {
      document.removeEventListener("scroll", scrolled);
    };
  }, [windowReady, loading]);

  function loaded() {
    setWindowReady(true);
  }

  function preloader() {
    const blob = document.getElementById("blob");
    const bannerHeadings = document.querySelectorAll("#hire-btn .wow");

    setTimeout(() => {
      bannerHeadings[0].classList.add("animated");
      bannerHeadings[1].classList.add("animated");
    }, 500);

    setTimeout(() => {
      blob.classList.remove("scale");
    }, 1000);

    setTimeout(() => {
      blob.classList.add("animate");
    }, 1600);

    setTimeout(() => {
      document.getElementById("header")?.classList.remove("hide");
    }, 1800);

    setTimeout(() => {
      document.querySelector("body")?.classList.add("loaded");
    }, 2000);
    return true
  }

  const darkTheme = {
    color: "#fff",
    background: "#24292F",
    boxShadow: "0px 10px 30px rgb(0 0 0 / 50%)",
    borderColor: "rgba(225, 225, 225, 0.1)",
  };

  const lightTheme = {
    background: "#fff",
    color: "#24292F",
    borderColor: "#201f1f17",
    boxShadow: "0px 10px 30px rgb(57 56 61 / 21%)",
  };

  const value = useMemo(() => ({ settings, setSettings }), [settings]);

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <GlobalContext.Provider value={value}>
        <GlobalStyles />
        <Header />
        <CustomCursor />

        <main>{children}</main>
      </GlobalContext.Provider>
    </ThemeProvider>
  );
};

export default Layout;
