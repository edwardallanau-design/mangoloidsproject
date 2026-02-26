'use client';

import { useEffect, useState } from 'react';
import { ThemeContext } from '@/hooks/useTheme';
import { THEME_STORAGE_KEY, THEMES } from '@/constants/theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  const updateTheme = (dark: boolean) => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, dark ? THEMES.DARK : THEMES.LIGHT);
  };

  useEffect(() => {
    const handleMount = () => {
      // Check if user has a saved preference
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      const prefersDark =
        savedTheme === THEMES.DARK ||
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

      setIsDark(prefersDark);
      updateTheme(prefersDark);
      setMounted(true);
    };

    handleMount();
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    updateTheme(newTheme);
  };

  // Prevent flash of wrong theme
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Re-export useTheme hook for convenience (also available from @/hooks/useTheme)
export { useTheme } from '@/hooks/useTheme';
