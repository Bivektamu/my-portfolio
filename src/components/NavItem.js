import React, { useContext, useEffect } from "react";
import GlobalContext from "../context";

const NavItem = ({ anchorTo, index, max, activenav, setActiveNav }) => {
  const { settings, setSettings, lenisRef } = useContext(GlobalContext);

  useEffect(() => {
    if (index === max - 1) {
      setSettings({ ...settings, loading: false });
    }
    // eslint-disable-next-line
  }, [index, max]);

  const onClick = (e) => {
    e.preventDefault();

    const item = e.currentTarget;

    const anchor = item.getAttribute("data-anchor");
    console.log(anchor)

    setActiveNav(!activenav);
    lenisRef?.current?.scrollTo(`#${anchor}`, {
      duration: 1.5,
      offset: -80,
    });
  };

  return (
    <li className={anchorTo === "home" ? "active" : ""}>
      <a
        href={`#${anchorTo}`}
        className="nav-link"
        data-anchor={anchorTo}
        onClick={(e) => onClick(e)}
        onMouseEnter={() => setSettings({ ...settings, cursor: "hovered" })}
        onMouseLeave={() => setSettings({ ...settings, cursor: "" })}
      >
        <span data-text={anchorTo}>{anchorTo}</span>
      </a>
    </li>
  );
};

export default NavItem;
