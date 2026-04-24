insert into public.classes (
  slug,
  title,
  subtitle,
  description,
  category,
  duration_minutes,
  intensity,
  level,
  calories,
  participants,
  is_live,
  start_time_label,
  instructor_name,
  instructor_avatar,
  cover_image,
  video_url
)
values
  (
    'midnight-tempo-ride',
    'Midnight Tempo Ride',
    'A cinematic live cycling experience',
    'A 35-minute studio ride with climbing surges and neon city visuals.',
    'cycling',
    35,
    'ignite',
    'Intermediate',
    428,
    842,
    true,
    'Live in 18 min',
    'Nia Park',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
  ),
  (
    'sculpted-strength-upper-body',
    'Sculpted Strength: Upper Body',
    'Luxury strength with deliberate pacing',
    'Slow-tempo dumbbell work that builds definition through precise coaching.',
    'strength',
    42,
    'steady',
    'Advanced',
    510,
    1265,
    false,
    null,
    'Maya Sterling',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  );

insert into public.workout_plans (
  title,
  coach_name,
  summary,
  duration_weeks,
  completion,
  next_session,
  accent
)
values
  (
    'Lumina Signature Recomposition',
    'Maya Sterling',
    '4 focused lifts, 2 mobility rituals, and a weekly recovery score.',
    8,
    62,
    'Tonight · 7:00 PM',
    '#10B981'
  ),
  (
    'Studio Lean Conditioning',
    'Nia Park',
    'Cardio blocks with sculpt work and premium interval pacing.',
    6,
    34,
    'Tomorrow · 6:30 AM',
    '#D4B16A'
  );

insert into public.challenges (title, summary, starts_at, ends_at)
values (
  'Spring Ascend',
  'Stack points from live rides, strength blocks, and weekly recovery rituals.',
  now(),
  now() + interval '30 days'
);
