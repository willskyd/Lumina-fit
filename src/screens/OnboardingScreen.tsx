import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { ImageBackground, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "../components/GlassCard";
import { PremiumButton } from "../components/PremiumButton";
import { demoClasses } from "../data/mockData";
import { triggerHaptic } from "../lib/haptics";
import { useAppTheme } from "../providers/ThemeProvider";
import { useAppStore } from "../store/useAppStore";
import type { RootStackParamList } from "../navigation/types";

const slides = [
  {
    id: "s1",
    title: "Private Studio Energy",
    body: "Cinematic live classes, luxury pacing, and coaching that keeps pulling you back in."
  },
  {
    id: "s2",
    title: "Plans That Adapt",
    body: "AI-crafted programming blended with real recovery rituals, premium accountability, and elegant progress."
  },
  {
    id: "s3",
    title: "A Fitness App That Feels Expensive",
    body: "Glass surfaces, rich motion, and a polished rhythm built for daily obsession."
  }
];

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

export function OnboardingScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const signInDemo = useAppStore((state) => state.signInDemo);

  return (
    <ImageBackground source={{ uri: demoClasses[0].coverImage }} style={{ flex: 1 }}>
      <LinearGradient
        colors={["rgba(8,8,8,0.18)", "rgba(8,8,8,0.72)", "rgba(8,8,8,0.92)"]}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1 justify-between px-5 py-4">
          <View className="gap-4">
            <MotiView animate={{ opacity: 1, translateY: 0 }} from={{ opacity: 0, translateY: 18 }}>
              <Text
                style={{ fontFamily: "CormorantGaramond_700Bold" }}
                className="text-6xl text-white"
              >
                Lumina Fit
              </Text>
              <Text
                style={{ fontFamily: "Manrope_500Medium" }}
                className="mt-3 max-w-[280px] text-sm leading-6 text-white/75"
              >
                The cinematic gym experience for people who want discipline to feel magnetic.
              </Text>
            </MotiView>
          </View>

          <View className="gap-4">
            <Carousel
              data={slides}
              height={220}
              loop
              mode="parallax"
              modeConfig={{ parallaxScrollingScale: 0.92, parallaxScrollingOffset: 36 }}
              renderItem={({ item }) => (
                <MotiView
                  animate={{ opacity: 1 }}
                  from={{ opacity: 0.6 }}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  <GlassCard style={{ minHeight: 220 }}>
                    <Text style={theme.fonts.caption} className="text-xs tracking-[3px] text-white/60">
                      2026 SIGNATURE EXPERIENCE
                    </Text>
                    <Text
                      style={{ fontFamily: "CormorantGaramond_600SemiBold" }}
                      className="mt-4 text-4xl leading-10 text-white"
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={theme.fonts.body}
                      className="mt-4 text-sm leading-6 text-white/74"
                    >
                      {item.body}
                    </Text>
                  </GlassCard>
                </MotiView>
              )}
              width={340}
            />

            <View className="gap-3">
              <PremiumButton
                onPress={async () => {
                  await triggerHaptic("soft");
                  completeOnboarding();
                  navigation.replace("Auth");
                }}
                title="Enter the Studio"
              />
              <PremiumButton
                onPress={async () => {
                  await triggerHaptic("success");
                  signInDemo();
                }}
                title="Continue in Demo Mode"
                variant="secondary"
              />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}
