import Ionicons from "@expo/vector-icons/Ionicons";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "../components/GlassCard";
import { SectionHeader } from "../components/SectionHeader";
import { communityPosts, leaderboard } from "../data/mockData";
import { openPlaybackFromCard } from "../lib/playback";
import { useAppTheme } from "../providers/ThemeProvider";
import { useAppStore } from "../store/useAppStore";
import type { RootStackParamList } from "../navigation/types";

export function CommunityScreen() {
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
        <FlashList
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 170 }}
          data={communityPosts}
          ListHeaderComponent={
            <View className="pb-6">
              <Text style={[theme.fonts.caption, { color: theme.colors.primary }]} className="text-xs">
                COMMUNITY
              </Text>
              <Text style={[theme.fonts.displayLarge, { color: theme.colors.text }]} className="mt-2 text-5xl">
                Friendly competition, dressed up beautifully.
              </Text>
              <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="mt-3 text-sm leading-6">
                Challenges, momentum, and social proof inspired by the best of connected fitness.
              </Text>

              <View className="mt-8">
                <SectionHeader subtitle="Spring Ascend challenge" title="Leaderboard" />
                <View className="gap-3">
                  {leaderboard.map((entry) => (
                    <Pressable
                      key={entry.id}
                      onPress={() => playCard(`community-leaderboard-${entry.id}`, "community-leaderboard-burn")}
                    >
                      <GlassCard>
                        <View className="flex-row items-center gap-4">
                          <View
                            style={{ backgroundColor: theme.colors.backgroundElevated }}
                            className="h-12 w-12 items-center justify-center rounded-full"
                          >
                            <Text style={[theme.fonts.bodyBold, { color: theme.colors.text }]} className="text-base">
                              #{entry.rank}
                            </Text>
                          </View>
                          <Image
                            source={{ uri: entry.avatar }}
                            style={{ width: 52, height: 52, borderRadius: 26 }}
                          />
                          <View className="flex-1">
                            <Text style={[theme.fonts.bodyBold, { color: theme.colors.text }]} className="text-base">
                              {entry.name}
                            </Text>
                            <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="text-sm">
                              {entry.streak} day streak
                            </Text>
                          </View>
                          <Text style={[theme.fonts.bodyBold, { color: theme.colors.primary }]} className="text-base">
                            {entry.points}
                          </Text>
                          <Ionicons color={theme.colors.primary} name="play-circle" size={22} />
                        </View>
                      </GlassCard>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                playCard(
                  `community-post-${item.id}`,
                  item.id === "post-1" ? "community-post-elena" : "community-post-marcus"
                )
              }
              style={{ marginBottom: 18 }}
            >
              <GlassCard padded={false}>
                <Image source={{ uri: item.image }} style={{ width: "100%", height: 240 }} />
                <View className="p-5">
                  <View className="flex-row items-center gap-3">
                    <Image source={{ uri: item.avatar }} style={{ width: 44, height: 44, borderRadius: 22 }} />
                    <View className="flex-1">
                      <Text style={[theme.fonts.bodyBold, { color: theme.colors.text }]} className="text-base">
                        {item.author}
                      </Text>
                      <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="text-xs">
                        {item.challenge} · {item.timeAgo}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[theme.fonts.body, { color: theme.colors.textMuted }]}
                    className="mt-4 text-sm leading-6"
                  >
                    {item.caption}
                  </Text>
                  <Text style={[theme.fonts.bodyBold, { color: theme.colors.primary }]} className="mt-4 text-sm">
                    {item.likes} likes
                  </Text>
                  <View className="mt-4 flex-row items-center gap-2 self-start">
                    <Ionicons color={theme.colors.primary} name="play" size={16} />
                    <Text style={[theme.fonts.bodyBold, { color: theme.colors.primary }]} className="text-sm">
                      Play challenge clip
                    </Text>
                  </View>
                </View>
              </GlassCard>
            </Pressable>
          )}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
