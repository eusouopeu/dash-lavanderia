import { useEffect, useState } from 'react'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'dash-lavanderia:theme'

function getSystemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function getStoredTheme(): Theme | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : null
}

function applyTheme(theme: Theme | null) {
  if (theme) document.documentElement.setAttribute('data-theme', theme)
  else document.documentElement.removeAttribute('data-theme')
}

/** Alterna entre claro/escuro/automático (segue o sistema). Persiste a
 * escolha explícita em localStorage; sem escolha, segue prefers-color-scheme. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme() ?? (getSystemPrefersDark() ? 'dark' : 'light'))
  const [isExplicit, setIsExplicit] = useState<boolean>(() => getStoredTheme() !== null)

  useEffect(() => {
    applyTheme(isExplicit ? theme : null)
  }, [theme, isExplicit])

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setIsExplicit(true)
    localStorage.setItem(STORAGE_KEY, next)
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      title={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      className="flex h-8 w-8 items-center justify-center rounded-md text-white/60 transition-colors hover:bg-white/10 hover:text-sidebar-fg"
    >
      {isDark ? <SunIcon className="h-4.5 w-4.5" /> : <MoonIcon className="h-4.5 w-4.5" />}
    </button>
  )
}
