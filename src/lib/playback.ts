import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { playbackCatalog } from "../data/playbackCatalog";
import type { RootStackParamList } from "../navigation/types";
import type { FitnessClass, WorkoutCategory } from "../types/models";
import { triggerHaptic } from "./haptics";

type RootNavigation = NativeStackNavigationProp<RootStackParamList>;
type HapticTone = "selection" | "soft" | "success";

interface OpenPlaybackOptions {
  navigation: RootNavigation;
  setCurrentWorkout: (workout: FitnessClass | null) => void;
  seed: string;
  preferredWorkoutId?: string;
  category?: WorkoutCategory;
  hapticTone?: HapticTone;
}

function hashSeed(seed: string) {
  return Array.from(seed).reduce((total, character) => total + character.charCodeAt(0), 0);
}

export function resolvePlaybackWorkout({
  seed,
  preferredWorkoutId,
  category
}: Pick<OpenPlaybackOptions, "seed" | "preferredWorkoutId" | "category">) {
  if (preferredWorkoutId) {
    const preferredWorkout = playbackCatalog.find((item) => item.id === preferredWorkoutId);
    if (preferredWorkout) {
      return preferredWorkout;
    }
  }

  const categoryMatches = category
    ? playbackCatalog.filter((item) => item.category === category)
    : playbackCatalog;
  const candidates = categoryMatches.length > 0 ? categoryMatches : playbackCatalog;

  return candidates[hashSeed(seed) % candidates.length];
}

export async function openPlaybackFromCard({
  navigation,
  setCurrentWorkout,
  seed,
  preferredWorkoutId,
  category,
  hapticTone = "soft"
}: OpenPlaybackOptions) {
  const workout = resolvePlaybackWorkout({ seed, preferredWorkoutId, category });

  await triggerHaptic(hapticTone);
  setCurrentWorkout(workout);
  navigation.navigate("WorkoutPlayer", { workoutId: workout.id, autoplay: true });
}
