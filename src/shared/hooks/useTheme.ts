import { THEME_CONFIG } from '@/shared/constants';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { useEffect } from 'react';

type Theme = 'light' | 'dark';

/**
 * Custom hook for managing theme state
 */
export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>(
    THEME_CONFIG.storageKey,
    THEME_CONFIG.defaultTheme as Theme
  );

  // Apply theme to document element
  useEffect(() => {
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove('light', 'dark');

    // Add current theme class
    root.classList.add(theme);
  }, [theme]);

  // Initialize theme based on system preference if no saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_CONFIG.storageKey);

    if (!savedTheme) {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      const systemTheme: Theme = prefersDark ? 'dark' : 'light';
      setTheme(systemTheme);
    }
  }, [setTheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const setLightTheme = () => setTheme('light');
  const setDarkTheme = () => setTheme('dark');

  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  return {
    theme,
    setTheme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isDark,
    isLight,
  };
}
