"use client"

import { useEffect } from "react"

const COLOR_THEME_STORAGE_KEY = "color-theme"

const colorThemes = ["neutral", "blue", "green", "rose", "orange", "violet"]

export function ColorThemeInit() {
  useEffect(() => {
    // Appliquer le thème au chargement pour éviter le flash
    const stored = localStorage.getItem(COLOR_THEME_STORAGE_KEY)
    const theme = stored && colorThemes.includes(stored) ? stored : "neutral"
    
    const root = document.documentElement
    root.classList.remove(...colorThemes)
    root.classList.add(theme)
  }, [])

  return null
}

