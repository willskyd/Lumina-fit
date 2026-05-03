import { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "../components/GlassCard";
import { PremiumButton } from "../components/PremiumButton";
import { ThemeToggle } from "../components/ThemeToggle";
import { communityPosts, demoClasses } from "../data/mockData";
import { signOutSupabase } from "../lib/auth";
import { getAllStoredUsers, signOutLocal } from "../lib/localAuth";
import { openPlaybackFromCard } from "../lib/playback";
import {
  areNotificationsSupported,
  clearWorkoutReminders,
  getNotificationsUnsupportedReason,
  scheduleDailyWorkoutReminder
} from "../lib/notifications";
import { useAppTheme } from "../providers/ThemeProvider";
import { useAppStore } from "../store/useAppStore";
import type { RootStackParamList } from "../navigation/types";

interface AdminSummary {
  totalMembers: number;
  activeMembers: number;
}

export function ProfileScreen() {
  const { theme } = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAppStore((state) => state.user);
  const isAdmin = useAppStore((state) => state.isAdmin);
  const signOut = useAppStore((state) => state.signOut);
  const notificationsEnabled = useAppStore((state) => state.notificationsEnabled);
  const setNotificationsEnabled = useAppStore((state) => state.setNotificationsEnabled);
  const favoriteWorkoutIds = useAppStore((state) => state.favoriteWorkoutIds);
  const setCurrentWorkout = useAppStore((state) => state.setCurrentWorkout);
  const notificationsUnsupportedReason = getNotificationsUnsupportedReason();
  const [adminSummary, setAdminSummary] = useState<AdminSummary>({
    totalMembers: 0,
    activeMembers: 0
  });

  useEffect(() => {
    if (!areNotificationsSupported() && notificationsEnabled) {
      setNotificationsEnabled(false);
    }
  }, [notificationsEnabled, setNotificationsEnabled]);

  useEffect(() => {
    let mounted = true;

    async function loadAdminSummary() {
      if (!isAdmin) {
        if (mounted) {
          setAdminSummary({ totalMembers: 0, activeMembers: 0 });
        }
        return;
      }

      const allUsers = await getAllStoredUsers();
      const members = allUsers.filter((member) => !member.isAdmin);

      if (mounted) {
        setAdminSummary({
          totalMembers: members.length,
          activeMembers: members.filter((member) => member.hasActiveSubscription).length
        });
      }
    }

    loadAdminSummary().catch(() => {
      if (mounted) {
        setAdminSummary({ totalMembers: 0, activeMembers: 0 });
      }
    });

    return () => {
      mounted = false;
    };
  }, [isAdmin]);

  async function handleNotifications() {
    if (notificationsUnsupportedReason) {
      setNotificationsEnabled(false);
      Alert.alert("Development build required", notificationsUnsupportedReason);
      return;
    }

    if (notificationsEnabled) {
      await clearWorkoutReminders();
      setNotificationsEnabled(false);
      return;
    }

    const scheduled = await scheduleDailyWorkoutReminder();
    setNotificationsEnabled(scheduled);
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

  return (
    <LinearGradient colors={theme.colors.heroGradient} style={{ flex: 1 }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 170 }}
          showsVerticalScrollIndicator={false}
        >
          <Pressable 
          // onPress={() => playCard("profile-header", "profile-member-reel")}
          >
            <GlassCard>
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text style={[theme.fonts.caption, { color: theme.colors.primary }]} className="text-xs">
                      {user?.membership ?? "Lumina Member"}
                    </Text>
                    {isAdmin && (
                      <View
                        style={{ backgroundColor: theme.colors.primary }}
                        className="rounded-full px-2 py-0.5"
                      >
                        <Text style={[theme.fonts.caption, { color: theme.colors.background }]} className="text-xs font-bold">
                          Admin
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={[theme.fonts.displayLarge, { color: theme.colors.text }]} className="mt-2 text-4xl">
                    {user?.name ?? "Ariana Cole"}
                  </Text>
                  <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="mt-2 text-sm">
                    {user?.email ?? "ariana@lumina.fit"}
                  </Text>
                </View>
                <View
                  style={{ backgroundColor: theme.colors.backgroundElevated }}
                  className="h-16 w-16 items-center justify-center rounded-full"
                >
                  <Ionicons color={theme.colors.primary} name="play-circle" size={28} />
                </View>
              </View>
            </GlassCard>
          </Pressable>

          <View className="mt-6 flex-row gap-4">
            {[
              { label: "Sessions", value: "124", preferredWorkoutId: "profile-sessions-recap" },
              {
                label: "Saved",
                value: String(favoriteWorkoutIds.length),
                preferredWorkoutId: "profile-saved-showcase"
              }
            ].map((item) => (
              <Pressable
                key={item.label}
                // onPress={() => playCard(`profile-stat-${item.label}`, item.preferredWorkoutId)}
                style={{ flex: 1 }}
              >
                <GlassCard style={{ flex: 1 }}>
                  <Text style={[theme.fonts.caption, { color: theme.colors.textSoft }]} className="text-xs">
                    {item.label}
                  </Text>
                  <Text style={[theme.fonts.displayLarge, { color: theme.colors.text }]} className="mt-2 text-4xl">
                    {item.value}
                  </Text>
                </GlassCard>
              </Pressable>
            ))}
          </View>

          {isAdmin && (
            <GlassCard style={{ marginTop: 24 }}>
              <View className="gap-4">
                <View>
                  <Text style={[theme.fonts.caption, { color: theme.colors.primary }]} className="text-xs">
                    CONTROL CENTER
                  </Text>
                  <Text style={[theme.fonts.display, { color: theme.colors.text }]} className="mt-2 text-3xl">
                    Admin dashboard unlocked
                  </Text>
                  <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="mt-2 text-sm leading-6">
                    This account uses the same sign-in as a regular member, with site controls now
                    available from your profile.
                  </Text>
                </View>

                <View className="flex-row gap-3">
                  <View
                    style={{ backgroundColor: theme.colors.backgroundElevated, borderColor: theme.colors.border }}
                    className="flex-1 rounded-2xl border px-4 py-3"
                  >
                    <Text style={[theme.fonts.caption, { color: theme.colors.textSoft }]} className="text-xs">
                      Members
                    </Text>
                    <Text style={[theme.fonts.display, { color: theme.colors.text }]} className="mt-2 text-2xl">
                      {adminSummary.totalMembers}
                    </Text>
                  </View>
                  <View
                    style={{ backgroundColor: theme.colors.backgroundElevated, borderColor: theme.colors.border }}
                    className="flex-1 rounded-2xl border px-4 py-3"
                  >
                    <Text style={[theme.fonts.caption, { color: theme.colors.textSoft }]} className="text-xs">
                      Active Subs
                    </Text>
                    <Text style={[theme.fonts.display, { color: theme.colors.text }]} className="mt-2 text-2xl">
                      {adminSummary.activeMembers}
                    </Text>
                  </View>
                </View>

                <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="text-sm">
                  {demoClasses.length} workouts live in catalog and {communityPosts.length} community
                  posts visible in the app.
                </Text>

                <PremiumButton
                  onPress={() => navigation.navigate("AdminPanel")}
                  title="Open Admin Dashboard"
                  variant="primary"
                />
              </View>
            </GlassCard>
          )}

          <View className="mt-8 gap-4">
            <ThemeToggle />
            <PremiumButton
              onPress={handleNotifications}
              subtitle={notificationsUnsupportedReason ?? undefined}
              title={
                notificationsUnsupportedReason
                  ? "Use Dev Build For Reminders"
                  : notificationsEnabled
                    ? "Disable Workout Reminder"
                    : "Enable 7AM Reminder"
              }
              variant="secondary"
            />
            <PremiumButton
              onPress={() => navigation.navigate("Subscription")}
              title={user?.hasActiveSubscription ? "Manage Subscription" : "Upgrade to Premium"}
              variant={user?.hasActiveSubscription ? "secondary" : "primary"}
            />
          </View>

          <View className="mt-8 gap-4">
            <Text style={[theme.fonts.display, { color: theme.colors.text }]} className="text-3xl">
              Saved Workouts
            </Text>
            {demoClasses
              .filter((item) => favoriteWorkoutIds.includes(item.id))
              .map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => playCard(`profile-saved-${item.id}`, item.id)}
                >
                  <View
                    style={{ backgroundColor: theme.colors.cardStrong, borderColor: theme.colors.border }}
                    className="rounded-3xl border px-5 py-4"
                  >
                    <Text style={[theme.fonts.bodyBold, { color: theme.colors.text }]} className="text-base">
                      {item.title}
                    </Text>
                    <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="mt-2 text-sm">
                      {item.duration} min · {item.category.toUpperCase()} · {item.instructor.name}
                    </Text>
                  </View>
                </Pressable>
              ))}
          </View>

          <Pressable
            className="mt-8 items-center rounded-3xl py-4"
            onPress={handleSignOut}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.cardStrong
            }}
          >
            <Text style={[theme.fonts.bodyBold, { color: theme.colors.text }]} className="text-base">
              Sign Out
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
