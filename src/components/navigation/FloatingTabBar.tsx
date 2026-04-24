import Ionicons from "@expo/vector-icons/Ionicons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { demoClasses } from "../../data/mockData";
import { triggerHaptic } from "../../lib/haptics";
import { useAppTheme } from "../../providers/ThemeProvider";

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: "home",
  Discover: "search",
  Progress: "stats-chart",
  Community: "people",
  Profile: "person"
};

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { bottom } = useSafeAreaInsets();
  const { theme } = useAppTheme();

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: bottom + 8
      }}
    >
      <View style={{ position: "absolute", alignSelf: "center", bottom: 52, zIndex: 10 }}>
        <Pressable
          onPress={async () => {
            await triggerHaptic("soft");
            (navigation.getParent() as any)?.navigate("WorkoutPlayer", {
              workoutId: demoClasses[0].id,
              autoplay: true
            });
          }}
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.colors.primary,
            shadowColor: theme.colors.primary,
            shadowOpacity: 0.35,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 12 },
            elevation: 10
          }}
        >
          <Ionicons color="#04100B" name="play" size={28} />
        </Pressable>
      </View>

      <BlurView
        intensity={55}
        style={{
          borderRadius: 28,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.card,
          paddingBottom: 10,
          paddingTop: 14
        }}
        tint={theme.isDark ? "dark" : "light"}
      >
        <View className="flex-row items-center justify-between px-4">
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const { options } = descriptors[route.key];
            const label =
              typeof options.tabBarLabel === "string"
                ? options.tabBarLabel
                : options.title ?? route.name;

            if (index === 2) {
              return <View key={`${route.key}-spacer`} style={{ width: 72 }} />;
            }

            return (
              <Pressable
                key={route.key}
                onPress={async () => {
                  await triggerHaptic();
                  navigation.navigate(route.name as never);
                }}
                style={{ alignItems: "center", flex: 1, gap: 4 }}
              >
                <Ionicons
                  color={isFocused ? theme.colors.primary : theme.colors.textSoft}
                  name={iconMap[route.name]}
                  size={22}
                />
                <Text
                  style={[
                    theme.fonts.body,
                    { color: isFocused ? theme.colors.text : theme.colors.textSoft, fontSize: 11 }
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}
