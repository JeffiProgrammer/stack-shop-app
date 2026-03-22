export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'theme'
export const THEME_ATTRIBUTE = 'data-theme'

function getSafeStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function isTheme(value: string | null | undefined): value is Theme {
  return value === 'light' || value === 'dark'
}

export function readStoredTheme(storage = getSafeStorage()): Theme | null {
  try {
    const storedTheme = storage?.getItem(THEME_STORAGE_KEY)
    return isTheme(storedTheme) ? storedTheme : null
  } catch {
    return null
  }
}

export function readDocumentTheme(
  root =
    typeof document !== 'undefined' ? document.documentElement : undefined,
): Theme {
  if (!root) {
    return 'light'
  }

  const themeAttribute = root.getAttribute(THEME_ATTRIBUTE)
  if (isTheme(themeAttribute)) {
    return themeAttribute
  }

  return root.classList.contains('dark') ? 'dark' : 'light'
}

export function resolveTheme(
  root =
    typeof document !== 'undefined' ? document.documentElement : undefined,
  storage = getSafeStorage(),
): Theme {
  return readStoredTheme(storage) ?? readDocumentTheme(root)
}

export function applyTheme(
  theme: Theme,
  root =
    typeof document !== 'undefined' ? document.documentElement : undefined,
  storage = getSafeStorage(),
) {
  if (!root) {
    return theme
  }

  root.classList.remove('light', 'dark')
  root.classList.add(theme)
  root.setAttribute(THEME_ATTRIBUTE, theme)
  root.style.colorScheme = theme

  try {
    storage?.setItem(THEME_STORAGE_KEY, theme)
  } catch {}

  return theme
}

export function initializeTheme(
  root =
    typeof document !== 'undefined' ? document.documentElement : undefined,
  storage = getSafeStorage(),
) {
  return applyTheme(resolveTheme(root, storage), root, storage)
}

export const THEME_INIT_SCRIPT = `(function(){try{var storedTheme=window.localStorage.getItem('${THEME_STORAGE_KEY}');var theme=storedTheme==='dark'?'dark':'light';var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(theme);root.setAttribute('${THEME_ATTRIBUTE}',theme);root.style.colorScheme=theme;}catch(e){}})();`
