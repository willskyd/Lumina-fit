import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BarChart } from "../components/charts/BarChart";
import { LineChart } from "../components/charts/LineChart";
import { GlassCard } from "../components/GlassCard";
import { SectionHeader } from "../components/SectionHeader";
import {
  measurementSeries,
  personalRecords,
  progressSeries
} from "../data/mockData";
import { openPlaybackFromCard } from "../lib/playback";
import { useAppTheme } from "../providers/ThemeProvider";
import { useAppStore } from "../store/useAppStore";
import type { RootStackParamList } from "../navigation/types";

export function ProgressScreen() {
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
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 170 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[theme.fonts.caption, { color: theme.colors.primary }]} className="text-xs">
            PERFORMANCE DASHBOARD
          </Text>
          <Text style={[theme.fonts.displayLarge, { color: theme.colors.text }]} className="mt-2 text-5xl">
            Proof that your work is compounding.
          </Text>
          <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="mt-3 text-sm leading-6">
            Elegant progress tracking for output, body changes, streaks, and personal records.
          </Text>

          <View className="mt-6 flex-row gap-4">
            {[
              { label: "Workout Score", value: "82", preferredWorkoutId: "class-4" },
              { label: "Monthly Streak", value: "18", preferredWorkoutId: "class-6" }
            ].map((item) => (
              <Pressable
                key={item.label}
                onPress={() => playCard(`progress-stat-${item.label}`, item.preferredWorkoutId)}
                style={{ flex: 1 }}
              >
                <GlassCard style={{ flex: 1 }}>
                  <View className="flex-row items-start justify-between gap-3">
                    <View>
                      <Text style={[theme.fonts.caption, { color: theme.colors.textSoft }]} className="text-xs">
                        {item.label}
                      </Text>
                      <Text style={[theme.fonts.displayLarge, { color: theme.colors.text }]} className="mt-2 text-4xl">
                        {item.value}
                      </Text>
                    </View>
                    <Ionicons color={theme.colors.primary} name="play-circle" size={22} />
                  </View>
                </GlassCard>
              </Pressable>
            ))}
          </View>

          <View className="mt-8">
            <SectionHeader subtitle="Six week trendline" title="Consistency Arc" />
            <Pressable onPress={() => playCard("progress-consistency-arc", "class-6")}>
              <GlassCard>
                <LineChart data={progressSeries} />
              </GlassCard>
            </Pressable>
          </View>

          <View className="mt-8">
            <SectionHeader subtitle="Current body snapshot" title="Measurements" />
            <Pressable onPress={() => playCard("progress-measurements", "class-2")}>
              <GlassCard>
                <BarChart data={measurementSeries} />
              </GlassCard>
            </Pressable>
          </View>

          <View className="mt-8">
            <SectionHeader subtitle="The wins worth showing off" title="Personal Records" />
            <View className="gap-4">
              {personalRecords.map((record, index) => (
                <Pressable
                  key={record.id}
                  onPress={() =>
                    playCard(
                      `progress-record-${record.id}`,
                      index === 0 ? "class-2" : index === 1 ? "class-6" : "class-1"
                    )
                  }
                >
                  <GlassCard>
                    <View className="flex-row items-center justify-between">
                      <View>
                        <Text style={[theme.fonts.bodyMedium, { color: theme.colors.text }]} className="text-sm">
                          {record.label}
                        </Text>
                        <Text style={[theme.fonts.display, { color: theme.colors.text }]} className="mt-2 text-3xl">
                          {record.value}
                        </Text>
                      </View>
                      <View className="items-end gap-3">
                        <View
                          style={{ backgroundColor: "rgba(16,185,129,0.12)" }}
                          className="rounded-full px-4 py-2"
                        >
                          <Text style={[theme.fonts.bodyBold, { color: theme.colors.primary }]} className="text-sm">
                            {record.delta}
                          </Text>
                        </View>
                        <Ionicons color={theme.colors.primary} name="play" size={18} />
                      </View>
                    </View>
                  </GlassCard>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
