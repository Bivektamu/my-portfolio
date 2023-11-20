import React, { useContext, useEffect } from 'react'
import GlobalContext from "../context"

const NavItem = ({ anchorTo, index, max, activenav, setActiveNav }) => {
    const { settings, setSettings } = useContext(GlobalContext)

    useEffect(() => {
        if (index === max - 1) {
            setSettings({ ...settings, loading: false })
        }

    }, [])


    const onClick = (e) => {
        e.preventDefault()

        const item = (e.target)

        const anchor = (item.getAttribute('data-anchor'))

        const sec = document.getElementById(anchor)

        setActiveNav(!activenav)

        window.scrollTo({
            top: sec.offsetTop - document.getElementById('header').getBoundingClientRect().height,
            behavior: 'smooth'
        });
    }

    return (
        <li className={(anchorTo === 'home') ? "active" : ''}>

            <a to={`#${anchorTo}`} className="nav-link" data-anchor={anchorTo} onClick={(e) => onClick(e)}
                onMouseEnter={() => setSettings({ ...settings, cursor: 'hovered' })}
                onMouseLeave={() => setSettings({ ...settings, cursor: '' })}
            >{anchorTo}</a>

        </li>

    )
}

export default NavItem
