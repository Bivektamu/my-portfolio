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
                    setCordPos({ x: e.clientX, y: e.clientY })
            }
        }

        return () => { window.removeEventListener('mousemove', mousePosition) }
    }, [])

    useEffect(() => {
        console.log(settings)
    }, [settings])


    const { x, y } = cordPos
    return (
        <Cursor id="custom_cursor" className={`${settings.cursor}`} style={{ transform: `translate3d(${x}px, ${y}px, 0)` }} />
    )
}

export default CustomCursor
