import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "../components/GlassCard";
import { PremiumButton } from "../components/PremiumButton";
import { updateUserSubscription } from "../lib/localAuth";
import { openPlaybackFromCard } from "../lib/playback";
import { useAppTheme } from "../providers/ThemeProvider";
import { useAppStore } from "../store/useAppStore";
import type { RootStackParamList } from "../navigation/types";

export function SubscriptionScreen() {
  const { theme } = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAppStore((state) => state.user);
  const setCurrentWorkout = useAppStore((state) => state.setCurrentWorkout);
  const updateUserSubscriptionStore = useAppStore((state) => state.updateUserSubscription);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isSubscribed = user?.hasActiveSubscription ?? false;
  const subscriptionExpiry = user?.subscriptionExpiry;

  function playCard(seed: string, preferredWorkoutId?: string) {
    return openPlaybackFromCard({
      navigation,
      setCurrentWorkout,
      seed,
      preferredWorkoutId
    });
  }

  async function handleActivateSubscription() {
    if (!user) return;

    try {
      setIsProcessing(true);
      // Add 30 days to current date
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      await updateUserSubscription(user.id, true, expiryDate.toISOString());
      updateUserSubscriptionStore(true, expiryDate.toISOString());

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to activate subscription:", error);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleCancelSubscription() {
    if (!user) return;

    try {
      setIsProcessing(true);
      await updateUserSubscription(user.id, false, null);
      updateUserSubscriptionStore(false, null);
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <LinearGradient colors={theme.colors.heroGradient} style={{ flex: 1 }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mt-4 gap-3">
            <Text style={[theme.fonts.caption, { color: theme.colors.primary }]} className="text-xs">
              MEMBERSHIP MANAGEMENT
            </Text>
            <Text style={[theme.fonts.displayLarge, { color: theme.colors.text }]} className="text-5xl">
              Your Subscription
            </Text>
            <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="text-sm leading-6">
              Manage your membership and access all premium gym facilities.
            </Text>
          </View>

          {/* Status Card */}
          <Pressable onPress={() => playCard("subscription-status", isSubscribed ? "class-1" : "class-3")}>
            <GlassCard style={{ marginTop: 24 }}>
              <View className="flex-row items-center gap-4">
                <View
                  style={{
                    backgroundColor: isSubscribed ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 107, 107, 0.2)",
                    borderColor: isSubscribed ? theme.colors.primary : "#FF6B6B"
                  }}
                  className="h-16 w-16 items-center justify-center rounded-full border-2"
                >
                  <Ionicons
                    color={isSubscribed ? theme.colors.primary : "#FF6B6B"}
                    name={isSubscribed ? "play-circle" : "play-outline"}
                    size={32}
                  />
                </View>
                <View className="flex-1">
                  <Text style={[theme.fonts.bodyBold, { color: theme.colors.text }]} className="text-lg">
                    {isSubscribed ? "Active Subscription" : "No Active Subscription"}
                  </Text>
                  <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="text-sm mt-1">
                    {isSubscribed
                      ? subscriptionExpiry
                        ? `Expires: ${new Date(subscriptionExpiry).toLocaleDateString()}`
                        : "Lifetime access"
                      : "Get unlimited access to all facilities"}
                  </Text>
                </View>
              </View>
            </GlassCard>
          </Pressable>

          {/* Plans Section */}
          <View className="mt-8 gap-4">
            <Text style={[theme.fonts.display, { color: theme.colors.text }]} className="text-3xl">
              Premium Plan
            </Text>

            <Pressable onPress={() => playCard("subscription-plan", "class-1")}>
            <GlassCard>
              <View className="gap-4">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text style={[theme.fonts.bodyBold, { color: theme.colors.text }]} className="text-lg">
                      Monthly Premium
                    </Text>
                    <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="text-sm">
                      Billed monthly
                    </Text>
                  </View>
                  <Text
                    style={[theme.fonts.displayLarge, { color: theme.colors.primary }]}
                    className="text-3xl"
                  >
                    $9
                  </Text>
                </View>

                <View
                  style={{ backgroundColor: theme.colors.backgroundElevated }}
                  className="rounded-2xl px-4 py-3"
                >
                  <Text style={[theme.fonts.bodyMedium, { color: theme.colors.text }]} className="text-sm">
                    What's included:
                  </Text>
                  {[
                    "✓ Unlimited class access",
                    "✓ All workout videos",
                    "✓ Progress tracking",
                    "✓ Community features",
                    "✓ 24/7 gym facility access"
                  ].map((item, index) => (
                    <Text
                      key={index}
                      style={[theme.fonts.body, { color: theme.colors.textMuted }]}
                      className="text-sm mt-2"
                    >
                      {item}
                    </Text>
                  ))}
                </View>

                {!isSubscribed ? (
                  <PremiumButton
                    onPress={handleActivateSubscription}
                    title={isProcessing ? "Processing..." : "Activate Subscription"}
                    variant="primary"
                  />
                ) : (
                  <PremiumButton
                    onPress={handleCancelSubscription}
                    title={isProcessing ? "Processing..." : "Cancel Subscription"}
                    variant="secondary"
                  />
                )}
              </View>
            </GlassCard>
            </Pressable>
          </View>

          {/* Success Message */}
          {showSuccess && (
            <GlassCard style={{ marginTop: 16, backgroundColor: "rgba(16, 185, 129, 0.1)" }}>
              <View className="flex-row items-center gap-3">
                <Ionicons color={theme.colors.primary} name="checkmark-circle" size={24} />
                <Text
                  style={[theme.fonts.bodyBold, { color: theme.colors.primary }]}
                  className="text-sm"
                >
                  Subscription activated! Welcome to premium.
                </Text>
              </View>
            </GlassCard>
          )}

          {/* FAQ */}
          <View className="mt-8 gap-4">
            <Text style={[theme.fonts.display, { color: theme.colors.text }]} className="text-2xl">
              FAQ
            </Text>

            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes, you can cancel your subscription at any time."
              },
              {
                q: "What happens when it expires?",
                a: "Your subscription will renew automatically unless you cancel."
              },
              {
                q: "Do I need a payment method?",
                a: "In demo mode, subscriptions are simulated. No actual payment required."
              }
            ].map((item, index) => (
              <Pressable
                key={index}
                onPress={() => playCard(`subscription-faq-${index}`, index === 0 ? "class-3" : "class-1")}
              >
                <GlassCard>
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1">
                      <Text style={[theme.fonts.bodyBold, { color: theme.colors.text }]} className="text-sm">
                        {item.q}
                      </Text>
                      <Text
                        style={[theme.fonts.body, { color: theme.colors.textMuted }]}
                        className="text-sm mt-2"
                      >
                        {item.a}
                      </Text>
                    </View>
                    <Ionicons color={theme.colors.primary} name="play" size={16} />
                  </View>
                </GlassCard>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
