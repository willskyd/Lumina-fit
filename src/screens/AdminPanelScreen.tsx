import Ionicons from "@expo/vector-icons/Ionicons";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "../components/GlassCard";
import { coachingPlans, communityPosts, demoClasses } from "../data/mockData";
import { signOutSupabase } from "../lib/auth";
import { getAllStoredUsers, signOutLocal, updateUserSubscription } from "../lib/localAuth";
import { openPlaybackFromCard } from "../lib/playback";
import { useAppTheme } from "../providers/ThemeProvider";
import { useAppStore } from "../store/useAppStore";
import type { RootStackParamList } from "../navigation/types";
import type { AppUser } from "../types/models";

export function AdminPanelScreen() {
  const { theme } = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isAdmin = useAppStore((state) => state.isAdmin);
  const signOut = useAppStore((state) => state.signOut);
  const setCurrentWorkout = useAppStore((state) => state.setCurrentWorkout);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    loadUsers();
  }, [isAdmin]);

  async function loadUsers() {
    try {
      setIsRefreshing(true);
      const allUsers = await getAllStoredUsers();
      setUsers(allUsers.filter((user) => !user.isAdmin));
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleToggleSubscription(user: AppUser) {
    try {
      const isActivating = !user.hasActiveSubscription;
      let expiryDate: string | null = null;

      if (isActivating) {
        const newExpiry = new Date();
        newExpiry.setDate(newExpiry.getDate() + 30);
        expiryDate = newExpiry.toISOString();
      }

      await updateUserSubscription(user.id, isActivating, expiryDate);
      Alert.alert(
        "Success",
        `${user.name}'s subscription has been ${isActivating ? "activated" : "deactivated"}`
      );
      await loadUsers();
    } catch (error) {
      Alert.alert("Error", "Failed to update subscription");
    }
  }

  async function handleSignOut() {
    await signOutLocal();
    await signOutSupabase();
    signOut();
  }

  function playCard(seed: string, preferredWorkoutId?: string) {
    return openPlaybackFromCard({
      navigation,
      setCurrentWorkout,
      seed,
      preferredWorkoutId
    });
  }

  if (!isAdmin) {
    return null;
  }

  const totalUsers = users.length;
  const activeSubscriptions = users.filter((u) => u.hasActiveSubscription).length;
  const inactiveSubscriptions = totalUsers - activeSubscriptions;
  const liveClasses = demoClasses.filter((workout) => workout.live).length;
  const monthlyRevenue = activeSubscriptions * 9;

  return (
    <LinearGradient colors={theme.colors.heroGradient} style={{ flex: 1 }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <FlashList
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          data={users}
          ListHeaderComponent={
            <View className="pb-6">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text style={[theme.fonts.caption, { color: theme.colors.primary }]} className="text-xs">
                    ADMIN DASHBOARD
                  </Text>
                  <Text style={[theme.fonts.displayLarge, { color: theme.colors.text }]} className="text-4xl">
                    Control site activity
                  </Text>
                </View>
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => navigation.goBack()}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 12,
                      backgroundColor: theme.colors.cardStrong,
                      borderWidth: 1,
                      borderColor: theme.colors.border
                    }}
                  >
                    <Ionicons color={theme.colors.textMuted} name="arrow-back" size={20} />
                  </Pressable>
                  <Pressable
                    onPress={() => loadUsers()}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 12,
                      backgroundColor: theme.colors.cardStrong,
                      borderWidth: 1,
                      borderColor: theme.colors.border
                    }}
                  >
                    <Ionicons
                      color={theme.colors.textMuted}
                      name={isRefreshing ? "sync" : "refresh"}
                      size={20}
                    />
                  </Pressable>
                  <Pressable
                    onPress={handleSignOut}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 12,
                      backgroundColor: "rgba(255, 107, 107, 0.1)",
                      borderWidth: 1,
                      borderColor: "#FF6B6B"
                    }}
                  >
                    <Ionicons color="#FF6B6B" name="log-out" size={20} />
                  </Pressable>
                </View>
              </View>

              <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="mt-3 text-sm leading-6">
                Monitor membership, subscriptions, workouts, and community activity from one admin
                workspace.
              </Text>

              <View className="mt-6 flex-row gap-3">
                <Pressable
                  onPress={() => playCard("admin-summary-members", "admin-members-pulse")}
                  style={{ flex: 1 }}
                >
                  <GlassCard style={{ flex: 1 }}>
                    <Text style={[theme.fonts.caption, { color: theme.colors.textSoft }]} className="text-xs">
                      Members
                    </Text>
                    <Text style={[theme.fonts.displayLarge, { color: theme.colors.text }]} className="mt-2 text-4xl">
                      {totalUsers}
                    </Text>
                  </GlassCard>
                </Pressable>
                <Pressable
                  onPress={() => playCard("admin-summary-active", "admin-active-surge")}
                  style={{ flex: 1 }}
                >
                  <GlassCard style={{ flex: 1 }}>
                    <Text style={[theme.fonts.caption, { color: theme.colors.primary }]} className="text-xs">
                      Active
                    </Text>
                    <Text style={[theme.fonts.displayLarge, { color: theme.colors.primary }]} className="mt-2 text-4xl">
                      {activeSubscriptions}
                    </Text>
                  </GlassCard>
                </Pressable>
              </View>

              <View className="mt-3 flex-row gap-3">
                <Pressable
                  onPress={() => playCard("admin-summary-inactive", "admin-inactive-reset")}
                  style={{ flex: 1 }}
                >
                  <GlassCard style={{ flex: 1 }}>
                    <Text style={[theme.fonts.caption, { color: theme.colors.textSoft }]} className="text-xs">
                      Inactive
                    </Text>
                    <Text style={[theme.fonts.displayLarge, { color: theme.colors.text }]} className="mt-2 text-4xl">
                      {inactiveSubscriptions}
                    </Text>
                  </GlassCard>
                </Pressable>
                <Pressable
                  onPress={() => playCard("admin-summary-revenue", "admin-revenue-run")}
                  style={{ flex: 1 }}
                >
                  <GlassCard style={{ flex: 1 }}>
                    <Text style={[theme.fonts.caption, { color: theme.colors.textSoft }]} className="text-xs">
                      Revenue
                    </Text>
                    <Text style={[theme.fonts.displayLarge, { color: theme.colors.text }]} className="mt-2 text-4xl">
                      ${monthlyRevenue}
                    </Text>
                  </GlassCard>
                </Pressable>
              </View>

              <View className="mt-3 flex-row gap-3">
                <Pressable
                  onPress={() => playCard("admin-summary-programs", "admin-programs-studio")}
                  style={{ flex: 1 }}
                >
                  <GlassCard style={{ flex: 1 }}>
                    <Text style={[theme.fonts.caption, { color: theme.colors.textSoft }]} className="text-xs">
                      Programs
                    </Text>
                    <Text style={[theme.fonts.displayLarge, { color: theme.colors.text }]} className="mt-2 text-4xl">
                      {coachingPlans.length}
                    </Text>
                  </GlassCard>
                </Pressable>
                <Pressable
                  onPress={() => playCard("admin-summary-community", "admin-community-wave")}
                  style={{ flex: 1 }}
                >
                  <GlassCard style={{ flex: 1 }}>
                    <Text style={[theme.fonts.caption, { color: theme.colors.textSoft }]} className="text-xs">
                      Community
                    </Text>
                    <Text style={[theme.fonts.displayLarge, { color: theme.colors.text }]} className="mt-2 text-4xl">
                      {communityPosts.length}
                    </Text>
                  </GlassCard>
                </Pressable>
              </View>

              <View className="mt-3 flex-row gap-3">
                <Pressable
                  onPress={() => playCard("admin-summary-workouts", "admin-workout-catalog")}
                  style={{ flex: 1 }}
                >
                  <GlassCard style={{ flex: 1 }}>
                    <Text style={[theme.fonts.caption, { color: theme.colors.textSoft }]} className="text-xs">
                      Workouts
                    </Text>
                    <Text style={[theme.fonts.displayLarge, { color: theme.colors.text }]} className="mt-2 text-4xl">
                      {demoClasses.length}
                    </Text>
                  </GlassCard>
                </Pressable>
                <Pressable
                  onPress={() => playCard("admin-summary-live", "admin-live-control")}
                  style={{ flex: 1 }}
                >
                  <GlassCard style={{ flex: 1 }}>
                    <Text style={[theme.fonts.caption, { color: theme.colors.textSoft }]} className="text-xs">
                      Live Now
                    </Text>
                    <Text style={[theme.fonts.displayLarge, { color: theme.colors.text }]} className="mt-2 text-4xl">
                      {liveClasses}
                    </Text>
                  </GlassCard>
                </Pressable>
              </View>

              <Text style={[theme.fonts.display, { color: theme.colors.text }]} className="mt-8 text-3xl">
                Member Access
              </Text>
              <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="mt-2 text-sm leading-6">
                Activate or remove premium access for each member from this panel.
              </Text>
            </View>
          }
          ListEmptyComponent={
            <GlassCard>
              <Text style={[theme.fonts.bodyBold, { color: theme.colors.text }]} className="text-base">
                No members yet
              </Text>
              <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="mt-2 text-sm">
                New registrations will appear here for admin review and subscription control.
              </Text>
            </GlassCard>
          }
          renderItem={({ item }) => (
            <GlassCard padded={false} style={{ marginBottom: 12 }}>
              <View className="flex-row items-center gap-4 p-4">
                <Pressable
                  onPress={() =>
                    playCard(
                      `admin-member-${item.id}`,
                      item.hasActiveSubscription ? "admin-active-surge" : "admin-inactive-reset"
                    )
                  }
                  style={{ flex: 1 }}
                >
                  <View className="flex-row items-center gap-4">
                    <View
                      style={{ backgroundColor: theme.colors.backgroundElevated }}
                      className="h-12 w-12 items-center justify-center rounded-full"
                    >
                      <Ionicons color={theme.colors.primary} name="play-circle" size={20} />
                    </View>
                    <View className="flex-1">
                      <Text style={[theme.fonts.bodyBold, { color: theme.colors.text }]} className="text-sm">
                        {item.name}
                      </Text>
                      <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="text-xs">
                        {item.email}
                      </Text>
                      <View className="mt-2 flex-row items-center gap-2">
                        <View
                          style={{
                            backgroundColor: item.hasActiveSubscription
                              ? "rgba(16, 185, 129, 0.2)"
                              : "rgba(255, 107, 107, 0.2)"
                          }}
                          className="rounded-full px-3 py-1"
                        >
                          <Text
                            style={[
                              theme.fonts.caption,
                              {
                                color: item.hasActiveSubscription ? theme.colors.primary : "#FF6B6B"
                              }
                            ]}
                            className="text-xs"
                          >
                            {item.hasActiveSubscription ? "Active" : "Inactive"}
                          </Text>
                        </View>
                        <Text style={[theme.fonts.caption, { color: theme.colors.textMuted }]} className="text-xs">
                          {item.membership}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => handleToggleSubscription(item)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: item.hasActiveSubscription ? theme.colors.primary : theme.colors.border,
                    backgroundColor: item.hasActiveSubscription
                      ? "rgba(16, 185, 129, 0.08)"
                      : theme.colors.cardStrong
                  }}
                >
                  <Ionicons
                    color={item.hasActiveSubscription ? theme.colors.primary : theme.colors.textMuted}
                    name={item.hasActiveSubscription ? "checkmark" : "add"}
                    size={16}
                  />
                </Pressable>
              </View>
            </GlassCard>
          )}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
