'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '@/components/Nav';
import { useAuth } from '@/hooks/useAuth';
import {
  getHabits, completeHabit, addHabit, incrementStreak, updateXP,
  getUserRank, upsertUserInLeaderboard, type Habit,
} from '@/lib/mockDB';

const SORA = "'Sora', 'Inter', system-ui, sans-serif";
const INTER = "'Inter', system-ui, sans-serif";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, updateUser } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [rank, setRank] = useState<number>(99);
  const [xpFlash, setXpFlash] = useState(false);
  const [streakFlash, setStreakFlash] = useState(false);
  const [newHabit, setNewHabit] = useState('');
  const [addingHabit, setAddingHabit] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setHabits(getHabits(user.id));
      setRank(getUserRank(user.id));
    }
  }, [user]);

  const handleComplete = useCallback((habitId: string) => {
    if (!user) return;
    const { habits: updated, xpGained } = completeHabit(user.id, habitId);
    setHabits(updated);
    updateUser(u => {
      const withXP = updateXP(u.id, xpGained, u);
      const withStreak = incrementStreak(withXP);
      const final = { ...withStreak, xp: withXP.xp };
      upsertUserInLeaderboard(final);
      setRank(getUserRank(final.id));
      return final;
    });
    setXpFlash(true);
    setStreakFlash(true);
    setTimeout(() => setXpFlash(false), 1200);
    setTimeout(() => setStreakFlash(false), 1200);
  }, [user, updateUser]);

  function handleAddHabit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !newHabit.trim()) return;
    setHabits(addHabit(user.id, newHabit.trim()));
    setNewHabit('');
    setAddingHabit(false);
  }

  if (loading || !user) return null;

  const completedCount = habits.filter(h => h.completedToday).length;
  const allDone = completedCount === habits.length && habits.length > 0;

  return (
    <div style={{ minHeight: '100vh', background: '#111111' }}>
      <Nav user={user} />
      <main style={{ maxWidth: 1040, margin: '0 auto', padding: '80px 24px 48px' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.15em',
            color: '#444',
            textTransform: 'uppercase',
            marginBottom: 6,
            fontFamily: INTER,
          }}>
            {allDone ? 'Output: Peak.' : new Date().toDateString()}
          </p>
          <h1 style={{
            fontFamily: SORA,
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#F5F5F5',
          }}>
            {user.displayName}
          </h1>
        </div>

        {/* Metrics row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>

          {/* Streak — primary metric, RED */}
          <motion.div
            animate={streakFlash ? { scale: [1, 1.03, 1] } : {}}
            transition={{ duration: 0.25 }}
            style={{
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              padding: '24px 28px',
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#444', textTransform: 'uppercase', marginBottom: 12, fontFamily: INTER }}>
              Momentum Chain
            </div>
            <div style={{ fontFamily: SORA, fontSize: 56, fontWeight: 800, color: '#FF4D4D', lineHeight: 1, letterSpacing: '-0.03em' }}>
              {user.streak}
            </div>
            <div style={{ fontSize: 12, color: '#444', marginTop: 10, fontFamily: INTER }}>
              Hold the line. Day {user.streak}.
            </div>
          </motion.div>

          {/* XP — secondary metric, Blue */}
          <motion.div
            animate={xpFlash ? { scale: [1, 1.03, 1] } : {}}
            transition={{ duration: 0.25 }}
            style={{
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              padding: '24px 28px',
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#444', textTransform: 'uppercase', marginBottom: 12, fontFamily: INTER }}>
              Output Units
            </div>
            <div style={{ fontFamily: SORA, fontSize: 56, fontWeight: 800, color: '#4DA6FF', lineHeight: 1, letterSpacing: '-0.03em' }}>
              {user.xp.toLocaleString()}
            </div>
            <AnimatePresence mode="wait">
              {xpFlash ? (
                <motion.div
                  key="flash"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ fontSize: 12, color: '#FF4D4D', marginTop: 10, fontWeight: 700, fontFamily: INTER }}
                >
                  +50 OU earned
                </motion.div>
              ) : (
                <motion.div key="static" style={{ fontSize: 12, color: '#444', marginTop: 10, fontFamily: INTER }}>
                  Best chain: {user.longestStreak} days
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Rank — neutral */}
          <div style={{
            background: '#1a1a1a',
            border: '1px solid #2a2a2a',
            padding: '24px 28px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#444', textTransform: 'uppercase', marginBottom: 12, fontFamily: INTER }}>
              Global Rank
            </div>
            <div style={{ fontFamily: SORA, fontSize: 56, fontWeight: 800, color: '#F5F5F5', lineHeight: 1, letterSpacing: '-0.03em' }}>
              #{rank}
            </div>
            <div style={{ fontSize: 12, color: '#444', marginTop: 10, fontFamily: INTER }}>
              Climb or fall.
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>

          {/* Habits */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontFamily: SORA, fontSize: 15, fontWeight: 700, color: '#F5F5F5', letterSpacing: '-0.01em' }}>
                  Today&#39;s Execution
                </h2>
                <p style={{ fontSize: 12, color: '#444', marginTop: 2, fontFamily: INTER }}>
                  {completedCount}/{habits.length} complete
                </p>
              </div>
              <button
                onClick={() => setAddingHabit(v => !v)}
                style={{
                  background: 'transparent',
                  border: '1px solid #2a2a2a',
                  color: '#555',
                  padding: '7px 16px',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontFamily: INTER,
                }}
              >
                + Add
              </button>
            </div>

            <AnimatePresence>
              {addingHabit && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddHabit}
                  style={{ marginBottom: 12, display: 'flex', gap: 8, overflow: 'hidden' }}
                >
                  <input
                    value={newHabit}
                    onChange={e => setNewHabit(e.target.value)}
                    placeholder="Add habit..."
                    autoFocus
                    style={{ flex: 1, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#F5F5F5', padding: '10px 14px', fontSize: 13 }}
                  />
                  <button type="submit" style={{
                    background: '#FF4D4D',
                    color: '#F5F5F5',
                    border: 'none',
                    padding: '10px 20px',
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: INTER,
                    flexShrink: 0,
                  }}>
                    Add
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {habits.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', border: '1px solid #1e1e1e', color: '#333', fontSize: 13, fontFamily: INTER }}>
                  Zero data. Start moving.
                </div>
              )}
              {habits.map(habit => (
                <motion.div
                  key={habit.id}
                  layout
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    background: habit.completedToday ? '#161616' : '#1a1a1a',
                    border: `1px solid ${habit.completedToday ? '#2a1a1a' : '#2a2a2a'}`,
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 20,
                      height: 20,
                      border: `2px solid ${habit.completedToday ? '#FF4D4D' : '#333'}`,
                      background: habit.completedToday ? '#FF4D4D' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.15s',
                    }}>
                      {habit.completedToday && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L4 7L9 1" stroke="#F5F5F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <div style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: habit.completedToday ? '#444' : '#F5F5F5',
                        textDecoration: habit.completedToday ? 'line-through' : 'none',
                        fontFamily: INTER,
                      }}>
                        {habit.title}
                      </div>
                      <div style={{ fontSize: 11, color: '#333', marginTop: 2, fontFamily: INTER }}>
                        Chain: {habit.streak} days
                      </div>
                    </div>
                  </div>
                  {!habit.completedToday && (
                    <button
                      onClick={() => handleComplete(habit.id)}
                      style={{
                        background: '#FF4D4D',
                        border: 'none',
                        color: '#F5F5F5',
                        padding: '8px 18px',
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        fontFamily: INTER,
                      }}
                    >
                      Execute
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Progress */}
            <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '20px 24px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#444', textTransform: 'uppercase', marginBottom: 16, fontFamily: INTER }}>
                Progress
              </div>
              <div style={{ height: 3, background: '#222', marginBottom: 12 }}>
                <motion.div
                  animate={{ width: habits.length > 0 ? `${(completedCount / habits.length) * 100}%` : '0%' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  style={{ height: '100%', background: '#FF4D4D' }}
                />
              </div>
              <div style={{ fontFamily: SORA, fontSize: 28, fontWeight: 800, color: '#F5F5F5', letterSpacing: '-0.02em' }}>
                {habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0}%
              </div>
              <div style={{ fontSize: 12, color: '#444', marginTop: 4, fontFamily: INTER }}>
                {allDone ? 'Output: Peak.' : 'Keep executing.'}
              </div>
            </div>

            {/* Quick actions */}
            <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '20px 24px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#444', textTransform: 'uppercase', marginBottom: 14, fontFamily: INTER }}>
                Quick Actions
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { href: '/physical', label: 'Log PR' },
                  { href: '/feed', label: 'View Feed' },
                  { href: '/leaderboard', label: 'Check Rank' },
                ].map(action => (
                  <a key={action.href} href={action.href} style={{
                    display: 'block',
                    padding: '10px 14px',
                    background: '#111111',
                    border: '1px solid #222',
                    color: '#888',
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: 'none',
                    letterSpacing: '0.04em',
                    fontFamily: INTER,
                    transition: 'color 0.15s, border-color 0.15s',
                  }}>
                    {action.label} &rarr;
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
