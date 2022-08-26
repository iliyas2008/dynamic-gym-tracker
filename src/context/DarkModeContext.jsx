import React, { createContext, useContext, useEffect, useState } from "react";

const themes = {
  dark: {
    backgroundColor: 'black',
    color: 'white'
  },
  light: {
    backgroundColor: 'white',
    color: 'black'
  }
}

const initialState = {
  dark: false,
  theme: themes.light,
  toggle: () => {}
}

export const DarkModeContext = createContext(initialState);

const stylesheets = {
  light: "https://cdnjs.cloudflare.com/ajax/libs/antd/4.9.4/antd.min.css",
  dark: "https://cdnjs.cloudflare.com/ajax/libs/antd/4.9.4/antd.dark.min.css"
}
const createStylesheetLink = () => {
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.id = "antd-stylesheet"
  document.head.appendChild(link)
  return link
}

const getStylesheetLink = () =>
  document.head.querySelector("#antd-stylesheet") || createStylesheetLink()


const systemTheme = () =>
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"

const getTheme = () => (localStorage.getItem("theme")) || systemTheme()

export const DarkModeContextProvider = ({ children }) => {
  const [dark, setDark] = useState(false) // Default theme is light
  
  const setTheme = (theme) => {
    localStorage.setItem("theme", theme)
    getStylesheetLink().href = stylesheets[theme]
    setDark(theme === "dark" ? true: false)
    localStorage.setItem('dark', JSON.stringify(theme === "dark" ? true: false))
  }
  
  // On mount, read the preferred theme from the persistence
  useEffect(() => {
    setTheme(getTheme())
  }, [])

  // To toggle between dark and light modes
  const toggleDarkMode = () => {
    setTheme(getTheme() === "dark" ? "light" : "dark")
  }
  
   // Filter the styles based on the theme selected
   const theme = dark ? themes.dark : themes.light

  return (
    <DarkModeContext.Provider value={{ dark, theme, getTheme, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
export function useDarkMode() {
  return useContext(DarkModeContext);
}
