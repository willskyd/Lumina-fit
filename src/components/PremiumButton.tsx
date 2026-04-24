import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { PropsWithChildren, useState } from "react";
import { Pressable, Text, type StyleProp, type ViewStyle } from "react-native";

import { triggerHaptic } from "../lib/haptics";
import { useAppTheme } from "../providers/ThemeProvider";

interface PremiumButtonProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  onPress?: () => void | Promise<void>;
  variant?: "primary" | "secondary" | "ghost";
  style?: StyleProp<ViewStyle>;
}

export function PremiumButton({
  title,
  subtitle,
  onPress,
  variant = "primary",
  style
}: PremiumButtonProps) {
  const { theme } = useAppTheme();
  const [pressed, setPressed] = useState(false);

  const content = (
    <>
      <Text
        style={[
          theme.fonts.bodyBold,
          { color: variant === "primary" ? "#0C1813" : theme.colors.text }
        ]}
        className="text-base"
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={[
            theme.fonts.body,
            {
              color:
                variant === "primary" ? "rgba(12,24,19,0.65)" : theme.colors.textMuted
            }
          ]}
          className="mt-1 text-sm"
        >
          {subtitle}
        </Text>
      ) : null}
    </>
  );

  return (
    <MotiView
      animate={{ scale: pressed ? 0.98 : 1 }}
      style={style}
      transition={{ type: "timing", duration: 140 }}
    >
      <Pressable
        onPress={async () => {
          await triggerHaptic(variant === "primary" ? "soft" : "selection");
          await onPress?.();
        }}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
      >
        {variant === "primary" ? (
          <LinearGradient
            colors={[theme.colors.secondary, theme.colors.accent, "#F9F7EF"]}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
            style={{
              minHeight: 58,
              borderRadius: 22,
              paddingHorizontal: 18,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {content}
          </LinearGradient>
        ) : (
          <MotiView
            animate={{
              backgroundColor:
                variant === "secondary"
                  ? theme.colors.cardStrong
                  : theme.isDark
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(0,0,0,0.03)"
            }}
            style={{
              minHeight: 56,
              borderRadius: 22,
              paddingHorizontal: 18,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor:
                variant === "secondary" ? theme.colors.border : "transparent"
            }}
          >
            {content}
          </MotiView>
        )}
      </Pressable>
    </MotiView>
  );
}
