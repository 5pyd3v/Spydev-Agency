import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { settingsApi } from '@/api/settings.api';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'spydev-theme';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'dark';
  });

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // First-time visitors (no stored preference) follow the admin-configured default.
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    settingsApi
      .get()
      .then((settings) => {
        if (!localStorage.getItem(STORAGE_KEY) && settings.appearance?.defaultTheme) {
          setThemeState(settings.appearance.defaultTheme);
          applyTheme(settings.appearance.defaultTheme);
        }
      })
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
