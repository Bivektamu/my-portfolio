import React, { useState, useMemo, useEffect } from "react"

import Header from "./Header"
import { ThemeProvider } from 'styled-components'
import { GlobalStyles } from '../styles/globalStyles'

import CustomCursor from '../components/customCursor'

import GlobalContext from "../context"


const Layout = ({ children }) => {

  const [settings, setSettings] = useState({
    cursor: '',
    loading: true,
    theme: typeof window !== "undefined" ? localStorage.getItem('theme') || 'light' : 'light',
  })

  const { theme } = settings


  useEffect(() => {

    if (!(theme)) {
      localStorage.setItem('theme', 'light')
      setSettings({ ...settings, theme: localStorage.getItem('theme') })
    }
    else {
      localStorage.setItem('theme', theme)
    }
  }, [theme])



  const darkTheme = {
    color: '#fff',
    background: '#24292F',
    boxShadow: '0px 10px 30px rgb(0 0 0 / 50%)',
    borderColor: 'rgba(225, 225, 225, 0.1)'
  }

  const lightTheme = {
    background: '#fff',
    color: '#24292F',
    borderColor: '#201f1f17',
    boxShadow: '0px 10px 30px rgb(57 56 61 / 21%)'

  }

  const value = useMemo(
    () => ({ settings, setSettings }),
    [settings]
  )


  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalContext.Provider value={value}>

        <GlobalStyles />
          <Header />
        <CustomCursor />

        <main>{children}</main>
      </GlobalContext.Provider>
    </ThemeProvider>

  )

}

export default Layout
