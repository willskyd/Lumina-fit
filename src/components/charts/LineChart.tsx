import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { Text, View } from "react-native";

import { useAppTheme } from "../../providers/ThemeProvider";
import type { ProgressPoint } from "../../types/models";

interface LineChartProps {
  data: ProgressPoint[];
  height?: number;
}

function buildPath(points: ProgressPoint[], width: number, height: number) {
  if (!points.length) {
    return "";
  }

  const max = Math.max(...points.map((point) => point.score));
  const min = Math.min(...points.map((point) => point.score));
  const range = Math.max(max - min, 1);

  return points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * width;
      const y = height - ((point.score - min) / range) * height;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export function LineChart({ data, height = 120 }: LineChartProps) {
  const { theme } = useAppTheme();
  const width = 320;

  return (
    <View className="gap-3">
      <Svg height={height} viewBox={`0 0 ${width} ${height}`} width="100%">
        <Defs>
          <LinearGradient id="luminaLine" x1="0%" x2="100%" y1="0%" y2="0%">
            <Stop offset="0%" stopColor={theme.colors.primary} />
            <Stop offset="100%" stopColor={theme.colors.accent} />
          </LinearGradient>
        </Defs>
        <Path
          d={buildPath(data, width, height - 10)}
          fill="none"
          stroke="url(#luminaLine)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={5}
        />
      </Svg>
      <View className="flex-row justify-between">
        {data.map((point) => (
          <Text
            key={point.id}
            style={[theme.fonts.body, { color: theme.colors.textSoft }]}
            className="text-xs"
          >
            {point.label}
          </Text>
        ))}
      </View>
    </View>
  );
}
