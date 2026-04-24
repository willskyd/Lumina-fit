import { demoClasses } from "./mockData";
import type { FitnessClass } from "../types/models";

export type PlaybackItem = FitnessClass & {
  videoSources?: string[];
};

const sampleVideoSources = {
  blaze: [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
  ],
  escapes: [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
  ],
  joyrides: [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
  ],
  tears: [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"
  ],
  elephants: [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  ],
  subaru: [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
  ],
  fun: [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
  ],
  meltdowns: [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  ],
  bunny: [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
  ],
  sintel: [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
  ]
} as const;

const cyclingInstructor = demoClasses.find((item) => item.category === "cycling")?.instructor ?? demoClasses[0].instructor;
const strengthInstructor = demoClasses.find((item) => item.category === "strength")?.instructor ?? demoClasses[1].instructor;
const mobilityInstructor = demoClasses.find((item) => item.category === "mobility")?.instructor ?? demoClasses[2].instructor;
const cardioInstructor = demoClasses.find((item) => item.category === "cardio")?.instructor ?? demoClasses[5].instructor;

function createClip({
  id,
  title,
  subtitle,
  description,
  category,
  level,
  intensity,
  duration,
  calories,
  participants,
  coverImage,
  thumbnail,
  instructor,
  tags,
  videoSources
}: {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: FitnessClass["category"];
  level: FitnessClass["level"];
  intensity: FitnessClass["intensity"];
  duration: number;
  calories: number;
  participants: number;
  coverImage: string;
  thumbnail: string;
  instructor: FitnessClass["instructor"];
  tags: string[];
  videoSources: readonly string[];
}): PlaybackItem {
  return {
    id,
    title,
    subtitle,
    description,
    category,
    duration,
    intensity,
    level,
    calories,
    participants,
    live: false,
    coverImage,
    thumbnail,
    videoUrl: videoSources[0],
    videoSources: [...videoSources],
    instructor,
    tags
  };
}

export const experienceClips: PlaybackItem[] = [
  createClip({
    id: "profile-member-reel",
    title: "Member Momentum Reel",
    subtitle: "A polished personal highlight sequence",
    description: "A premium-cut recap that turns the member profile into a living highlight reel.",
    category: "strength",
    level: "Intermediate",
    intensity: "steady",
    duration: 2,
    calories: 60,
    participants: 412,
    coverImage: demoClasses[1].coverImage,
    thumbnail: demoClasses[1].thumbnail,
    instructor: strengthInstructor,
    tags: ["Profile", "Highlight", "Momentum"],
    videoSources: sampleVideoSources.bunny
  }),
  createClip({
    id: "profile-sessions-recap",
    title: "Sessions Recap",
    subtitle: "A pulse check on your weekly output",
    description: "Fast-cut training moments showing consistency, pace, and progression over the week.",
    category: "cardio",
    level: "Intermediate",
    intensity: "ignite",
    duration: 2,
    calories: 72,
    participants: 536,
    coverImage: demoClasses[5].coverImage,
    thumbnail: demoClasses[5].thumbnail,
    instructor: cardioInstructor,
    tags: ["Sessions", "Recap", "Output"],
    videoSources: sampleVideoSources.sintel
  }),
  createClip({
    id: "profile-saved-showcase",
    title: "Saved Favorites Showcase",
    subtitle: "A preview reel of your saved sessions",
    description: "A polished set of clips stitched together from the workouts waiting in your favorites.",
    category: "cycling",
    level: "Beginner",
    intensity: "steady",
    duration: 2,
    calories: 48,
    participants: 389,
    coverImage: demoClasses[0].coverImage,
    thumbnail: demoClasses[0].thumbnail,
    instructor: cyclingInstructor,
    tags: ["Saved", "Favorites", "Preview"],
    videoSources: sampleVideoSources.fun
  }),
  createClip({
    id: "plan-coach-insight",
    title: "Coach Insight Preview",
    subtitle: "Your coach briefing, now in motion",
    description: "A cinematic coach update visualizing recovery, readiness, and your next recommended lift.",
    category: "strength",
    level: "Advanced",
    intensity: "steady",
    duration: 2,
    calories: 58,
    participants: 298,
    coverImage: demoClasses[1].coverImage,
    thumbnail: demoClasses[1].thumbnail,
    instructor: strengthInstructor,
    tags: ["Coach", "Insight", "Recovery"],
    videoSources: sampleVideoSources.blaze
  }),
  createClip({
    id: "plan-signature-recomp",
    title: "Signature Recomp Preview",
    subtitle: "An upper-body program in motion",
    description: "A dedicated video preview for the flagship recomposition program.",
    category: "strength",
    level: "Advanced",
    intensity: "steady",
    duration: 2,
    calories: 64,
    participants: 321,
    coverImage: demoClasses[1].coverImage,
    thumbnail: demoClasses[1].thumbnail,
    instructor: strengthInstructor,
    tags: ["Plan", "Recomp", "Strength"],
    videoSources: sampleVideoSources.joyrides
  }),
  createClip({
    id: "plan-studio-conditioning",
    title: "Studio Conditioning Preview",
    subtitle: "Threshold cardio with premium pacing",
    description: "A cardio-led program preview built around endurance, tempo, and sustained output.",
    category: "cardio",
    level: "Advanced",
    intensity: "ignite",
    duration: 2,
    calories: 70,
    participants: 287,
    coverImage: demoClasses[5].coverImage,
    thumbnail: demoClasses[5].thumbnail,
    instructor: cardioInstructor,
    tags: ["Plan", "Conditioning", "Tempo"],
    videoSources: sampleVideoSources.tears
  }),
  createClip({
    id: "plan-restore-performance",
    title: "Restore + Perform Preview",
    subtitle: "Mobility and breathwork in motion",
    description: "A recovery-forward preview blending mobility, posture work, and measured strength.",
    category: "mobility",
    level: "Beginner",
    intensity: "restore",
    duration: 2,
    calories: 36,
    participants: 244,
    coverImage: demoClasses[2].coverImage,
    thumbnail: demoClasses[2].thumbnail,
    instructor: mobilityInstructor,
    tags: ["Plan", "Restore", "Mobility"],
    videoSources: sampleVideoSources.elephants
  }),
  createClip({
    id: "community-leaderboard-burn",
    title: "Leaderboard Burn Reel",
    subtitle: "A competition-driven sprint montage",
    description: "A fast-moving challenge reel built for the leaderboard and streak culture of the app.",
    category: "cardio",
    level: "Intermediate",
    intensity: "ignite",
    duration: 2,
    calories: 66,
    participants: 402,
    coverImage: demoClasses[5].coverImage,
    thumbnail: demoClasses[5].thumbnail,
    instructor: cardioInstructor,
    tags: ["Community", "Leaderboard", "Sprint"],
    videoSources: sampleVideoSources.meltdowns
  }),
  createClip({
    id: "community-post-elena",
    title: "Threshold Ride Social Cut",
    subtitle: "A challenge post with real movement",
    description: "A cardio-driven social clip for the Spring Ascend challenge feed.",
    category: "cycling",
    level: "Intermediate",
    intensity: "ignite",
    duration: 2,
    calories: 62,
    participants: 355,
    coverImage: demoClasses[0].coverImage,
    thumbnail: demoClasses[0].thumbnail,
    instructor: cyclingInstructor,
    tags: ["Community", "Ride", "Challenge"],
    videoSources: sampleVideoSources.subaru
  }),
  createClip({
    id: "community-post-marcus",
    title: "Strength Progress Social Cut",
    subtitle: "A program progress post in motion",
    description: "A dedicated social highlight for the Recomp Society feed.",
    category: "strength",
    level: "Advanced",
    intensity: "steady",
    duration: 2,
    calories: 56,
    participants: 319,
    coverImage: demoClasses[1].coverImage,
    thumbnail: demoClasses[1].thumbnail,
    instructor: strengthInstructor,
    tags: ["Community", "Strength", "Progress"],
    videoSources: sampleVideoSources.escapes
  }),
  createClip({
    id: "admin-members-pulse",
    title: "Members Pulse",
    subtitle: "A dashboard reel for total member activity",
    description: "A control-room playback item visualizing member traffic and session energy.",
    category: "strength",
    level: "Intermediate",
    intensity: "steady",
    duration: 2,
    calories: 50,
    participants: 610,
    coverImage: demoClasses[1].coverImage,
    thumbnail: demoClasses[1].thumbnail,
    instructor: strengthInstructor,
    tags: ["Admin", "Members", "Control"],
    videoSources: sampleVideoSources.bunny
  }),
  createClip({
    id: "admin-active-surge",
    title: "Active Subscribers Surge",
    subtitle: "A live view of premium engagement",
    description: "A dedicated admin clip for active member momentum and subscription engagement.",
    category: "cycling",
    level: "Intermediate",
    intensity: "ignite",
    duration: 2,
    calories: 54,
    participants: 588,
    coverImage: demoClasses[0].coverImage,
    thumbnail: demoClasses[0].thumbnail,
    instructor: cyclingInstructor,
    tags: ["Admin", "Active", "Premium"],
    videoSources: sampleVideoSources.joyrides
  }),
  createClip({
    id: "admin-inactive-reset",
    title: "Inactive Reset Queue",
    subtitle: "A recovery-focused retention reel",
    description: "A calm, retention-focused clip used for inactive subscription and reactivation views.",
    category: "mobility",
    level: "Beginner",
    intensity: "restore",
    duration: 2,
    calories: 28,
    participants: 192,
    coverImage: demoClasses[2].coverImage,
    thumbnail: demoClasses[2].thumbnail,
    instructor: mobilityInstructor,
    tags: ["Admin", "Inactive", "Retention"],
    videoSources: sampleVideoSources.elephants
  }),
  createClip({
    id: "admin-revenue-run",
    title: "Revenue Run",
    subtitle: "A control-room view of business momentum",
    description: "A premium analytics reel for dashboard revenue monitoring.",
    category: "cardio",
    level: "Advanced",
    intensity: "ignite",
    duration: 2,
    calories: 68,
    participants: 421,
    coverImage: demoClasses[5].coverImage,
    thumbnail: demoClasses[5].thumbnail,
    instructor: cardioInstructor,
    tags: ["Admin", "Revenue", "Momentum"],
    videoSources: sampleVideoSources.tears
  }),
  createClip({
    id: "admin-programs-studio",
    title: "Programs Studio",
    subtitle: "A reel for coaching plan coverage",
    description: "A dashboard preview for active programs and coaching inventory.",
    category: "strength",
    level: "Intermediate",
    intensity: "steady",
    duration: 2,
    calories: 44,
    participants: 341,
    coverImage: demoClasses[1].coverImage,
    thumbnail: demoClasses[1].thumbnail,
    instructor: strengthInstructor,
    tags: ["Admin", "Programs", "Coaching"],
    videoSources: sampleVideoSources.fun
  }),
  createClip({
    id: "admin-community-wave",
    title: "Community Wave",
    subtitle: "A social engagement dashboard reel",
    description: "A social pulse playback item for community monitoring inside admin.",
    category: "cardio",
    level: "Intermediate",
    intensity: "ignite",
    duration: 2,
    calories: 52,
    participants: 467,
    coverImage: demoClasses[5].coverImage,
    thumbnail: demoClasses[5].thumbnail,
    instructor: cardioInstructor,
    tags: ["Admin", "Community", "Social"],
    videoSources: sampleVideoSources.meltdowns
  }),
  createClip({
    id: "admin-workout-catalog",
    title: "Workout Catalog Control",
    subtitle: "A reel for content inventory",
    description: "A content-focused admin clip visualizing the depth of the workout library.",
    category: "yoga",
    level: "Beginner",
    intensity: "steady",
    duration: 2,
    calories: 34,
    participants: 276,
    coverImage: demoClasses[4].coverImage,
    thumbnail: demoClasses[4].thumbnail,
    instructor: mobilityInstructor,
    tags: ["Admin", "Catalog", "Content"],
    videoSources: sampleVideoSources.escapes
  }),
  createClip({
    id: "admin-live-control",
    title: "Live Control Monitor",
    subtitle: "A real-time reel for live class ops",
    description: "A dashboard item dedicated to the live class side of the platform.",
    category: "cycling",
    level: "Intermediate",
    intensity: "ignite",
    duration: 2,
    calories: 59,
    participants: 498,
    coverImage: demoClasses[0].coverImage,
    thumbnail: demoClasses[0].thumbnail,
    instructor: cyclingInstructor,
    tags: ["Admin", "Live", "Operations"],
    videoSources: sampleVideoSources.sintel
  })
];

export const playbackCatalog: PlaybackItem[] = [
  ...demoClasses.map((item) => ({
    ...item,
    videoSources: [item.videoUrl]
  })),
  ...experienceClips
];

export function getPlaybackItemById(id: string) {
  return playbackCatalog.find((item) => item.id === id) ?? playbackCatalog[0];
}
