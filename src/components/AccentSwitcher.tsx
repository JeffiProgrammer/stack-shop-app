import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { applyTheme, initializeTheme  } from '#/lib/theme'
import type {Theme} from '#/lib/theme';
import { Button } from './ui/button'

const THEME_TRANSITION_CLASS = 'theme-transition'
const THEME_TRANSITION_MS = 220

export function AccentSwitcher() {
  const [theme, setTheme] = React.useState<Theme>('light')
  const [mounted, setMounted] = React.useState(false)
  const transitionTimeoutRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    setTheme(initializeTheme())
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
      aria-label="Toggle color theme"
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
