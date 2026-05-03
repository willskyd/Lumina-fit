import type {
  AppUser,
  CoachingPlan,
  CommunityPost,
  FitnessClass,
  Instructor,
  LeaderboardEntry,
  MeasurementPoint,
  PersonalRecord,
  ProgressPoint
} from "../types/models";

const instructors: Instructor[] = [
  {
    id: "inst-1",
    name: "Maya Sterling",
    title: "Performance Coach",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    quote: "You do not chase consistency. You become it.",
    specialties: ["Strength", "Athletic Conditioning", "Mindset"]
  },
  {
    id: "inst-2",
    name: "Luca Hale",
    title: "Mobility Director",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    quote: "Elegant movement is a luxury you earn every day.",
    specialties: ["Mobility", "Recovery", "Yoga"]
  },
  {
    id: "inst-3",
    name: "Nia Park",
    title: "Cardio Artist",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    quote: "Intensity feels effortless when the rhythm takes over.",
    specialties: ["HIIT", "Cycling", "Dance Cardio"]
  }
];

export const demoClasses: FitnessClass[] = [
  {
    id: "class-1",
    title: "Midnight Tempo Ride",
    subtitle: "A cinematic live cycling experience",
    description:
      "A 35-minute studio ride with climbing surges, neon city visuals, and precision cues built to spike your confidence.",
    category: "cycling",
    duration: 35,
    intensity: "ignite",
    level: "Intermediate",
    calories: 428,
    participants: 842,
    live: true,
    startTime: "Live in 18 min",
    coverImage:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    videoUrl: require("../../assets/videos/act1.mp4") as any,
    instructor: instructors[2],
    tags: ["Live", "Cycling", "Power Zones"]
  },
  {
    id: "class-2",
    title: "Sculpted Strength: Upper Body",
    subtitle: "Luxury strength with deliberate pacing",
    description:
      "Slow-tempo dumbbell work that builds definition through premium coaching, elevated pacing, and mindful recovery windows.",
    category: "strength",
    duration: 42,
    intensity: "steady",
    level: "Advanced",
    calories: 510,
    participants: 1265,
    live: false,
    coverImage:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
    videoUrl: require("../../assets/videos/activity15.mp4") as any,
    instructor: instructors[0],
    tags: ["Strength", "Dumbbells", "Upper Body"]
  },
  {
    id: "class-3",
    title: "Flow State Mobility",
    subtitle: "Recovery that still feels elite",
    description:
      "A restorative session with deep hip opening, thoracic mobility, and breath-led transitions to leave you lighter and longer.",
    category: "mobility",
    duration: 28,
    intensity: "restore",
    level: "Beginner",
    calories: 164,
    participants: 562,
    live: false,
    coverImage:
      "https://images.unsplash.com/photo-1518611012118-fb1c5d0c5d01?auto=format&fit=crop&w=1200&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1518611012118-fb1c5d0c5d01?auto=format&fit=crop&w=800&q=80",
    videoUrl: require("../../assets/videos/activity5.mp4") as any,
    instructor: instructors[1],
    tags: ["Mobility", "Recovery", "Breathwork"]
  },
  {
    id: "class-4",
    title: "HIIT Atelier",
    subtitle: "Explosive intervals, polished coaching",
    description:
      "Short, brutal intervals designed to feel like a boutique class in a private room, complete with precise recovery timing.",
    category: "hiit",
    duration: 24,
    intensity: "ignite",
    level: "Intermediate",
    calories: 376,
    participants: 918,
    live: false,
    coverImage:
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1200&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=800&q=80",
    videoUrl: require("../../assets/videos/act3.mp4") as any,
    instructor: instructors[0],
    tags: ["HIIT", "Explosive", "Sweat"]
  },
  {
    id: "class-5",
    title: "Alo Glow Vinyasa",
    subtitle: "Strong lines, soft mind",
    description:
      "An elegant vinyasa journey with shoulder opening, standing strength, and calming finish work for flexible power.",
    category: "yoga",
    duration: 31,
    intensity: "steady",
    level: "Beginner",
    calories: 221,
    participants: 670,
    live: false,
    coverImage:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80&sat=-10",
    thumbnail:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80&sat=-10",
    videoUrl: require("../../assets/videos/act2.mp4") as any,
    instructor: instructors[1],
    tags: ["Yoga", "Flexibility", "Mindfulness"]
  },
  {
    id: "class-6",
    title: "Run Club Threshold",
    subtitle: "Cardio built for PRs",
    description:
      "A treadmill-inspired threshold run with exact pacing calls, sleek visuals, and confidence-building cues for faster miles.",
    category: "cardio",
    duration: 30,
    intensity: "ignite",
    level: "Advanced",
    calories: 401,
    participants: 743,
    live: true,
    startTime: "Live tomorrow 6:30 AM",
    coverImage:
      "https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&w=1200&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&w=800&q=80",
    videoUrl: require("../../assets/videos/act7.mp4") as any,
    instructor: instructors[2],
    tags: ["Cardio", "Threshold", "Run"]
  }
];

export const coachingPlans: CoachingPlan[] = [
  {
    id: "plan-1",
    title: "Lumina Signature Recomposition",
    coach: "Maya Sterling",
    summary: "4 focused lifts, 2 mobility rituals, and a weekly recovery score.",
    durationWeeks: 8,
    completion: 62,
    focus: ["Muscle gain", "Fat loss", "Recovery"],
    nextSession: "Tonight · 7:00 PM",
    accent: "#10B981"
  },
  {
    id: "plan-2",
    title: "Studio Lean Conditioning",
    coach: "Nia Park",
    summary: "Cardio blocks with sculpt work and premium interval pacing.",
    durationWeeks: 6,
    completion: 34,
    focus: ["Stamina", "Definition", "Consistency"],
    nextSession: "Tomorrow · 6:30 AM",
    accent: "#D4B16A"
  },
  {
    id: "plan-3",
    title: "Restore + Perform",
    coach: "Luca Hale",
    summary: "Mobility, breathwork, and low-impact strength for resilient joints.",
    durationWeeks: 5,
    completion: 78,
    focus: ["Mobility", "Posture", "Longevity"],
    nextSession: "Today · 9:15 PM",
    accent: "#6EE7C8"
  }
];

export const progressSeries: ProgressPoint[] = [
  { id: "wk1", label: "W1", score: 48 },
  { id: "wk2", label: "W2", score: 58 },
  { id: "wk3", label: "W3", score: 61 },
  { id: "wk4", label: "W4", score: 69 },
  { id: "wk5", label: "W5", score: 74 },
  { id: "wk6", label: "W6", score: 82 }
];

export const measurementSeries: MeasurementPoint[] = [
  { id: "m1", label: "Waist", value: 31 },
  { id: "m2", label: "Arms", value: 15 },
  { id: "m3", label: "Chest", value: 40 },
  { id: "m4", label: "Legs", value: 24 }
];

export const personalRecords: PersonalRecord[] = [
  { id: "pr1", label: "Deadlift", value: "275 lb", delta: "+15 lb" },
  { id: "pr2", label: "5K Pace", value: "24:18", delta: "-1:12" },
  { id: "pr3", label: "Ride Output", value: "312 kj", delta: "+22 kj" }
];

export const leaderboard: LeaderboardEntry[] = [
  {
    id: "lb1",
    name: "Ava Kim",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    localAvatar: require("../../assets/images/lb1.jpg") as any,
    points: 1680,
    streak: 29,
    rank: 1
  },
  {
    id: "lb2",
    name: "Jordan Vale",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    localAvatar: require("../../assets/images/lb2.jpg") as any,
    points: 1612,
    streak: 24,
    rank: 2
  },
  {
    id: "lb3",
    name: "You",
    avatar:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80",
    localAvatar: require("../../assets/images/lb3.jpg") as any,
    points: 1584,
    streak: 18,
    rank: 3
  },
  {
    id: "lb4",
    name: "Noah Reed",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    localAvatar: require("../../assets/images/lb4.jpg") as any,
    points: 1498,
    streak: 16,
    rank: 4
  }
];

export const communityPosts: CommunityPost[] = [
  {
    id: "post-1",
    author: "Elena Mora",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80",
    localAvatar: require("../../assets/images/avatar_elena.jpg") as any,
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=80",
    localImage: require("../../assets/images/post1.jpg") as any,
    caption: "Closed the week with a threshold ride and a mobility reset. Private club energy, every single session.",
    likes: 482,
    challenge: "Spring Ascend",
    timeAgo: "2h ago"
  },
  {
    id: "post-2",
    author: "Marcus Lane",
    avatar:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=200&q=80",
    localAvatar: require("../../assets/images/avatar_marcus.jpg") as any,
    image:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1000&q=80",
    localImage: require("../../assets/images/post2.jpg") as any,
    caption: "Week 6 of Signature Recomposition. Best shoulders I have ever had.",
    likes: 318,
    challenge: "Recomp Society",
    timeAgo: "5h ago"
  }
];

export const demoUser: AppUser = {
  id: "user-demo",
  name: "Ariana Cole",
  email: "ariana@lumina.fit",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  membership: "Founder Tier"
};
