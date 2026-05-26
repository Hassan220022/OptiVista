import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Colors, DarkColors } from './colors';
import { Typography } from './typography';
import { Spacing, Radii } from './spacing';
import { Shadows } from './shadows';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'optivista_theme';

interface Theme {
  colors: typeof Colors;
  typography: typeof Typography;
  spacing: typeof Spacing;
  radii: typeof Radii;
  shadows: typeof Shadows;
  isDark: boolean;
}

const LightTheme: Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  radii: Radii,
  shadows: Shadows,
  isDark: false,
};

const DarkTheme: Theme = {
  colors: DarkColors as typeof Colors,
  typography: Typography,
  spacing: Spacing,
  radii: Radii,
  shadows: Shadows,
  isDark: true,
};

const ThemeContext = createContext<Theme>(LightTheme);

interface ToggleContextValue {
  toggleTheme: () => void;
}

const ToggleContext = createContext<ToggleContextValue>({ toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (stored !== null) setIsDark(stored === 'dark');
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
      return next;
    });
  }, []);

  const theme = isDark ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={theme}>
      <ToggleContext.Provider value={{ toggleTheme }}>
        {children}
      </ToggleContext.Provider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function useToggleTheme() {
  return useContext(ToggleContext).toggleTheme;
}

export { LightTheme, DarkTheme };
export type { Theme };
