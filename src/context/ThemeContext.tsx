import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light';
export type ThemePreference = 'system' | 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  preference: ThemePreference;
  isLight: boolean;
  isSystem: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode | ThemePreference) => void;
  setPreference: (pref: ThemePreference) => void;
}

const getSystemTheme = (): ThemeMode => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  preference: 'system',
  isLight: false,
  isSystem: true,
  toggleTheme: () => {},
  setTheme: () => {},
  setPreference: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial preference: 'system' by default unless user explicitly chose 'dark' or 'light'
  const [preference, setPreferenceState] = useState<ThemePreference>(() => {
    try {
      const savedPref = localStorage.getItem('fibb_app_theme_preference');
      if (savedPref === 'system' || savedPref === 'light' || savedPref === 'dark') {
        return savedPref;
      }
      const legacy = localStorage.getItem('fibb_app_theme');
      if (legacy === 'light' || legacy === 'dark') {
        return legacy;
      }
    } catch {
      // Ignore localStorage errors
    }
    // Default to 'system' to automatically detect the OS preference
    return 'system';
  });

  // 2. Track real-time system/OS preference
  const [systemTheme, setSystemTheme] = useState<ThemeMode>(getSystemTheme);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial system theme
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const newSystemTheme: ThemeMode = e.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    } else if ((mediaQuery as any).addListener) {
      // Fallback for older environments
      (mediaQuery as any).addListener(handleSystemThemeChange);
      return () => (mediaQuery as any).removeListener(handleSystemThemeChange);
    }
  }, []);

  // 3. The effective theme is either the user's forced choice or the current system theme
  const activeTheme: ThemeMode = preference === 'system' ? systemTheme : preference;

  // 4. Apply classes and colors to document root
  useEffect(() => {
    try {
      localStorage.setItem('fibb_app_theme_preference', preference);
      localStorage.setItem('fibb_app_theme', activeTheme);
    } catch {
      // Ignore
    }

    const root = document.documentElement;
    if (activeTheme === 'light') {
      root.classList.add('light-mode');
      root.classList.remove('dark-mode');
      root.style.colorScheme = 'light';
      document.body.style.backgroundColor = '#F4F6F9';
      document.body.style.color = '#0F172A';
    } else {
      root.classList.add('dark-mode');
      root.classList.remove('light-mode');
      root.style.colorScheme = 'dark';
      document.body.style.backgroundColor = '#090D14';
      document.body.style.color = '#F8FAFC';
    }
  }, [activeTheme, preference]);

  // Toggle cyclically between the 3 possibilities: system (Auto OS) -> dark -> light -> system
  const toggleTheme = () => {
    setPreferenceState((prev) => {
      if (prev === 'system') return 'dark';
      if (prev === 'dark') return 'light';
      return 'system';
    });
  };

  const setTheme = (newTheme: ThemeMode | ThemePreference) => {
    setPreferenceState(newTheme);
  };

  const setPreference = (newPref: ThemePreference) => {
    setPreferenceState(newPref);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        preference,
        isLight: activeTheme === 'light',
        isSystem: preference === 'system',
        toggleTheme,
        setTheme,
        setPreference,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
