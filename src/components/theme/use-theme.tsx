'use client';
import { useEffect,useState } from 'react';

// TODO not used at the moment, planned to help with white flashing
export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const newTheme = (e as CustomEvent).detail.theme;
      setTheme(newTheme as 'light' | 'dark' | 'system');
    };

    document.addEventListener('theme-change', handleThemeChange);
    return () =>
      document.removeEventListener('theme-change', handleThemeChange);
  }, []);

  return theme;
};
