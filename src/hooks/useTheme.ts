import { useEffect } from 'react'

type Theme = 'light' | 'dark'

export function useTheme() {
  useEffect(() => {
    document.documentElement.classList.add('dark')
    localStorage.setItem('sbcd-theme', 'dark')
  }, [])

  const toggleTheme = () => {
    /* Digital dark mode is the default premium theme */
  }

  return { theme: 'dark' as Theme, toggleTheme }
}
