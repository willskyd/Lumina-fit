import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppTextInput } from "../../components/AppTextInput";
import { GlassCard } from "../../components/GlassCard";
import { PremiumButton } from "../../components/PremiumButton";
import { signUpLocal } from "../../lib/localAuth";
import { useAppTheme } from "../../providers/ThemeProvider";
import { useAppStore } from "../../store/useAppStore";
import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export function RegisterScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const setUser = useAppStore((state) => state.setUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("Create your account to get started.");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister() {
    if (!name || !email || !password || !confirmPassword) {
      setStatus("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setStatus("Password must be at least 6 characters");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("Creating your account...");
      const user = await signUpLocal(email, password, name);
      if (user) {
        setUser(user);
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <LinearGradient colors={theme.colors.heroGradient} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1">
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 150 }}>
          <View className="mt-4 gap-3">
            <Text style={[theme.fonts.caption, { color: theme.colors.primary }]} className="text-xs">
              JOIN THE LUMINA FIT COMMUNITY
            </Text>
            <Text style={[theme.fonts.displayLarge, { color: theme.colors.text }]} className="text-5xl">
              Start strong. Stay luminous.
            </Text>
            <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="text-sm leading-6">
              Create your account to unlock all gym facilities and features.
            </Text>
          </View>

          <GlassCard style={{ marginTop: 28 }}>
            <View className="gap-4">
              <AppTextInput
                editable={!isLoading}
                label="Full Name"
                onChangeText={setName}
                placeholder="Your name"
                value={name}
              />
              <AppTextInput
                autoCapitalize="none"
                editable={!isLoading}
                keyboardType="email-address"
                label="Email"
                onChangeText={setEmail}
                placeholder="your@email.com"
                value={email}
              />
              <AppTextInput
                editable={!isLoading}
                label="Password"
                onChangeText={setPassword}
                placeholder="Choose a strong password"
                secureTextEntry
                value={password}
              />
              <AppTextInput
                editable={!isLoading}
                label="Confirm Password"
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry
                value={confirmPassword}
              />
              <PremiumButton
                onPress={handleRegister}
                title={isLoading ? "Creating account..." : "Create Account"}
              />
              <View
                style={{ borderColor: theme.colors.border }}
                className="rounded-2xl border px-4 py-3"
              >
                <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="text-sm">
                  {status}
                </Text>
              </View>
            </View>
          </GlassCard>

          <Pressable className="items-center py-5" onPress={() => navigation.goBack()}>
            <Text style={[theme.fonts.bodyBold, { color: theme.colors.primary }]} className="text-sm">
              Back to sign in
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
