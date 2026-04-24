import { Text, View } from "react-native";

import { useAppTheme } from "../../providers/ThemeProvider";
import type { MeasurementPoint } from "../../types/models";

interface BarChartProps {
  data: MeasurementPoint[];
}

export function BarChart({ data }: BarChartProps) {
  const { theme } = useAppTheme();
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <View className="gap-4">
      {data.map((item) => (
        <View key={item.id} className="gap-2">
          <View className="flex-row items-center justify-between">
            <Text style={[theme.fonts.bodyMedium, { color: theme.colors.text }]} className="text-sm">
              {item.label}
            </Text>
            <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="text-xs">
              {item.value}"
            </Text>
          </View>
          <View
            style={{
              backgroundColor: theme.isDark ? "rgba(255,255,255,0.06)" : "#E8ECE7"
            }}
            className="h-2 rounded-full"
          >
            <View
              style={{
                width: `${(item.value / max) * 100}%`,
                backgroundColor: theme.colors.primary
              }}
              className="h-2 rounded-full"
            />
          </View>
        </View>
      ))}
    </View>
  );
}
