'use client'

import { useEffect, useState } from 'react'

export type ColorTheme = 'neutral' | 'blue' | 'green' | 'rose' | 'orange' | 'violet'

const COLOR_THEME_STORAGE_KEY = 'color-theme'

export function useColorTheme() {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>('neutral')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Récupérer le thème depuis localStorage ou utiliser "neutral" par défaut
    const stored = localStorage.getItem(COLOR_THEME_STORAGE_KEY) as ColorTheme | null
    if (stored && ['neutral', 'blue', 'green', 'rose', 'orange', 'violet'].includes(stored)) {
      setColorThemeState(stored)
      applyColorTheme(stored)
    } else {
      applyColorTheme('neutral')
    }
  }, [])

  const setColorTheme = (theme: ColorTheme) => {
    setColorThemeState(theme)
    localStorage.setItem(COLOR_THEME_STORAGE_KEY, theme)
    applyColorTheme(theme)
  }

  return { colorTheme, setColorTheme, mounted }
}

function applyColorTheme(theme: ColorTheme) {
  const root = document.documentElement

  // Retirer toutes les classes de thème de couleur
  root.classList.remove('neutral', 'blue', 'green', 'rose', 'orange', 'violet')

  // Ajouter la nouvelle classe de thème
  root.classList.add(theme)
}
