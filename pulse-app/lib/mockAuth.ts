import { User, upsertUserInLeaderboard, getLeaderboard } from './mockDB';

const CURRENT_USER_KEY = 'pulse_current_user';

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveCurrentUser(user: User) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  upsertUserInLeaderboard(user);
}

export function signUp(username: string, displayName: string): { user: User | null; error: string | null } {
  const existing = getLeaderboard().find(u => u.username === username);
  if (existing) return { user: null, error: 'Username already taken.' };

  const board = getLeaderboard();
  const lowestXP = board.length > 0 ? Math.min(...board.map(u => u.xp)) : 0;
  const startXP = Math.max(0, lowestXP - 200);

  const user: User = {
    id: `user-${Date.now()}`,
    username,
    displayName,
    xp: startXP,
    streak: 0,
    longestStreak: 0,
    lastCompleted: null,
    rank: 99,
  };

  saveCurrentUser(user);
  return { user, error: null };
}

export function login(username: string): { user: User | null; error: string | null } {
  const board = getLeaderboard();
  const found = board.find(u => u.username === username);
  if (!found) return { user: null, error: 'No account found. Sign up first.' };
  saveCurrentUser(found);
  return { user: found, error: null };
}

export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CURRENT_USER_KEY);
}
