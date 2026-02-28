export type User = {
  id: string;
  username: string;
  displayName: string;
  xp: number;
  streak: number;
  longestStreak: number;
  lastCompleted: string | null;
  rank: number;
};

export type Habit = {
  id: string;
  userId: string;
  title: string;
  completedToday: boolean;
  streak: number;
  totalCompletions: number;
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

export type Post = {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  content: string;
  prRef?: PREntry;
  likes: number;
  likedBy: string[];
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

const SEED_POSTS: Post[] = [
  {
    id: 'post-1',
    userId: 'seed-1',
    username: 'apex_reed',
    displayName: 'Marcus Reed',
    content: 'Day 47. Deadlift 240kg. Chain holds.',
    likes: 34,
    likedBy: ['seed-2', 'seed-3'],
    timestamp: Date.now() - 1000 * 60 * 30,
  },
  {
    id: 'post-2',
    userId: 'seed-2',
    username: 'iron_voss',
    displayName: 'Elara Voss',
    content: '5:00 AM. Cold session. Output logged. No excuses.',
    likes: 28,
    likedBy: ['seed-1'],
    timestamp: Date.now() - 1000 * 60 * 90,
  },
  {
    id: 'post-3',
    userId: 'seed-3',
    username: 'kai_storm',
    displayName: 'Kai Storm',
    content: 'New PR. Bench 142.5kg. Limit break confirmed.',
    likes: 21,
    likedBy: [],
    timestamp: Date.now() - 1000 * 60 * 180,
  },
  {
    id: 'post-4',
    userId: 'seed-4',
    username: 'nora_prime',
    displayName: 'Nora Prime',
    content: 'Streak: 28. The chain does not break. Execute daily.',
    likes: 17,
    likedBy: [],
    timestamp: Date.now() - 1000 * 60 * 300,
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

export function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
