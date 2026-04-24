import { Pressable, Text, View } from "react-native";

import { triggerHaptic } from "../lib/haptics";
import { useAppTheme } from "../providers/ThemeProvider";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onActionPress
}: SectionHeaderProps) {
  const { theme } = useAppTheme();

  return (
    <View className="mb-4 flex-row items-end justify-between">
      <View className="flex-1 pr-4">
        <Text style={[theme.fonts.display, { color: theme.colors.text }]} className="text-3xl">
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[theme.fonts.body, { color: theme.colors.textMuted }]}
            className="mt-1 text-sm"
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actionLabel ? (
        <Pressable
          onPress={async () => {
            await triggerHaptic();
            onActionPress?.();
          }}
        >
          <Text
            style={[theme.fonts.bodyMedium, { color: theme.colors.primary }]}
            className="text-sm"
          >
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
