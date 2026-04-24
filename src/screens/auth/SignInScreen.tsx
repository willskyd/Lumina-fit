import Ionicons from "@expo/vector-icons/Ionicons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppTextInput } from "../../components/AppTextInput";
import { GlassCard } from "../../components/GlassCard";
import { PremiumButton } from "../../components/PremiumButton";
import { signInLocal } from "../../lib/localAuth";
import { useAppTheme } from "../../providers/ThemeProvider";
import { useAppStore } from "../../store/useAppStore";
import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "SignIn">;

export function SignInScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const setUser = useAppStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Welcome to Lumina Fit");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn() {
    if (!email || !password) {
      setStatus("Please enter email and password");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("Signing you in...");
      const user = await signInLocal(email, password);
      if (user) {
        setUser(user);
        setStatus(
          user.isAdmin
            ? "Admin access granted. Open Profile to launch the dashboard."
            : "Welcome back. Your member space is ready."
        );
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <LinearGradient colors={theme.colors.heroGradient} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 150 }}
          showsVerticalScrollIndicator={false}
        >
          <MotiView animate={{ opacity: 1, translateY: 0 }} from={{ opacity: 0, translateY: 24 }}>
            <View className="mt-4 gap-3">
              <Text style={[theme.fonts.caption, { color: theme.colors.primary }]} className="text-xs">
                SIGN IN TO YOUR ACCOUNT
              </Text>
              <Text
                style={[theme.fonts.displayLarge, { color: theme.colors.text }]}
                className="text-5xl"
              >
                Step back into your private gym.
              </Text>
              <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="text-sm leading-6">
                Sign in with your email and password. Admins use the same form and get dashboard
                access inside Profile after login.
              </Text>
            </View>
          </MotiView>

          <GlassCard style={{ marginTop: 28 }}>
            <View className="gap-4">
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
                placeholder="Your password"
                secureTextEntry
                value={password}
              />
              <PremiumButton
                onPress={handleSignIn}
                title={isLoading ? "Signing in..." : "Sign In"}
                variant="primary"
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

          <Pressable
            className="flex-row items-center justify-center gap-2 py-2 mt-6"
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={[theme.fonts.body, { color: theme.colors.textMuted }]} className="text-sm">
              New to Lumina Fit?
            </Text>
            <Text style={[theme.fonts.bodyBold, { color: theme.colors.primary }]} className="text-sm">
              Create account
            </Text>
            <Ionicons color={theme.colors.primary} name="arrow-forward" size={14} />
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
