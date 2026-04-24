import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { FloatingTabBar } from "../components/navigation/FloatingTabBar";
import { useAppStore } from "../store/useAppStore";
import { CommunityScreen } from "../screens/CommunityScreen";
import { DiscoverScreen } from "../screens/DiscoverScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { PlansScreen } from "../screens/PlansScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { ProgressScreen } from "../screens/ProgressScreen";
import { WorkoutPlayerScreen } from "../screens/WorkoutPlayerScreen";
import { SubscriptionScreen } from "../screens/SubscriptionScreen";
import { AdminPanelScreen } from "../screens/AdminPanelScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { SignInScreen } from "../screens/auth/SignInScreen";
import type {
  AuthStackParamList,
  MainTabParamList,
  RootStackParamList
} from "./types";

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen component={SignInScreen} name="SignIn" />
      <AuthStack.Screen component={RegisterScreen} name="Register" />
    </AuthStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tab.Screen component={HomeScreen} name="Home" />
      <Tab.Screen component={DiscoverScreen} name="Discover" />
      <Tab.Screen component={ProgressScreen} name="Progress" />
      <Tab.Screen component={CommunityScreen} name="Community" />
      <Tab.Screen component={ProfileScreen} name="Profile" />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const hasCompletedOnboarding = useAppStore((state) => state.hasCompletedOnboarding);
  const user = useAppStore((state) => state.user);
  const authReady = useAppStore((state) => state.authReady);
  const isAdmin = useAppStore((state) => state.isAdmin);

  if (!authReady) {
    return null;
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!hasCompletedOnboarding ? (
        <RootStack.Screen component={OnboardingScreen} name="Onboarding" />
      ) : !user ? (
        <RootStack.Screen component={AuthNavigator} name="Auth" />
      ) : (
        // Both Admin and Regular Users see MainTabs
        <>
          <RootStack.Screen component={MainTabs} name="MainTabs" />
          <RootStack.Screen component={PlansScreen} name="Plans" />
          <RootStack.Screen component={SubscriptionScreen} name="Subscription" />
          <RootStack.Screen component={WorkoutPlayerScreen} name="WorkoutPlayer" />
          {isAdmin && <RootStack.Screen component={AdminPanelScreen} name="AdminPanel" />}
        </>
      )}
    </RootStack.Navigator>
  );
}
