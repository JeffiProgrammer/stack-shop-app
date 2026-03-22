// @vitest-environment jsdom

import { fireEvent, screen } from '@testing-library/dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { applyTheme, initializeTheme, resolveTheme } from '#/lib/theme'

describe('theme behavior', () => {
  const storage = new Map<string, string>()

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      writable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value)
        },
        removeItem: (key: string) => {
          storage.delete(key)
        },
      },
    })

    storage.clear()
    document.body.innerHTML =
      '<button type="button" aria-label="Toggle color theme">Toggle theme</button>'
    document.documentElement.className = ''
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.style.colorScheme = ''
  })

  afterEach(() => {
    storage.clear()
    document.body.innerHTML = ''
  })

  it('applies the stored theme on init and updates the root theme state on toggle click', () => {
    window.localStorage.setItem('theme', 'dark')

    initializeTheme()

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(document.documentElement.style.colorScheme).toBe('dark')

    const toggleButton = screen.getByRole('button', {
      name: /toggle color theme/i,
    })

    toggleButton.addEventListener('click', () => {
      const nextTheme = resolveTheme() === 'dark' ? 'light' : 'dark'
      applyTheme(nextTheme)
    })

    fireEvent.click(toggleButton)

    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(document.documentElement.style.colorScheme).toBe('light')
    expect(window.localStorage.getItem('theme')).toBe('light')
  })
})
