import { ref, watchEffect } from 'vue'

type Theme = 'dark' | 'light'

const STORAGE_KEY = 'theme'

const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored

  // Pas de préférence stockée : on suit la préférence système
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
  return prefersLight ? 'light' : 'dark'
}

// État au niveau module -> partagé entre tous les composants,
// même principe que useAuth() dans api.ts
const theme = ref<Theme>(getInitialTheme())

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem(STORAGE_KEY, theme.value)
})

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  const setTheme = (value: Theme) => {
    theme.value = value
  }

  return { theme, toggleTheme, setTheme }
}