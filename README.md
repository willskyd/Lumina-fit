# Lumina Fit

Lumina Fit is an Expo-first premium fitness application built with React Native, TypeScript, NativeWind, React Navigation 7, Reanimated, Moti, Zustand, and Supabase scaffolding.

The experience is designed around:

- Cinematic onboarding and authentication
- A luxury light/dark theme with Leaf Green accents
- A custom floating bottom tab bar and instant workout CTA
- Peloton-inspired class discovery and workout playback
- Future-style plans/coaching surfaces
- Rich progress and community screens

## Stack

- Expo SDK 55
- React Native 0.83
- React 19
- TypeScript
- NativeWind v4
- React Navigation 7
- Reanimated 4 + Moti
- Zustand
- Supabase Auth/Database scaffolding
- Expo Video, Haptics, Notifications, Secure Store
- FlashList

Note:
The original brief asked for `expo-av`, but Expo’s current docs have moved video playback to `expo-video`, so this project uses `expo-video` for the production-ready player.

## Project Structure

```text
.
├── App.tsx
├── app.json
├── global.css
├── supabase/
│   ├── schema.sql
│   └── seed.sql
└── src/
    ├── components/
    ├── constants/
    ├── data/
    ├── hooks/
    ├── lib/
    ├── navigation/
    ├── providers/
    ├── screens/
    ├── store/
    └── types/
```

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template and fill in your Supabase project values:

```bash
copy .env.example .env
```

3. Start the app:

```bash
npx expo start
```

4. Open it in:

- Expo Go on iOS or Android
- An emulator/simulator
- Web with `npx expo start --web`

## Verification

The scaffold has already been verified with:

- `npm run typecheck`
- `npx expo export --platform web`

## Supabase Setup

### 1. Create a project

Create a new Supabase project, then copy:

- Project URL
- Anon public key

Add them to `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 2. Create tables and policies

Run the SQL in [schema.sql](/c:/Users/USER/Gym/supabase/schema.sql) in the Supabase SQL editor.

Optional demo inserts are in [seed.sql](/c:/Users/USER/Gym/supabase/seed.sql).

### 3. Google authentication

Lumina Fit uses Supabase-hosted Google OAuth instead of a native Google SDK, which keeps the Expo-managed setup clean.

In Google Cloud:

1. Create an OAuth client.
2. Add Supabase’s callback URL as an authorized redirect URI:

```text
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

3. Copy the Google client ID and client secret into:

- Supabase Dashboard
- Authentication
- Providers
- Google

In Supabase Auth settings, add redirect URLs for local and native development. Common values:

```text
luminafit://auth/callback
exp://127.0.0.1:8081/--/auth/callback
http://localhost:8081/--/auth/callback
```

Depending on your machine and Expo session, the exact `exp://...` URL can change. Supabase supports multiple redirect URLs, so add the local values you use most often.

## Theme System

The theme provider lives in [ThemeProvider.tsx](/c:/Users/USER/Gym/src/providers/ThemeProvider.tsx) and drives:

- Light mode: white surfaces, charcoal text, Leaf Green primary, warm cream/gold CTAs
- Dark mode: `#0F0F0F` foundation, white text, Leaf Green accents, soft gold highlights
- Animated theme transitions and status bar updates

## Demo Data

The app ships with local seed content in [mockData.ts](/c:/Users/USER/Gym/src/data/mockData.ts), including:

- Demo classes
- Coaching plans
- Progress datasets
- Leaderboard entries
- Community posts
- Demo user state

This lets the full product surface render before Supabase content is wired up.

## Important Notes

- The current Google sign-in flow uses Supabase OAuth and browser-based auth for Expo compatibility.
- Push reminders are scaffolded through Expo Notifications.
- Auth gracefully falls back to demo mode when Supabase keys are not configured.
- `web.output` is set to `single` because this app uses React Navigation rather than Expo Router.

## Useful Commands

```bash
npm run typecheck
npx expo start
npx expo start --web
npx expo export --platform web
```
