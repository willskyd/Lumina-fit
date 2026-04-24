import * as SystemUI from "expo-system-ui";
import { MotiView } from "moti";
import { createContext, PropsWithChildren, useContext, useEffect, useMemo } from "react";
import { useColorScheme } from "react-native";

import { getTheme, type AppThemeTokens } from "../constants/theme";
import { useAppStore } from "../store/useAppStore";
import type { ResolvedTheme, ThemePreference } from "../types/models";

interface ThemeContextValue {
  theme: AppThemeTokens;
  navigationTheme: AppThemeTokens["navigationTheme"];
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setThemePreference: (preference: ThemePreference) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const preference = useAppStore((state) => state.themePreference);
  const setThemePreference = useAppStore((state) => state.setThemePreference);

  const resolvedTheme: ResolvedTheme =
    preference === "system" ? (systemScheme === "dark" ? "dark" : "light") : preference;
  const theme = useMemo(() => getTheme(resolvedTheme), [resolvedTheme]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background).catch(() => undefined);
  }, [theme.colors.background]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      navigationTheme: theme.navigationTheme,
      preference,
      resolvedTheme,
      setThemePreference,
      toggleTheme: () => setThemePreference(resolvedTheme === "dark" ? "light" : "dark")
    }),
    [preference, resolvedTheme, setThemePreference, theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <MotiView
        animate={{ backgroundColor: theme.colors.background }}
        className="flex-1"
        from={{ backgroundColor: theme.colors.background }}
        transition={{ type: "timing", duration: 260 }}
      >
        {children}
      </MotiView>
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }

  return context;
}
