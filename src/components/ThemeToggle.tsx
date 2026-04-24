import Ionicons from "@expo/vector-icons/Ionicons";
import { View } from "react-native";

import { PremiumButton } from "./PremiumButton";
import { useAppTheme } from "../providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, resolvedTheme, toggleTheme } = useAppTheme();

  return (
    <View className="relative">
      <PremiumButton
        onPress={toggleTheme}
        title={resolvedTheme === "dark" ? "Switch to Light" : "Switch to Dark"}
        variant="secondary"
      />
      <View className="absolute right-5 top-4">
        <Ionicons
          color={theme.colors.primary}
          name={resolvedTheme === "dark" ? "sunny-outline" : "moon-outline"}
          size={20}
        />
      </View>
    </View>
  );
}
