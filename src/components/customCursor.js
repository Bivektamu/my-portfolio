import React, { useEffect, useState, useContext, useRef } from "react";

import { Cursor } from "../styles/cursorStyles";

import GlobalContext from "../context";

const CustomCursor = () => {
  const { settings } = useContext(GlobalContext);

  
const [cursor, setCursor] = useState({
    x: 0,
    y: 0,
  })
  
  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  });

  const [diff, setDiff] = useState({
    x: 0,
    y: 0,
  });

  
  useEffect(() => {
    window.addEventListener("mousemove", mousePosition);

    function mousePosition(e) {
      if (window.innerWidth > 999) {
        setMouse( { x: e.clientX, y: e.clientY })
      }
    }

    return () => {
      window.removeEventListener("mousemove", mousePosition);
    };
  }, []);

  useEffect(() => {
      const diffX = mouse.x - cursor.x;
      const diffY = mouse.y - cursor.y;
      setDiff({ x: diffX, y: diffY });
  }, [mouse.x, mouse.y, cursor.x, cursor.y]);

  useEffect(() => {
    requestAnimationFrame(() => {
        if(diff.x !== 0 || diff.y !== 0) {
            setCursor(prev=> ({ x: prev.x + diff.x * 0.07, y: prev.y + diff.y * 0.07 }));
        }

    });
  }, [diff.x, diff.y])

  const { x, y } = cursor;

  return (
    <Cursor
      id="custom_cursor"
      className={` ${settings.cursor}`}
      style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}
    />
  );
};

export default CustomCursor;
