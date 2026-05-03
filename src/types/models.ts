export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export type WorkoutCategory =
  | "strength"
  | "yoga"
  | "hiit"
  | "cardio"
  | "mobility"
  | "recovery"
  | "cycling";

export interface Instructor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  quote: string;
  specialties: string[];
}

export interface FitnessClass {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: WorkoutCategory;
  duration: number;
  intensity: "ignite" | "steady" | "restore";
  level: "Beginner" | "Intermediate" | "Advanced";
  calories: number;
  participants: number;
  live: boolean;
  startTime?: string;
  coverImage: string;
  thumbnail: string;
  videoUrl: string | number;
  instructor: Instructor;
  tags: string[];
}

export interface CoachingPlan {
  id: string;
  title: string;
  coach: string;
  summary: string;
  durationWeeks: number;
  completion: number;
  focus: string[];
  nextSession: string;
  accent: string;
}

export interface ProgressPoint {
  id: string;
  label: string;
  score: number;
}

export interface MeasurementPoint {
  id: string;
  label: string;
  value: number;
}

export interface PersonalRecord {
  id: string;
  label: string;
  value: string;
  delta: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  localAvatar?: any;
  points: number;
  streak: number;
  rank: number;
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  localAvatar?: any;
  image: string;
  localImage?: any;
  caption: string;
  likes: number;
  challenge: string;
  timeAgo: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  membership: string;
  hasActiveSubscription?: boolean;
  subscriptionExpiry?: string | null;
  isAdmin?: boolean;
}
