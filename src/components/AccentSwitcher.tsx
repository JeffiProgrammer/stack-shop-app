import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'

type Theme = 'light' | 'dark'
const THEME_TRANSITION_CLASS = 'theme-transition'
const THEME_TRANSITION_MS = 220

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
  root.setAttribute('data-theme', theme)
  root.style.colorScheme = theme
  window.localStorage.setItem('theme', theme)
}

function readTheme(): Theme {
  if (typeof document === 'undefined') {
    return 'light'
  }

  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function AccentSwitcher() {
  const [theme, setTheme] = React.useState<Theme>('light')
  const [mounted, setMounted] = React.useState(false)
  const transitionTimeoutRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    setTheme(readTheme())
    setMounted(true)
  }, [])

  React.useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current)
      }
    }
  }, [])

  const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
      className="rounded-full shadow-sm"
      aria-pressed={theme === 'dark'}
      onClick={() => {
        const root = document.documentElement
        root.classList.add(THEME_TRANSITION_CLASS)
        applyTheme(nextTheme)
        setTheme(nextTheme)

        if (transitionTimeoutRef.current !== null) {
          window.clearTimeout(transitionTimeoutRef.current)
        }

        transitionTimeoutRef.current = window.setTimeout(() => {
          root.classList.remove(THEME_TRANSITION_CLASS)
          transitionTimeoutRef.current = null
        }, THEME_TRANSITION_MS)
      }}
    >
      {!mounted || theme === 'light' ? <Moon /> : <Sun />}
    </Button>
  )
}
