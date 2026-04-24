import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "../components/GlassCard";
import { PremiumButton } from "../components/PremiumButton";
import { SectionHeader } from "../components/SectionHeader";
import { coachingPlans } from "../data/mockData";
import { openPlaybackFromCard } from "../lib/playback";
import { useAppTheme } from "../providers/ThemeProvider";
import { useAppStore } from "../store/useAppStore";
import type { RootStackParamList } from "../navigation/types";

const planWorkoutMap: Record<string, string> = {
  "plan-1": "plan-signature-recomp",
  "plan-2": "plan-studio-conditioning",
  "plan-3": "plan-restore-performance"
};

const weeklySessions = [
  {
    id: "week-1",
    label: "Monday · Power lower body and glute drive",
    preferredWorkoutId: "class-2"
  },
  {
    id: "week-2",
    label: "Tuesday · Mobility and deep recovery",
    preferredWorkoutId: "class-3"
  },
  {
    id: "week-3",
    label: "Wednesday · Upper sculpt with tempo control",
    preferredWorkoutId: "class-2"
  },
  {
    id: "week-4",
    label: "Thursday · Threshold cardio and cooldown flow",
    preferredWorkoutId: "class-6"
  }
];

export function PlansScreen() {
  const { theme } = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const setCurrentWorkout = useAppStore((state) => state.setCurrentWorkout);

  function playCard(seed: string, preferredWorkoutId?: string) {
    return openPlaybackFromCard({
      navigation,
      setCurrentWorkout,
      seed,
      preferredWorkoutId
    });
  }

  return (
    <LinearGradient colors={theme.colors.heroGradient} style={{ flex: 1 }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[theme.fonts.caption, { color: theme.colors.primary }]} className="text-xs">
            PLANS & COACHING
          </Text>
          <Text style={[theme.fonts.displayLarge, { color: theme.colors.text }]} className="mt-2 text-5xl">
            A polished coaching layer that actually guides the week.
          </Text>
          <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="mt-3 text-sm leading-6">
            Future-style personalization meets luxury studio programming, with recovery intelligence and clear momentum.
          </Text>

          <Pressable onPress={() => playCard("plans-ai-insight", "plan-coach-insight")}>
            <GlassCard style={{ marginTop: 24 }}>
              <Text style={[theme.fonts.caption, { color: theme.colors.primary }]} className="text-xs">
                AI COACH INSIGHT
              </Text>
              <Text style={[theme.fonts.display, { color: theme.colors.text }]} className="mt-3 text-3xl">
                Your legs are ready for volume. Your sleep score says keep recovery precise.
              </Text>
              <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="mt-4 text-sm leading-6">
                Lumina Coach recommends a heavy lower-body day, a low-impact cardio flush tomorrow, and an 18-minute mobility closeout tonight.
              </Text>
              <View className="mt-5 flex-row gap-3">
                <View
                  style={{ backgroundColor: theme.colors.backgroundElevated }}
                  className="flex-1 rounded-2xl px-4 py-3"
                >
                  <Text style={[theme.fonts.bodyBold, { color: theme.colors.text }]} className="text-lg">
                    94%
                  </Text>
                  <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="text-xs">
                    readiness score
                  </Text>
                </View>
                <View
                  style={{ backgroundColor: theme.colors.backgroundElevated }}
                  className="flex-1 rounded-2xl px-4 py-3"
                >
                  <Text style={[theme.fonts.bodyBold, { color: theme.colors.text }]} className="text-lg">
                    7.8h
                  </Text>
                  <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="text-xs">
                    sleep average
                  </Text>
                </View>
              </View>
            </GlassCard>
          </Pressable>

          <View className="mt-8">
            <SectionHeader subtitle="Choose your current path" title="Active Programs" />
            <View className="gap-4">
              {coachingPlans.map((plan) => (
                <Pressable
                  key={plan.id}
                  onPress={() => playCard(`plans-program-${plan.id}`, planWorkoutMap[plan.id])}
                >
                  <GlassCard>
                    <View className="flex-row items-start justify-between gap-4">
                      <View className="flex-1">
                        <Text style={[theme.fonts.caption, { color: plan.accent }]} className="text-xs">
                          {plan.coach}
                        </Text>
                        <Text style={[theme.fonts.display, { color: theme.colors.text }]} className="mt-2 text-3xl">
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
                        className="rounded-full px-4 py-3"
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
                    <View className="mt-5 flex-row items-center justify-between">
                      <View>
                        <Text style={[theme.fonts.bodyMedium, { color: theme.colors.text }]} className="text-sm">
                          Next session
                        </Text>
                        <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="mt-1 text-xs">
                          {plan.nextSession}
                        </Text>
                      </View>
                      <Ionicons color={plan.accent} name="play-circle" size={24} />
                    </View>
                  </GlassCard>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="mt-8 gap-4">
            <SectionHeader subtitle="Done-for-you weekly structure" title="This Week" />
            {weeklySessions.map((session) => (
              <Pressable
                key={session.id}
                onPress={() => playCard(session.id, session.preferredWorkoutId)}
              >
                <View
                  style={{ backgroundColor: theme.colors.cardStrong, borderColor: theme.colors.border }}
                  className="rounded-3xl border px-5 py-4"
                >
                  <View className="flex-row items-center justify-between gap-3">
                    <Text style={[theme.fonts.bodyMedium, { color: theme.colors.text }]} className="flex-1 text-sm">
                      {session.label}
                    </Text>
                    <Ionicons color={theme.colors.primary} name="play" size={18} />
                  </View>
                </View>
              </Pressable>
            ))}
          </View>

          <View className="mt-8 gap-3">
            <PremiumButton title="Regenerate Plan" />
            <PremiumButton title="Message Your Coach" variant="secondary" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
