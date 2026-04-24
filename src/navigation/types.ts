export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  MainTabs: undefined;
  Plans: undefined;
  WorkoutPlayer: { workoutId: string; autoplay?: boolean };
  Subscription: undefined;
  AdminPanel: undefined;
};

export type AuthStackParamList = {
  SignIn: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  Progress: undefined;
  Community: undefined;
  Profile: undefined;
};
