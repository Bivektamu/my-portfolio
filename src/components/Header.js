import React, { useEffect, useState, useContext } from "react";

import { FaMobileAlt } from "react-icons/fa";

import { Container } from "../styles/globalStyles";
import { HeaderWrapper, Logo, NavMenu } from "../styles/headerStyles";

import NavItem from "./NavItem";

import GlobalContext from "../context/";

const Header = () => {
  const [activeNav, setActiveNav] = useState(false);
  const [navItems, setNavItems] = useState(null);

  const [sections, setSections] = useState([]);

  const { settings, setSettings } = useContext(GlobalContext);

  const {loading} = settings


  useEffect(() => {
    const secs = document.querySelectorAll("main > section");

    setSections(Array.prototype.slice.call(secs));
  }, []);

  useEffect(() => {
    if (sections.length > 0) {

      let tempNavItems = sections.map((sec, index) => {
        const secId = sec.getAttribute("id");
        if (secId) {
          return (
            <NavItem
              key={index}
              index={index}
              max={sections.length}
              anchorTo={secId}
              setActiveNav={() => setActiveNav()}
              activeNav={activeNav}
            />
          );
        } else {
          return "";
        }
      });

      setNavItems([...tempNavItems]);
    }
    // eslint-disable-next-line
  }, [sections]);

  function changeTheme() {
    const { theme } = settings;
    setSettings({ ...settings, theme: theme === "light" ? "dark" : "light" });
  }

  return (
    <HeaderWrapper
      id="header"
      className={`header ${loading? "hide" : ""}  ${
        activeNav ? "activeNav" : ""
      }`}
    >
      <Container>
        <Logo>
          <p>BIV</p>

          <span
            onMouseEnter={() => {
              setSettings({ ...settings, cursor: "hovered border__red" });
            }}
            onMouseLeave={() => {
              setSettings({
                ...settings,
                cursor: "",
              });
            }}
            onClick={() => changeTheme()}
          ></span>

          <p> EK</p>
        </Logo>

        <a
          className="nav-link hvr-buzz-out tel mob"
          id="mob-tel"
          href="tel:+61452424565"
        >
          <FaMobileAlt />
        </a>

        <button
          id="nav__toggle"
          type="button"
          onClick={() => setActiveNav(!activeNav)}
        >
          <span></span>
        </button>

        <NavMenu>
          <ul id="nav">
            {navItems && navItems}
            <li className="desk">
              <a
                className="nav-link hvr-buzz-out tel"
                id="mob-tel"
                href="tel:+61452424565"
              >
                <FaMobileAlt />
              </a>
            </li>
          </ul>
        </NavMenu>
      </Container>
    </HeaderWrapper>
  );
};

export default Header;
