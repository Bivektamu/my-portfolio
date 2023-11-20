import React, { useEffect, useState, useContext } from 'react'

import { Cursor } from '../styles/cursorStyles'

import GlobalContext from '../context'

const CustomCursor = () => {

    const { settings } = useContext(GlobalContext)
    const [cordPos, setCordPos] = useState({ x: 20, y: 0 })

    useEffect(() => {
        window.addEventListener('mousemove', mousePosition)

        function mousePosition(e) {

            if (window.innerWidth > 999) {
                setTimeout(() => {
                    setCordPos({ x: e.clientX, y: e.clientY })
                }, 150);
            }
        }

        return () => { window.removeEventListener('mousemove', mousePosition) }
    }, [])

    const { x, y } = cordPos
    return (
        <Cursor className={settings.cursor} style={{ left: x, top: y }} />
    )
}

export default CustomCursor
