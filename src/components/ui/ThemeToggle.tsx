'use client';

import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg border border-primary/20 bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? '☀️ Light' : '🌙 Void'}
    </button>
  );
}
