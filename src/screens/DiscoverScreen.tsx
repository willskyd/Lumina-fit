import Ionicons from "@expo/vector-icons/Ionicons";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "../components/GlassCard";
import { SectionHeader } from "../components/SectionHeader";
import { demoClasses } from "../data/mockData";
import { triggerHaptic } from "../lib/haptics";
import { openPlaybackFromCard } from "../lib/playback";
import { useAppTheme } from "../providers/ThemeProvider";
import { useAppStore } from "../store/useAppStore";
import type { RootStackParamList } from "../navigation/types";
import type { WorkoutCategory } from "../types/models";

export function DiscoverScreen() {
  const { theme } = useAppTheme();
  const [filter, setFilter] = useState<WorkoutCategory | "all">("all");
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const setCurrentWorkout = useAppStore((state) => state.setCurrentWorkout);
  const filteredClasses = useMemo(
    () =>
      filter === "all"
        ? demoClasses
        : demoClasses.filter((item) => item.category === filter),
    [filter]
  );

  const filters: Array<WorkoutCategory | "all"> = [
    "all",
    "strength",
    "yoga",
    "hiit",
    "cardio",
    "mobility",
    "cycling"
  ];

  function playCard(seed: string, preferredWorkoutId?: string, category?: WorkoutCategory) {
    return openPlaybackFromCard({
      navigation,
      setCurrentWorkout,
      seed,
      preferredWorkoutId,
      category
    });
  }

  return (
    <LinearGradient colors={theme.colors.heroGradient} style={{ flex: 1 }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <FlashList
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 170 }}
          data={filteredClasses}
          ListHeaderComponent={
            <View className="pb-6">
              <Text style={[theme.fonts.caption, { color: theme.colors.primary }]} className="text-xs">
                DISCOVER CLASSES
              </Text>
              <Text style={[theme.fonts.displayLarge, { color: theme.colors.text }]} className="mt-2 text-5xl">
                Find the exact energy you want tonight.
              </Text>
              <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="mt-3 text-sm leading-6">
                Live classes, on-demand studio sessions, and instructor spotlights curated with a luxury club sensibility.
              </Text>

              <ScrollView className="mt-6" horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3">
                  {filters.map((item) => {
                    const selected = item === filter;
                    return (
                      <Pressable
                        key={item}
                        onPress={async () => {
                          await triggerHaptic();
                          setFilter(item);
                        }}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          borderRadius: 999,
                          borderWidth: 1,
                          borderColor: selected ? theme.colors.primary : theme.colors.border,
                          backgroundColor: selected ? theme.colors.primary : theme.colors.cardStrong
                        }}
                      >
                        <Text
                          style={[
                            theme.fonts.bodyMedium,
                            { color: selected ? "#04100B" : theme.colors.text }
                          ]}
                          className="text-sm capitalize"
                        >
                          {item}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>

              <View className="mt-8">
                <SectionHeader subtitle="The faces behind the experience" title="Instructor Spotlights" />
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-4">
                    {[...new Map(demoClasses.map((item) => [item.instructor.id, item.instructor])).values()].map(
                      (instructor) => (
                        <Pressable
                          key={instructor.id}
                          onPress={() => {
                            const instructorWorkout = demoClasses.find(
                              (workout) => workout.instructor.id === instructor.id
                            );

                            return playCard(
                              `discover-instructor-${instructor.id}`,
                              instructorWorkout?.id,
                              instructorWorkout?.category
                            );
                          }}
                          style={{ width: 260 }}
                        >
                          <GlassCard>
                            <View className="flex-row items-center gap-4">
                              <Image
                                source={{ uri: instructor.avatar }}
                                style={{ width: 68, height: 68, borderRadius: 34 }}
                              />
                              <View className="flex-1">
                                <Text style={[theme.fonts.bodyBold, { color: theme.colors.text }]} className="text-lg">
                                  {instructor.name}
                                </Text>
                                <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="text-sm">
                                  {instructor.title}
                                </Text>
                              </View>
                            </View>
                            <Text
                              style={[theme.fonts.body, { color: theme.colors.textMuted }]}
                              className="mt-4 text-sm leading-6"
                            >
                              "{instructor.quote}"
                            </Text>
                          </GlassCard>
                        </Pressable>
                      )
                    )}
                  </View>
                </ScrollView>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => playCard(`discover-class-${item.id}`, item.id, item.category)}
              style={{ marginBottom: 18 }}
            >
              <ImageBackground
                imageStyle={{ borderRadius: 32 }}
                source={{ uri: item.coverImage }}
                style={{ height: 300, borderRadius: 32, overflow: "hidden" }}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.06)", "rgba(0,0,0,0.84)"]}
                  style={{ flex: 1, justifyContent: "space-between", padding: 22 }}
                >
                  <View className="flex-row items-center justify-between">
                    <View
                      style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
                      className="rounded-full px-4 py-2"
                    >
                      <Text style={theme.fonts.caption} className="text-[10px] text-white capitalize">
                        {item.live ? item.startTime : `${item.duration} MIN ON DEMAND`}
                      </Text>
                    </View>
                    <Ionicons color="#FFFFFF" name="play-circle" size={34} />
                  </View>

                  <View>
                    <Text style={[theme.fonts.display, { color: "#FFFFFF" }]} className="text-4xl">
                      {item.title}
                    </Text>
                    <Text style={theme.fonts.body} className="mt-2 text-sm text-white/75">
                      {item.subtitle}
                    </Text>
                    <View className="mt-4 flex-row flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <View
                          key={tag}
                          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                          className="rounded-full px-3 py-2"
                        >
                          <Text style={theme.fonts.bodyMedium} className="text-xs text-white">
                            {tag}
                          </Text>
                        </View>
                      ))}
                    </View>
                    <View className="mt-5 flex-row items-center justify-between">
                      <View className="flex-row items-center gap-3">
                        <Image
                          source={{ uri: item.instructor.avatar }}
                          style={{ width: 42, height: 42, borderRadius: 21 }}
                        />
                        <View>
                          <Text style={[theme.fonts.bodyBold, { color: "#FFFFFF" }]} className="text-sm">
                            {item.instructor.name}
                          </Text>
                          <Text style={theme.fonts.body} className="text-xs text-white/70">
                            {item.participants} members joined
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{ backgroundColor: theme.colors.secondary }}
                        className="rounded-full px-4 py-3"
                      >
                        <Text style={[theme.fonts.bodyBold, { color: "#0C1813" }]} className="text-sm">
                          Start
                        </Text>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </Pressable>
          )}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
