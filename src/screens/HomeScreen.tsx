import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { useMemo } from "react";
import { ImageBackground, Pressable, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "../components/GlassCard";
import { SectionHeader } from "../components/SectionHeader";
import { coachingPlans, demoClasses } from "../data/mockData";
import { openPlaybackFromCard } from "../lib/playback";
import { useAppTheme } from "../providers/ThemeProvider";
import { useAppStore } from "../store/useAppStore";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";

type Props = BottomTabScreenProps<MainTabParamList, "Home">;

export function HomeScreen(_: Props) {
  const { theme } = useAppTheme();
  const user = useAppStore((state) => state.user);
  const streak = useAppStore((state) => state.streak);
  const setCurrentWorkout = useAppStore((state) => state.setCurrentWorkout);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const liveClasses = useMemo(() => demoClasses.filter((item) => item.live), []);
  const planWorkoutMap: Record<string, string> = {
    "plan-1": "class-2",
    "plan-2": "class-6",
    "plan-3": "class-3"
  };
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [-120, 0, 160], [-40, 0, 60]) },
      { scale: interpolate(scrollY.value, [-100, 0], [1.12, 1]) }
    ]
  }));

  function playCard(seed: string, preferredWorkoutId?: string) {
    return openPlaybackFromCard({
      navigation,
      setCurrentWorkout,
      seed,
      preferredWorkoutId
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <SafeAreaView edges={["top"]}>
          <View className="px-5 pt-2">
            <View className="flex-row items-center justify-between">
              <View>
                <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="text-sm">
                  Welcome back,
                </Text>
                <Text style={[theme.fonts.displayLarge, { color: theme.colors.text }]} className="text-4xl">
                  {user?.name?.split(" ")[0] ?? "Member"}
                </Text>
              </View>
              <View
                style={{ backgroundColor: theme.colors.cardStrong, borderColor: theme.colors.border }}
                className="h-12 w-12 items-center justify-center rounded-full border"
              >
                <Ionicons color={theme.colors.primary} name="sparkles" size={22} />
              </View>
            </View>
          </View>

          <View className="mt-5">
            <Animated.View style={[{ paddingHorizontal: 20 }, heroStyle]}>
              <Pressable onPress={() => playCard("home-hero", demoClasses[1].id)}>
                <ImageBackground
                  imageStyle={{ borderRadius: 34 }}
                  source={{ uri: demoClasses[1].coverImage }}
                  style={{ height: 320, overflow: "hidden", borderRadius: 34 }}
                >
                  <LinearGradient
                    colors={["rgba(15,15,15,0.10)", "rgba(15,15,15,0.76)"]}
                    style={{ flex: 1, justifyContent: "space-between", padding: 22 }}
                  >
                    <View>
                      <Text style={theme.fonts.caption} className="text-xs tracking-[3px] text-white/70">
                        TODAY'S CINEMATIC SESSION
                      </Text>
                      <Text
                        style={{ fontFamily: "CormorantGaramond_700Bold" }}
                        className="mt-3 text-5xl leading-[56px] text-white"
                      >
                        Sculpt. Sweat. Glow.
                      </Text>
                      <Text style={theme.fonts.body} className="mt-3 max-w-[280px] text-sm leading-6 text-white/78">
                        Your home feed is tuned around your streak, your current plan, and the live sessions most likely to lock you in.
                      </Text>
                      <View
                        style={{ backgroundColor: "rgba(255,255,255,0.16)" }}
                        className="mt-5 self-start rounded-full px-4 py-3"
                      >
                        <View className="flex-row items-center gap-2">
                          <Ionicons color="#FFFFFF" name="play" size={14} />
                          <Text style={theme.fonts.bodyBold} className="text-sm text-white">
                            Play today's workout
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View className="flex-row gap-3">
                      <GlassCard style={{ flex: 1 }}>
                        <Text style={theme.fonts.caption} className="text-xs text-white/60">
                          DAILY STREAK
                        </Text>
                        <Text style={[theme.fonts.displayLarge, { color: "#FFFFFF" }]} className="mt-2 text-4xl">
                          {streak}
                        </Text>
                        <Text style={theme.fonts.body} className="text-sm text-white/74">
                          days luminous
                        </Text>
                      </GlassCard>
                      <GlassCard style={{ flex: 1 }}>
                        <Text style={theme.fonts.caption} className="text-xs text-white/60">
                          NEXT CLASS
                        </Text>
                        <Text style={[theme.fonts.bodyBold, { color: "#FFFFFF" }]} className="mt-2 text-lg">
                          {liveClasses[0].title}
                        </Text>
                        <Text style={theme.fonts.body} className="text-sm text-white/74">
                          {liveClasses[0].startTime}
                        </Text>
                      </GlassCard>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </Pressable>
            </Animated.View>
          </View>

          <View className="mt-8 px-5">
            <SectionHeader
              actionLabel="Open plan"
              onActionPress={() => navigation.navigate("Plans")}
              subtitle="High-conviction classes aligned to your week"
              title="Quick Start"
            />
            <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-4">
                {demoClasses.slice(0, 3).map((item, index) => (
                  <MotiView
                    animate={{ opacity: 1, translateY: 0 }}
                    delay={index * 120}
                    from={{ opacity: 0, translateY: 18 }}
                    key={item.id}
                  >
                    <Pressable
                      onPress={() => playCard(`home-quick-start-${item.id}`, item.id)}
                      style={{ width: 260 }}
                    >
                      <ImageBackground
                        imageStyle={{ borderRadius: 28 }}
                        source={{ uri: item.thumbnail }}
                        style={{ height: 190, borderRadius: 28, overflow: "hidden" }}
                      >
                        <LinearGradient
                          colors={["rgba(0,0,0,0.08)", "rgba(0,0,0,0.78)"]}
                          style={{ flex: 1, justifyContent: "flex-end", padding: 18 }}
                        >
                          <Text style={theme.fonts.bodyBold} className="text-lg text-white">
                            {item.title}
                          </Text>
                          <Text style={theme.fonts.body} className="mt-2 text-sm text-white/74">
                            {item.duration} min · {item.category.toUpperCase()} · {item.level}
                          </Text>
                        </LinearGradient>
                      </ImageBackground>
                    </Pressable>
                  </MotiView>
                ))}
              </View>
            </Animated.ScrollView>
          </View>

          <View className="mt-8">
            <View className="px-5">
              <SectionHeader
                subtitle="Peloton-style momentum with premium surfaces"
                title="Live Classes"
              />
            </View>
            <Carousel
              data={liveClasses}
              height={220}
              loop
              mode="parallax"
              modeConfig={{ parallaxScrollingScale: 0.9, parallaxScrollingOffset: 46 }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => playCard(`home-live-${item.id}`, item.id)}
                  style={{ flex: 1, paddingHorizontal: 8 }}
                >
                  <ImageBackground
                    imageStyle={{ borderRadius: 30 }}
                    source={{ uri: item.coverImage }}
                    style={{ flex: 1, borderRadius: 30, overflow: "hidden" }}
                  >
                    <LinearGradient
                      colors={["rgba(0,0,0,0.05)", "rgba(0,0,0,0.80)"]}
                      style={{ flex: 1, justifyContent: "space-between", padding: 20 }}
                    >
                      <View
                        style={{ backgroundColor: "rgba(255,255,255,0.16)" }}
                        className="self-start rounded-full px-3 py-2"
                      >
                        <Text style={theme.fonts.caption} className="text-[10px] text-white">
                          {item.startTime}
                        </Text>
                      </View>
                      <View>
                        <Text style={[theme.fonts.display, { color: "#FFFFFF" }]} className="text-4xl">
                          {item.title}
                        </Text>
                        <Text style={theme.fonts.body} className="mt-2 text-sm text-white/74">
                          {item.instructor.name} · {item.participants} members waiting
                        </Text>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </Pressable>
              )}
              width={360}
            />
          </View>

          <View className="mt-8 px-5 pb-40">
            <SectionHeader subtitle="Future-style structure, reimagined beautifully" title="Your Plans" />
            <View className="gap-4">
              {coachingPlans.map((plan, index) => (
                <MotiView
                  animate={{ opacity: 1, translateY: 0 }}
                  delay={index * 90}
                  from={{ opacity: 0, translateY: 14 }}
                  key={plan.id}
                >
                  <Pressable
                    onPress={() => playCard(`home-plan-${plan.id}`, planWorkoutMap[plan.id])}
                  >
                    <GlassCard>
                      <View className="flex-row items-start justify-between gap-3">
                        <View className="flex-1">
                          <Text style={[theme.fonts.caption, { color: plan.accent }]} className="text-xs">
                            {plan.durationWeeks} WEEK PROGRESSION
                          </Text>
                          <Text
                            style={[theme.fonts.display, { color: theme.colors.text }]}
                            className="mt-2 text-3xl"
                          >
                            {plan.title}
                          </Text>
                          <Text
                            style={[theme.fonts.body, { color: theme.colors.textMuted }]}
                            className="mt-3 text-sm leading-6"
                          >
                            {plan.summary}
                          </Text>
                        </View>
                        <View
                          style={{ backgroundColor: theme.colors.backgroundElevated }}
                          className="rounded-full px-3 py-2"
                        >
                          <Text style={[theme.fonts.bodyBold, { color: theme.colors.text }]} className="text-sm">
                            {plan.completion}%
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{ backgroundColor: theme.colors.backgroundElevated }}
                        className="mt-5 h-2 rounded-full"
                      >
                        <View
                          style={{ width: `${plan.completion}%`, backgroundColor: plan.accent }}
                          className="h-2 rounded-full"
                        />
                      </View>
                      <View className="mt-4 flex-row flex-wrap gap-2">
                        {plan.focus.map((focus) => (
                          <View
                            key={focus}
                            style={{ backgroundColor: theme.colors.backgroundElevated }}
                            className="rounded-full px-3 py-2"
                          >
                            <Text
                              style={[theme.fonts.bodyMedium, { color: theme.colors.textMuted }]}
                              className="text-xs"
                            >
                              {focus}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </GlassCard>
                  </Pressable>
                </MotiView>
              ))}
            </View>
          </View>
        </SafeAreaView>
      </Animated.ScrollView>
    </View>
  );
}
