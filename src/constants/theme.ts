import type { Theme } from "@react-navigation/native";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import type { TextStyle, ViewStyle } from "react-native";

import type { ResolvedTheme } from "../types/models";

interface Palette {
  background: string;
  backgroundElevated: string;
  text: string;
  textMuted: string;
  textSoft: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  card: string;
  cardStrong: string;
  overlay: string;
  success: string;
  warning: string;
  shadow: string;
  heroGradient: [string, string, string];
}

export interface AppThemeTokens {
  mode: ResolvedTheme;
  isDark: boolean;
  colors: Palette;
  fonts: {
    display: TextStyle;
    displayLarge: TextStyle;
    body: TextStyle;
    bodyMedium: TextStyle;
    bodyBold: TextStyle;
    caption: TextStyle;
  };
  surface: ViewStyle;
  glass: ViewStyle;
  navigationTheme: Theme;
}

const lightPalette: Palette = {
  background: "#FFFFFF",
  backgroundElevated: "#F6F7F2",
  text: "#131313",
  textMuted: "#5B625D",
  textSoft: "#7F8A84",
  primary: "#10B981",
  secondary: "#F5EEDC",
  accent: "#D4B16A",
  border: "rgba(17, 24, 39, 0.08)",
  card: "rgba(255,255,255,0.80)",
  cardStrong: "#F8F9F5",
  overlay: "rgba(10, 10, 10, 0.14)",
  success: "#2FBF71",
  warning: "#F59E0B",
  shadow: "rgba(15, 23, 42, 0.12)",
  heroGradient: ["#EEFDF4", "#FFFFFF", "#FFF8EB"]
};

const darkPalette: Palette = {
  background: "#0F0F0F",
  backgroundElevated: "#171818",
  text: "#FFFFFF",
  textMuted: "#C4CCC8",
  textSoft: "#8E9591",
  primary: "#10B981",
  secondary: "#F2E6C9",
  accent: "#D4B16A",
  border: "rgba(255,255,255,0.09)",
  card: "rgba(22, 24, 24, 0.78)",
  cardStrong: "#181A1B",
  overlay: "rgba(0, 0, 0, 0.35)",
  success: "#36D28A",
  warning: "#FBBF24",
  shadow: "rgba(0, 0, 0, 0.42)",
  heroGradient: ["#0E1512", "#0F0F0F", "#191410"]
};

export function getShadow(color: string): ViewStyle {
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.24,
    shadowRadius: 28,
    elevation: 12
  };
}

export function getTheme(mode: ResolvedTheme): AppThemeTokens {
  const palette = mode === "dark" ? darkPalette : lightPalette;
  const baseTheme = mode === "dark" ? DarkTheme : DefaultTheme;

  return {
    mode,
    isDark: mode === "dark",
    colors: palette,
    fonts: {
      display: { fontFamily: "CormorantGaramond_600SemiBold" },
      displayLarge: { fontFamily: "CormorantGaramond_700Bold" },
      body: { fontFamily: "Manrope_500Medium" },
      bodyMedium: { fontFamily: "Manrope_600SemiBold" },
      bodyBold: { fontFamily: "Manrope_700Bold" },
      caption: { fontFamily: "Manrope_500Medium", letterSpacing: 1.2 }
    },
    surface: {
      backgroundColor: palette.cardStrong,
      borderColor: palette.border,
      borderWidth: 1,
      borderRadius: 28
    },
    glass: {
      backgroundColor: palette.card,
      borderColor: palette.border,
      borderWidth: 1,
      borderRadius: 28
    },
    navigationTheme: {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        background: palette.background,
        card: palette.background,
        border: palette.border,
        primary: palette.primary,
        text: palette.text
      }
    }
  };
}
