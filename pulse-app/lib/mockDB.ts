export type User = {
  id: string;
  username: string;
  displayName: string;
  xp: number;
  streak: number;
  longestStreak: number;
  lastCompleted: string | null;
  rank: number;
  avatarColor?: string;
};

export type Habit = {
  id: string;
  userId: string;
  title: string;
  completedToday: boolean;
  streak: number;
  totalCompletions: number;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  category: 'challenge' | 'meetup' | 'gathering';
  date: string;
  location?: string;
  attendees: string[];
};

export type PREntry = {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  exercise: string;
  value: string;
  unit: string;
  sharedToFeed: boolean;
  timestamp: number;
};

export type Comment = {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  content: string;
  timestamp: number;
};

export type Post = {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  content: string;
  topic?: 'workout' | 'recipe' | 'motivation' | 'general';
  prRef?: PREntry;
  likes: number;
  likedBy: string[];
  comments?: Comment[];
  timestamp: number;
};

const SEED_USERS: Omit<User, 'rank'>[] = [
  { id: 'seed-1', username: 'apex_reed', displayName: 'Marcus Reed', xp: 9840, streak: 47, longestStreak: 62, lastCompleted: null },
  { id: 'seed-2', username: 'iron_voss', displayName: 'Elara Voss', xp: 8760, streak: 39, longestStreak: 55, lastCompleted: null },
  { id: 'seed-3', username: 'kai_storm', displayName: 'Kai Storm', xp: 7520, streak: 31, longestStreak: 44, lastCompleted: null },
  { id: 'seed-4', username: 'nora_prime', displayName: 'Nora Prime', xp: 6890, streak: 28, longestStreak: 38, lastCompleted: null },
  { id: 'seed-5', username: 'vale_drex', displayName: 'Vale Drex', xp: 5940, streak: 22, longestStreak: 30, lastCompleted: null },
  { id: 'seed-6', username: 'zane_output', displayName: 'Zane Output', xp: 4710, streak: 17, longestStreak: 25, lastCompleted: null },
  { id: 'seed-7', username: 'aria_chain', displayName: 'Aria Chain', xp: 3280, streak: 12, longestStreak: 18, lastCompleted: null },
  { id: 'seed-8', username: 'ryker_log', displayName: 'Ryker Log', xp: 2150, streak: 8, longestStreak: 12, lastCompleted: null },
];

const T = (minsAgo: number) => Date.now() - 1000 * 60 * minsAgo;

const SEED_POSTS: Post[] = [
  // ── WORKOUTS ──────────────────────────────────────────────────────────────
  {
    id: 'post-1',
    userId: 'seed-1', username: 'apex_reed', displayName: 'Marcus Reed',
    content: 'Day 47. Deadlift 240kg. New personal record. Feeling unstoppable.',
    topic: 'workout', likes: 34, likedBy: ['seed-2', 'seed-3'],
    comments: [
      { id: 'c-1-1', userId: 'seed-2', username: 'iron_voss', displayName: 'Elara Voss', content: '240kg is elite. What does your deadlift programming look like?', timestamp: T(20) },
      { id: 'c-1-2', userId: 'seed-3', username: 'kai_storm', displayName: 'Kai Storm', content: 'Insane. How long did it take you to get here?', timestamp: T(10) },
    ],
    timestamp: T(30),
  },
  {
    id: 'post-w2',
    userId: 'seed-2', username: 'iron_voss', displayName: 'Elara Voss',
    content: 'Back day: 5x5 pull-ups, 4x8 barbell rows, 3x12 face pulls. Felt strong throughout. Back gains are seriously underrated.',
    topic: 'workout', likes: 22, likedBy: ['seed-1', 'seed-4'],
    comments: [
      { id: 'c-w2-1', userId: 'seed-1', username: 'apex_reed', displayName: 'Marcus Reed', content: 'Face pulls are non-negotiable for shoulder health.', timestamp: T(55) },
      { id: 'c-w2-2', userId: 'seed-5', username: 'vale_drex', displayName: 'Vale Drex', content: 'What weight on the rows?', timestamp: T(40) },
    ],
    timestamp: T(80),
  },
  {
    id: 'post-w3',
    userId: 'seed-3', username: 'kai_storm', displayName: 'Kai Storm',
    content: 'Leg day PR: 275 lbs back squat for 3 sets of 5. Six months ago I could not hit 185. Put in the work and it shows.',
    topic: 'workout', likes: 41, likedBy: ['seed-1', 'seed-2', 'seed-4', 'seed-6'],
    comments: [
      { id: 'c-w3-1', userId: 'seed-1', username: 'apex_reed', displayName: 'Marcus Reed', content: 'Massive. 90lb improvement in 6 months is no joke.', timestamp: T(150) },
      { id: 'c-w3-2', userId: 'seed-5', username: 'vale_drex', displayName: 'Vale Drex', content: 'What program are you running?', timestamp: T(130) },
      { id: 'c-w3-3', userId: 'seed-6', username: 'zane_output', displayName: 'Zane Output', content: 'Inspired. Starting legs tomorrow.', timestamp: T(110) },
    ],
    timestamp: T(180),
  },
  {
    id: 'post-w4',
    userId: 'seed-4', username: 'nora_prime', displayName: 'Nora Prime',
    content: 'Upper/lower split, day 3 of 4 this week. Not every session feels great. Showing up anyway is the actual skill.',
    topic: 'workout', likes: 19, likedBy: ['seed-2', 'seed-7'],
    comments: [
      { id: 'c-w4-1', userId: 'seed-2', username: 'iron_voss', displayName: 'Elara Voss', content: 'Consistency beats intensity every time.', timestamp: T(220) },
    ],
    timestamp: T(260),
  },
  // ── RECIPES ───────────────────────────────────────────────────────────────
  {
    id: 'post-3',
    userId: 'seed-3', username: 'kai_storm', displayName: 'Kai Storm',
    content: 'High protein chicken bowl — 180g chicken, brown rice, roasted veg, Greek yogurt dressing. Easy and hits macros perfectly.',
    topic: 'recipe', likes: 21, likedBy: [],
    comments: [
      { id: 'c-3-1', userId: 'seed-4', username: 'nora_prime', displayName: 'Nora Prime', content: 'Greek yogurt dressing is a great swap. What do you season it with?', timestamp: T(165) },
    ],
    timestamp: T(180),
  },
  {
    id: 'post-r2',
    userId: 'seed-5', username: 'vale_drex', displayName: 'Vale Drex',
    content: 'Overnight oats: oats + almond milk + chia seeds + banana + peanut butter. Make the night before. High fiber, keeps you full all morning.',
    topic: 'recipe', likes: 14, likedBy: ['seed-2'],
    comments: [
      { id: 'c-r2-1', userId: 'seed-7', username: 'aria_chain', displayName: 'Aria Chain', content: 'Do you heat it up or eat it cold?', timestamp: T(460) },
      { id: 'c-r2-2', userId: 'seed-5', username: 'vale_drex', displayName: 'Vale Drex', content: 'Cold! That\'s the whole point — no morning cooking.', timestamp: T(450) },
    ],
    timestamp: T(480),
  },
  {
    id: 'post-r3',
    userId: 'seed-7', username: 'aria_chain', displayName: 'Aria Chain',
    content: 'Salmon + quinoa + roasted asparagus. Season the salmon with lemon, garlic, paprika. 400F for 12 min. 40g protein, omega-3, fiber. Best combo.',
    topic: 'recipe', likes: 18, likedBy: ['seed-1', 'seed-3'],
    comments: [
      { id: 'c-r3-1', userId: 'seed-1', username: 'apex_reed', displayName: 'Marcus Reed', content: 'Adding this to the rotation. Do you rinse the quinoa first?', timestamp: T(560) },
      { id: 'c-r3-2', userId: 'seed-7', username: 'aria_chain', displayName: 'Aria Chain', content: 'Yes always. Otherwise it tastes bitter.', timestamp: T(545) },
    ],
    timestamp: T(600),
  },
  {
    id: 'post-r4',
    userId: 'seed-8', username: 'ryker_log', displayName: 'Ryker Log',
    content: 'Low-cal pasta hack: shirataki noodles + marinara + ground turkey. Huge portion, barely any calories. Cut season approved.',
    topic: 'recipe', likes: 11, likedBy: ['seed-5'],
    comments: [
      { id: 'c-r4-1', userId: 'seed-5', username: 'vale_drex', displayName: 'Vale Drex', content: 'Shirataki noodles changed my life on a cut.', timestamp: T(700) },
      { id: 'c-r4-2', userId: 'seed-3', username: 'kai_storm', displayName: 'Kai Storm', content: 'Do they actually taste good or are you just coping?', timestamp: T(680) },
      { id: 'c-r4-3', userId: 'seed-8', username: 'ryker_log', displayName: 'Ryker Log', content: 'Halfway between coping and actually enjoying. Worth it.', timestamp: T(660) },
    ],
    timestamp: T(720),
  },
  // ── MOTIVATION ────────────────────────────────────────────────────────────
  {
    id: 'post-2',
    userId: 'seed-2', username: 'iron_voss', displayName: 'Elara Voss',
    content: '5:00 AM cold shower + 30 min yoga. Best way to start the day. Not easy but worth every minute.',
    topic: 'motivation', likes: 28, likedBy: ['seed-1'],
    comments: [
      { id: 'c-2-1', userId: 'seed-4', username: 'nora_prime', displayName: 'Nora Prime', content: 'How long did it take before 5AM felt normal?', timestamp: T(80) },
      { id: 'c-2-2', userId: 'seed-2', username: 'iron_voss', displayName: 'Elara Voss', content: 'About 3 weeks. Now I\'m awake before the alarm.', timestamp: T(70) },
    ],
    timestamp: T(90),
  },
  {
    id: 'post-4',
    userId: 'seed-4', username: 'nora_prime', displayName: 'Nora Prime',
    content: '28 day streak. The hard part is starting. The even harder part is not stopping.',
    topic: 'motivation', likes: 17, likedBy: [],
    comments: [
      { id: 'c-4-1', userId: 'seed-6', username: 'zane_output', displayName: 'Zane Output', content: 'Day 17 here. Hoping to hit 28 by end of month.', timestamp: T(290) },
      { id: 'c-4-2', userId: 'seed-4', username: 'nora_prime', displayName: 'Nora Prime', content: 'One day at a time. You\'ve got it.', timestamp: T(280) },
    ],
    timestamp: T(300),
  },
  {
    id: 'post-m3',
    userId: 'seed-3', username: 'kai_storm', displayName: 'Kai Storm',
    content: 'Stopped waiting to feel ready. Started anyway. That was 6 months ago. Best decision I\'ve made.',
    topic: 'motivation', likes: 33, likedBy: ['seed-1', 'seed-2', 'seed-4', 'seed-5'],
    comments: [
      { id: 'c-m3-1', userId: 'seed-5', username: 'vale_drex', displayName: 'Vale Drex', content: 'Readiness comes after starting, not before.', timestamp: T(400) },
      { id: 'c-m3-2', userId: 'seed-7', username: 'aria_chain', displayName: 'Aria Chain', content: 'This one hit.', timestamp: T(390) },
    ],
    timestamp: T(420),
  },
  {
    id: 'post-m4',
    userId: 'seed-1', username: 'apex_reed', displayName: 'Marcus Reed',
    content: 'Missed a workout last week. Did not spiral. Got back Monday. That\'s the only move — show up and keep going.',
    topic: 'motivation', likes: 25, likedBy: ['seed-2', 'seed-4', 'seed-7'],
    comments: [
      { id: 'c-m4-1', userId: 'seed-4', username: 'nora_prime', displayName: 'Nora Prime', content: 'No guilt. Just the next rep.', timestamp: T(820) },
      { id: 'c-m4-2', userId: 'seed-8', username: 'ryker_log', displayName: 'Ryker Log', content: 'Needed to see this today.', timestamp: T(800) },
    ],
    timestamp: T(840),
  },
];

const SEED_EVENTS: Event[] = [
  {
    id: 'event-1',
    title: '30-Day Output Sprint',
    description: 'Log a habit every single day for 30 days. No excuses. No gaps. Chain or nothing.',
    category: 'challenge',
    date: 'Mar 1 – Mar 31',
    attendees: ['seed-1', 'seed-2', 'seed-3', 'seed-4'],
  },
  {
    id: 'event-2',
    title: '7-Day Cold Exposure',
    description: 'Cold shower or ice bath every morning for 7 days. Proof of work required. Log on Physical.',
    category: 'challenge',
    date: 'Mar 3 – Mar 10',
    attendees: ['seed-2', 'seed-5'],
  },
  {
    id: 'event-3',
    title: 'NYC Community Meetup',
    description: 'In-person session. Train, connect, and compete with people in your city.',
    category: 'meetup',
    date: 'Mar 15, 2026',
    location: 'New York, NY',
    attendees: ['seed-1', 'seed-3', 'seed-6'],
  },
  {
    id: 'event-4',
    title: '5AM Club — Week 1',
    description: 'Wake before 5AM every day this week. Log your first output within 30 minutes of rising.',
    category: 'challenge',
    date: 'Mar 2 – Mar 8',
    attendees: ['seed-1', 'seed-2', 'seed-3', 'seed-7'],
  },
  {
    id: 'event-5',
    title: 'LA Strength Session',
    description: 'Open gym floor. Bring your personal records. Community lift and review.',
    category: 'gathering',
    date: 'Mar 22, 2026',
    location: 'Los Angeles, CA',
    attendees: ['seed-4', 'seed-5'],
  },
  {
    id: 'event-6',
    title: 'Weekly PR Push',
    description: 'Set a new personal record in any lift this week. Share to feed with proof. Community votes top PR.',
    category: 'challenge',
    date: 'Feb 28 – Mar 7',
    attendees: ['seed-1', 'seed-2', 'seed-3', 'seed-4', 'seed-5', 'seed-6'],
  },
];

const SEED_HABITS: Habit[] = [
  { id: 'habit-1', userId: '', title: 'Morning Training', completedToday: false, streak: 0, totalCompletions: 0 },
  { id: 'habit-2', userId: '', title: 'Cold Exposure', completedToday: false, streak: 0, totalCompletions: 0 },
  { id: 'habit-3', userId: '', title: 'Deep Work Block', completedToday: false, streak: 0, totalCompletions: 0 },
];

function getKey(k: string) { return `pulse_${k}`; }

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(getKey(key));
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function save<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getKey(key), JSON.stringify(value));
}

export function getLeaderboard(): User[] {
  const seeded = load<User[]>('leaderboard', []);
  if (seeded.length === 0) {
    const initial = SEED_USERS.map((u, i) => ({ ...u, rank: i + 1 }));
    save('leaderboard', initial);
    return initial;
  }
  return seeded;
}

export function upsertUserInLeaderboard(user: User) {
  const board = getLeaderboard().filter(u => u.id !== user.id);
  const updated = [...board, user].sort((a, b) => b.xp - a.xp).map((u, i) => ({ ...u, rank: i + 1 }));
  save('leaderboard', updated);
  return updated;
}

export function getUserRank(userId: string): number {
  const board = getLeaderboard();
  const entry = board.find(u => u.id === userId);
  return entry?.rank ?? 99;
}

export function getHabits(userId: string): Habit[] {
  const stored = load<Habit[]>(`habits_${userId}`, []);
  if (stored.length === 0) {
    const initial = SEED_HABITS.map(h => ({ ...h, id: `${h.id}-${userId}`, userId }));
    save(`habits_${userId}`, initial);
    return initial;
  }
  return stored;
}

export function addHabit(userId: string, title: string): Habit[] {
  const habits = getHabits(userId);
  const newHabit: Habit = {
    id: `habit-${Date.now()}`,
    userId,
    title,
    completedToday: false,
    streak: 0,
    totalCompletions: 0,
  };
  const updated = [...habits, newHabit];
  save(`habits_${userId}`, updated);
  return updated;
}

export function completeHabit(userId: string, habitId: string): { habits: Habit[]; xpGained: number } {
  const habits = getHabits(userId);
  const xpGained = 50;
  const updated = habits.map(h =>
    h.id === habitId
      ? { ...h, completedToday: true, streak: h.streak + 1, totalCompletions: h.totalCompletions + 1 }
      : h
  );
  save(`habits_${userId}`, updated);
  return { habits: updated, xpGained };
}

export function resetDailyHabits(userId: string): Habit[] {
  const habits = getHabits(userId);
  const reset = habits.map(h => ({ ...h, completedToday: false }));
  save(`habits_${userId}`, reset);
  return reset;
}

export function getPosts(): Post[] {
  return load<Post[]>('posts', SEED_POSTS);
}

export function addPost(post: Omit<Post, 'id' | 'likes' | 'likedBy' | 'timestamp'>): Post[] {
  const posts = getPosts();
  const newPost: Post = { ...post, id: `post-${Date.now()}`, likes: 0, likedBy: [], timestamp: Date.now() };
  const updated = [newPost, ...posts];
  save('posts', updated);
  return updated;
}

export function likePost(postId: string, userId: string): Post[] {
  const posts = getPosts();
  const updated = posts.map(p => {
    if (p.id !== postId) return p;
    if (p.likedBy.includes(userId)) return p;
    return { ...p, likes: p.likes + 1, likedBy: [...p.likedBy, userId] };
  });
  save('posts', updated);
  return updated;
}

export function getPRs(userId: string): PREntry[] {
  return load<PREntry[]>(`prs_${userId}`, []);
}

export function addPR(entry: Omit<PREntry, 'id' | 'timestamp'>): PREntry {
  const prs = getPRs(entry.userId);
  const newPR: PREntry = { ...entry, id: `pr-${Date.now()}`, timestamp: Date.now() };
  save(`prs_${entry.userId}`, [newPR, ...prs]);
  return newPR;
}

export function updateXP(userId: string, delta: number, currentUser: User): User {
  const updated = { ...currentUser, xp: currentUser.xp + delta };
  return updated;
}

export function incrementStreak(user: User): User {
  const today = new Date().toDateString();
  if (user.lastCompleted === today) return user;
  const newStreak = user.streak + 1;
  return {
    ...user,
    streak: newStreak,
    longestStreak: Math.max(user.longestStreak, newStreak),
    lastCompleted: today,
  };
}

export function getEvents(): Event[] {
  return load<Event[]>('events', SEED_EVENTS);
}

export function joinEvent(eventId: string, userId: string): Event[] {
  const events = getEvents();
  const updated = events.map(e => {
    if (e.id !== eventId) return e;
    if (e.attendees.includes(userId)) return e;
    return { ...e, attendees: [...e.attendees, userId] };
  });
  save('events', updated);
  return updated;
}

export function leaveEvent(eventId: string, userId: string): Event[] {
  const events = getEvents();
  const updated = events.map(e => {
    if (e.id !== eventId) return e;
    return { ...e, attendees: e.attendees.filter(id => id !== userId) };
  });
  save('events', updated);
  return updated;
}

export function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── TRACK SYSTEM ────────────────────────────────────────────────────────────

export type TrackType = 'cardio' | 'calisthenics' | 'lifting' | 'flexibility' | 'custom';

export const LEVEL_NAMES = ['Beginner', 'Moving', 'Consistent', 'Strong', 'Elite'];
export const LEVEL_REQUIREMENTS = [5, 10, 20, 30]; // completions to advance each level

export const TRACK_LEVEL_TASKS: Record<TrackType, string[][]> = {
  cardio: [
    ['Go for a 15-min walk', 'Light stretching for 5 min', 'Take the stairs today'],
    ['Run 1 mile', 'Jump rope for 5 min', 'Hit 8,000 steps'],
    ['Run a 5K', 'Complete a 20-min HIIT session', 'Cycle for 30 min'],
    ['Run 10K', '45-min Zone 2 training', 'Sprint intervals 5 rounds'],
    ['Run a half marathon', '60 min daily cardio', 'Sub-25 min 5K'],
  ],
  calisthenics: [
    ['10 push-ups', '10 bodyweight squats', 'Hold a 30-sec plank'],
    ['25 push-ups', '20 squats', 'Do your first pull-up'],
    ['50 push-ups in one set', '5 pull-ups', '50 squats unbroken'],
    ['100 push-ups in a session', '15 pull-ups', 'Pistol squat each leg'],
    ['200 push-ups in a session', '30 pull-ups', 'Muscle-up'],
  ],
  lifting: [
    ['Learn proper squat form', 'Deadlift with just the bar', 'Bench with just the bar'],
    ['Squat your bodyweight', 'Deadlift 1.5x bodyweight', 'Bench 0.75x bodyweight'],
    ['Squat 1.25x bodyweight', 'Deadlift 2x bodyweight', 'Bench 1x bodyweight'],
    ['Squat 1.75x bodyweight', 'Deadlift 2.5x bodyweight', 'Bench 1.5x bodyweight'],
    ['Squat 2.5x bodyweight', 'Deadlift 3x bodyweight', 'Bench 2x bodyweight'],
  ],
  flexibility: [
    ['Touch your toes', '5-min daily stretch', "Child's pose for 1 min"],
    ['Forward fold (flat back)', 'Hip flexor stretch both sides', '10 min daily stretching'],
    ['Attempt the splits', 'Bridge pose for 30 sec', 'Shoulder mobility circuit'],
    ['90% splits depth', 'Full shoulder range of motion', '30-min yoga flow'],
    ['Full splits', 'Handstand hold 10 sec', '45-min daily practice'],
  ],
  custom: [
    ['Complete your first task', 'Stay consistent for 3 days', 'Share your goal with someone'],
    ['7 days of consistency', 'Push past your comfort zone', 'Log your progress'],
    ['30 days in a row', 'Teach someone else', 'Set a new personal milestone'],
    ['60 days consistent', 'Compete or join an event', 'Hit your major goal'],
    ['90 days unbroken', 'Mentor someone else', 'Define your next peak'],
  ],
};

export type TrackProgress = {
  trackType: TrackType;
  customName?: string;
  level: number;
  completions: number;
  tasksDoneToday: number[];
  lastTaskDate: string | null;
};

export function getTrackProgress(userId: string): TrackProgress[] {
  return load<TrackProgress[]>(`tracks_${userId}`, []);
}

export function addTrack(userId: string, trackType: TrackType, customName?: string): TrackProgress[] {
  const tracks = getTrackProgress(userId);
  if (tracks.find(t => t.trackType === trackType)) return tracks;
  const newTrack: TrackProgress = {
    trackType,
    customName: trackType === 'custom' ? (customName || 'My Track') : undefined,
    level: 0,
    completions: 0,
    tasksDoneToday: [],
    lastTaskDate: null,
  };
  const updated = [...tracks, newTrack];
  save(`tracks_${userId}`, updated);
  return updated;
}

export function removeTrack(userId: string, trackType: TrackType): TrackProgress[] {
  const updated = getTrackProgress(userId).filter(t => t.trackType !== trackType);
  save(`tracks_${userId}`, updated);
  return updated;
}

export function toggleTrackTask(
  userId: string,
  trackType: TrackType,
  taskIndex: number
): { tracks: TrackProgress[]; xpGained: number; leveledUp: boolean } {
  const today = new Date().toDateString();
  let xpGained = 0;
  let leveledUp = false;

  const updated = getTrackProgress(userId).map(t => {
    if (t.trackType !== trackType) return t;
    const tasksDoneToday = t.lastTaskDate === today ? [...t.tasksDoneToday] : [];
    const alreadyDone = tasksDoneToday.includes(taskIndex);
    const newTasksDone = alreadyDone
      ? tasksDoneToday.filter(i => i !== taskIndex)
      : [...tasksDoneToday, taskIndex];

    if (!alreadyDone) xpGained = 25;

    const levelTasks = TRACK_LEVEL_TASKS[trackType][t.level] ?? [];
    const wasAllDone = tasksDoneToday.length >= levelTasks.length;
    const isAllDone = newTasksDone.length >= levelTasks.length;

    let newCompletions = t.completions;
    if (!wasAllDone && isAllDone) {
      newCompletions = t.completions + 1;
      xpGained = 100;
    }

    const required = LEVEL_REQUIREMENTS[t.level] ?? Infinity;
    const doLevelUp = isAllDone && newCompletions >= required && t.level < 4;
    if (doLevelUp) leveledUp = true;

    return {
      ...t,
      tasksDoneToday: newTasksDone,
      lastTaskDate: today,
      completions: doLevelUp ? 0 : newCompletions,
      level: doLevelUp ? t.level + 1 : t.level,
    };
  });

  save(`tracks_${userId}`, updated);
  return { tracks: updated, xpGained, leveledUp };
}

// ─── HEALTH TRACKERS ─────────────────────────────────────────────────────────

export type PhysicalTracker = {
  id: string;
  label: string;
  current: number;
  goal: number;
  unit: string;
};

const DEFAULT_TRACKERS: PhysicalTracker[] = [
  { id: 'calories', label: 'Calories', current: 0, goal: 2000, unit: 'kcal' },
  { id: 'hydration', label: 'Hydration', current: 0, goal: 8, unit: 'glasses' },
  { id: 'steps', label: 'Steps', current: 0, goal: 10000, unit: 'steps' },
];

export function getPhysicalTrackers(userId: string): PhysicalTracker[] {
  const customDefs = load<PhysicalTracker[]>(`trackers_def_${userId}`, DEFAULT_TRACKERS);
  const dailyVals = load<Record<string, number>>(`trackers_val_${userId}_${new Date().toDateString()}`, {});
  return customDefs.map(t => ({ ...t, current: dailyVals[t.id] ?? 0 }));
}

export function updateTrackerValue(userId: string, id: string, current: number): PhysicalTracker[] {
  const key = `trackers_val_${userId}_${new Date().toDateString()}`;
  const vals = load<Record<string, number>>(key, {});
  vals[id] = current;
  save(key, vals);
  return getPhysicalTrackers(userId);
}

export function addCustomTracker(userId: string, label: string, goal: number, unit: string): PhysicalTracker[] {
  const defs = load<PhysicalTracker[]>(`trackers_def_${userId}`, DEFAULT_TRACKERS);
  const newT: PhysicalTracker = { id: `tracker-${Date.now()}`, label, current: 0, goal, unit };
  save(`trackers_def_${userId}`, [...defs, newT]);
  return getPhysicalTrackers(userId);
}

// ─── MOOD ────────────────────────────────────────────────────────────────────

export type MoodType = 'great' | 'good' | 'okay' | 'tough' | 'rough';

export function getMood(userId: string): MoodType | null {
  return load<MoodType | null>(`mood_${userId}_${new Date().toDateString()}`, null);
}

export function setMood(userId: string, mood: MoodType): void {
  save(`mood_${userId}_${new Date().toDateString()}`, mood);
}

// ─── DAILY CONTENT ───────────────────────────────────────────────────────────

const AFFIRMATIONS = [
  "You are stronger than you think. Show up today.",
  "Small steps every day build unshakeable foundations.",
  "Discipline is the bridge between goals and results.",
  "You don't need motivation. You need commitment.",
  "The version of you that shows up today is all that matters.",
  "Rest is earned. Keep earning it.",
  "One decision at a time. You are in control.",
  "Progress is progress, no matter the size.",
  "You have everything you need. Begin.",
  "Consistency beats intensity every time.",
  "Your only competition is yesterday's version of yourself.",
  "The hard days are the most important ones to show up.",
  "Comfort is temporary. Growth is permanent.",
  "Show your body respect. Feed it. Move it. Rest it.",
  "What you do today becomes who you are tomorrow.",
];

const WELLNESS_EXERCISES = [
  { name: 'Morning Sun Salutation', description: '5 rounds of Sun Salutation A. Breathe through each movement. Lengthen on the inhale, fold on the exhale.', duration: '10 min' },
  { name: 'Hip Opener Flow', description: "Low lunge → Pigeon pose → Lizard pose. 90 seconds per side. Let tension release naturally.", duration: '12 min' },
  { name: 'Spinal Reset', description: "Cat-cow → Thread the needle → Supine twist. Move slowly and breathe into tight spots.", duration: '8 min' },
  { name: 'Standing Balance Series', description: "Tree pose → Warrior III → Half moon. 60 seconds each side. Find a focal point and stay present.", duration: '10 min' },
  { name: 'Box Breathing Reset', description: 'Inhale 4 counts. Hold 4 counts. Exhale 4 counts. Hold 4 counts. Repeat 8 rounds.', duration: '5 min' },
  { name: 'Body Scan Meditation', description: "Lie flat. Scan from feet upward, consciously relaxing each body part. No agenda, just awareness.", duration: '15 min' },
  { name: 'Shoulder & Neck Release', description: "Ear to shoulder → Neck rolls → Cross-body arm stretch. 8 reps or 30-sec holds each.", duration: '7 min' },
];

export function getDailyAffirmation(): string {
  return AFFIRMATIONS[Math.floor(Date.now() / 86400000) % AFFIRMATIONS.length];
}

export function getDailyWellnessExercise(): { name: string; description: string; duration: string } {
  return WELLNESS_EXERCISES[Math.floor(Date.now() / 86400000) % WELLNESS_EXERCISES.length];
}

// ─── FRIENDS LEADERBOARD ─────────────────────────────────────────────────────

const FRIEND_SEED_IDS = ['seed-1', 'seed-2', 'seed-3', 'seed-4', 'seed-5'];

export function getFriendsLeaderboard(userId: string): User[] {
  const board = getLeaderboard();
  const friends = board.filter(u => FRIEND_SEED_IDS.includes(u.id) || u.id === userId);
  return [...friends].sort((a, b) => b.streak - a.streak).map((u, i) => ({ ...u, rank: i + 1 }));
}

export function getFriendRank(userId: string): number {
  return getFriendsLeaderboard(userId).find(u => u.id === userId)?.rank ?? 99;
}

// ─── PROFILE ─────────────────────────────────────────────────────────────────

export function updateProfile(userId: string, updates: { displayName?: string; avatarColor?: string }): User | null {
  const board = getLeaderboard();
  const user = board.find(u => u.id === userId);
  if (!user) return null;
  const updated = { ...user, ...updates };
  save('leaderboard', board.map(u => u.id === userId ? updated : u));
  return updated;
}

export function getAvatarUrl(userId: string): string | null {
  return load<string | null>(`avatar_${userId}`, null);
}

export function saveAvatarUrl(userId: string, url: string): void {
  save(`avatar_${userId}`, url);
}

// ─── COMMENTS ────────────────────────────────────────────────────────────────

export function addComment(postId: string, comment: Omit<Comment, 'id' | 'timestamp'>): Post[] {
  const posts = getPosts();
  const newComment: Comment = { ...comment, id: `c-${Date.now()}`, timestamp: Date.now() };
  const updated = posts.map(p =>
    p.id !== postId ? p : { ...p, comments: [...(p.comments ?? []), newComment] }
  );
  save('posts', updated);
  return updated;
}

// ─── EVENTS (user-created) ────────────────────────────────────────────────────

export function createEvent(event: Omit<Event, 'id' | 'attendees'>, userId: string): Event[] {
  const events = getEvents();
  const newEvent: Event = { ...event, id: `event-${Date.now()}`, attendees: [userId] };
  const updated = [newEvent, ...events];
  save('events', updated);
  return updated;
}

// ─── POST INITIALIZATION (ensures seed posts are always present) ──────────────

export function initializePosts(): Post[] {
  const stored = load<Post[]>('posts', []);
  const storedIds = new Set(stored.map(p => p.id));
  const missing = SEED_POSTS.filter(p => !storedIds.has(p.id));
  if (missing.length === 0) return stored;
  const merged = [...stored, ...missing];
  save('posts', merged);
  return merged;
}
