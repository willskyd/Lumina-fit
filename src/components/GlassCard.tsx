import { BlurView } from "expo-blur";
import { PropsWithChildren } from "react";
import { Platform, View, type StyleProp, type ViewStyle } from "react-native";

import { getShadow } from "../constants/theme";
import { useAppTheme } from "../providers/ThemeProvider";

interface GlassCardProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}

export function GlassCard({ children, style, padded = true }: GlassCardProps) {
  const { theme } = useAppTheme();
  const baseStyle: ViewStyle = {
    overflow: "hidden",
    borderRadius: 28
  };

  if (Platform.OS === "ios" || Platform.OS === "web") {
    return (
      <BlurView
        intensity={60}
        style={[
          baseStyle,
          padded ? { padding: 20 } : undefined,
          theme.glass,
          getShadow(theme.colors.shadow),
          style
        ]}
        tint={theme.isDark ? "dark" : "light"}
      >
        {children}
      </BlurView>
    );
  }

  return (
    <View
      style={[
        baseStyle,
        padded ? { padding: 20 } : undefined,
        theme.glass,
        getShadow(theme.colors.shadow),
        style
      ]}
    >
      {children}
    </View>
  );
}
