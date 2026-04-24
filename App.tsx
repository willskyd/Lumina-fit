import "@expo/metro-runtime";
import "react-native-reanimated";
import "./global.css";

import { useFonts } from "expo-font";
import {
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold
} from "@expo-google-fonts/cormorant-garamond";
import {
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold
} from "@expo-google-fonts/manrope";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { MotiView } from "moti";
import { ActivityIndicator, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  initialWindowMetrics
} from "react-native-safe-area-context";

import { useBootstrap } from "./src/hooks/useBootstrap";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { ThemeProvider, useAppTheme } from "./src/providers/ThemeProvider";

function AppShell() {
  useBootstrap();

  const { navigationTheme, theme } = useAppTheme();

  return (
    <>
      <StatusBar hidden />
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}

function BootScreen() {
  return (
    <MotiView
      animate={{ opacity: 1 }}
      className="flex-1 items-center justify-center bg-obsidian"
      from={{ opacity: 0 }}
      transition={{ duration: 500 }}
    >
      <View className="items-center gap-4">
        <View className="h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <ActivityIndicator color="#10B981" size="large" />
        </View>
        <Text
          style={{ fontFamily: "CormorantGaramond_600SemiBold" }}
          className="text-4xl text-white"
        >
          Lumina Fit
        </Text>
        <Text
          style={{ fontFamily: "Manrope_500Medium" }}
          className="text-sm tracking-[2px] text-white/60"
        >
          PREPARING YOUR PRIVATE STUDIO
        </Text>
      </View>
    </MotiView>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    CormorantGaramond_500Medium,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ThemeProvider>{fontsLoaded ? <AppShell /> : <BootScreen />}</ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
