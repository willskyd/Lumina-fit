import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { demoClasses, demoUser } from "../data/mockData";
import type { AppUser, FitnessClass, ThemePreference } from "../types/models";

interface AppState {
  themePreference: ThemePreference;
  hasCompletedOnboarding: boolean;
  user: AppUser | null;
  currentWorkout: FitnessClass | null;
  notificationsEnabled: boolean;
  favoriteWorkoutIds: string[];
  joinedChallengeIds: string[];
  streak: number;
  authReady: boolean;
  isAdmin: boolean;
  setThemePreference: (preference: ThemePreference) => void;
  completeOnboarding: () => void;
  signInDemo: () => void;
  setUser: (user: AppUser | null) => void;
  signOut: () => void;
  setCurrentWorkout: (workout: FitnessClass | null) => void;
  toggleFavorite: (id: string) => void;
  joinChallenge: (id: string) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setAuthReady: (ready: boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  updateUserSubscription: (hasActive: boolean, expiryDate: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      themePreference: "system",
      hasCompletedOnboarding: false,
      user: null,
      currentWorkout: demoClasses[0],
      notificationsEnabled: false,
      favoriteWorkoutIds: [demoClasses[1].id, demoClasses[2].id],
      joinedChallengeIds: ["plan-1"],
      streak: 18,
      authReady: false,
      isAdmin: false,
      setThemePreference: (themePreference) => set({ themePreference }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      signInDemo: () =>
        set({
          user: demoUser,
          hasCompletedOnboarding: true,
          currentWorkout: demoClasses[0],
          isAdmin: false
        }),
      setUser: (user) => set({ 
        user, 
        isAdmin: user?.membership === "Admin" || user?.isAdmin || false 
      }),
      signOut: () => set({ user: null, isAdmin: false }),
      setCurrentWorkout: (currentWorkout) => set({ currentWorkout }),
      toggleFavorite: (id) =>
        set((state) => ({
          favoriteWorkoutIds: state.favoriteWorkoutIds.includes(id)
            ? state.favoriteWorkoutIds.filter((item) => item !== id)
            : [...state.favoriteWorkoutIds, id]
        })),
      joinChallenge: (id) =>
        set((state) => ({
          joinedChallengeIds: state.joinedChallengeIds.includes(id)
            ? state.joinedChallengeIds
            : [...state.joinedChallengeIds, id]
        })),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setAuthReady: (authReady) => set({ authReady }),
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      updateUserSubscription: (hasActive, expiryDate) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                hasActiveSubscription: hasActive,
                subscriptionExpiry: expiryDate
              }
            : null
        }))
    }),
    {
      name: "lumina-fit-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        themePreference: state.themePreference,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        user: state.user,
        isAdmin: state.isAdmin,
        favoriteWorkoutIds: state.favoriteWorkoutIds,
        joinedChallengeIds: state.joinedChallengeIds,
        notificationsEnabled: state.notificationsEnabled
      })
    }
  )
);
