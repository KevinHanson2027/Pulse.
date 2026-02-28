'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '@/components/Nav';
import { useAuth } from '@/hooks/useAuth';
import {
  getTrackProgress, addTrack, removeTrack, toggleTrackTask,
  getFriendRank, incrementStreak, updateXP, upsertUserInLeaderboard,
  TRACK_LEVEL_TASKS, LEVEL_NAMES, LEVEL_REQUIREMENTS,
  type TrackType, type TrackProgress,
} from '@/lib/mockDB';

const SORA = "'Sora', 'Inter', system-ui, sans-serif";
const INTER = "'Inter', system-ui, sans-serif";

const ALL_TRACKS: { type: TrackType; label: string }[] = [
  { type: 'cardio', label: 'Cardio' },
  { type: 'calisthenics', label: 'Calisthenics' },
  { type: 'lifting', label: 'Lifting' },
  { type: 'flexibility', label: 'Flexibility' },
  { type: 'custom', label: 'Custom' },
];

const TRACK_COLORS: Record<TrackType, string> = {
  cardio: '#FF4D4D',
  calisthenics: '#4DA6FF',
  lifting: '#F5A623',
  flexibility: '#A855F7',
  custom: '#00C896',
};

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, updateUser } = useAuth();
  const [tracks, setTracks] = useState<TrackProgress[]>([]);
  const [activeTrack, setActiveTrack] = useState<TrackType | null>(null);
  const [friendRank, setFriendRank] = useState<number>(99);
  const [xpFlash, setXpFlash] = useState(false);
  const [leveledUp, setLeveledUp] = useState(false);
  const [pickingTrack, setPickingTrack] = useState(false);
  const [customName, setCustomName] = useState('');

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const t = getTrackProgress(user.id);
      setTracks(t);
      if (t.length > 0 && !activeTrack) setActiveTrack(t[0].trackType);
      setFriendRank(getFriendRank(user.id));
    }
  }, [user]);

  const handleTaskToggle = useCallback((trackType: TrackType, taskIndex: number) => {
    if (!user) return;
    const { tracks: updated, xpGained, leveledUp: lu } = toggleTrackTask(user.id, trackType, taskIndex);
    setTracks(updated);
    if (xpGained > 0) {
      updateUser(u => {
        const withXP = updateXP(u.id, xpGained, u);
        const withStreak = incrementStreak(withXP);
        const final = { ...withStreak, xp: withXP.xp };
        upsertUserInLeaderboard(final);
        setFriendRank(getFriendRank(final.id));
        return final;
      });
      setXpFlash(true);
      setTimeout(() => setXpFlash(false), 1500);
    }
    if (lu) {
      setLeveledUp(true);
      setTimeout(() => setLeveledUp(false), 3000);
    }
  }, [user, updateUser]);

  function handleAddTrack(type: TrackType) {
    if (!user) return;
    if (type === 'custom' && !customName.trim()) return;
    const updated = addTrack(user.id, type, customName.trim() || undefined);
    setTracks(updated);
    setActiveTrack(type);
    setPickingTrack(false);
    setCustomName('');
  }

  function handleRemoveTrack(type: TrackType) {
    if (!user) return;
    const updated = removeTrack(user.id, type);
    setTracks(updated);
    if (activeTrack === type) setActiveTrack(updated[0]?.trackType ?? null);
  }

  if (loading || !user) return null;

  const current = tracks.find(t => t.trackType === activeTrack);
  const today = new Date().toDateString();
  const todayTasks = current
    ? (current.lastTaskDate === today ? current.tasksDoneToday : [])
    : [];
  const levelTasks = current ? (TRACK_LEVEL_TASKS[current.trackType][current.level] ?? []) : [];
  const required = current ? (LEVEL_REQUIREMENTS[current.level] ?? 0) : 0;
  const progressPct = current && required > 0 ? Math.min((current.completions / required) * 100, 100) : 0;
  const trackColor = current ? TRACK_COLORS[current.trackType] : '#FF4D4D';
  const allTasksDone = levelTasks.length > 0 && todayTasks.length >= levelTasks.length;
  const addableTracks = ALL_TRACKS.filter(t => !tracks.find(p => p.trackType === t.type));

  return (
    <div style={{ minHeight: '100vh', background: '#111111' }}>
      <Nav user={user} />
      <main style={{ maxWidth: 1040, margin: '0 auto', padding: '80px 24px 48px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#888', textTransform: 'uppercase', marginBottom: 6, fontFamily: INTER }}>
            {new Date().toDateString()}
          </p>
          <h1 style={{ fontFamily: SORA, fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: '#F5F5F5' }}>
            {user.displayName}
          </h1>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          <motion.div
            animate={xpFlash ? { scale: [1, 1.03, 1] } : {}}
            transition={{ duration: 0.25 }}
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '20px 24px' }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#888', textTransform: 'uppercase', marginBottom: 10, fontFamily: INTER }}>
              Streak
            </div>
            <div style={{ fontFamily: SORA, fontSize: 48, fontWeight: 800, color: '#FF4D4D', lineHeight: 1, letterSpacing: '-0.03em' }}>
              {user.streak}
            </div>
            <div style={{ fontSize: 12, color: '#aaa', marginTop: 8, fontFamily: INTER }}>days in a row</div>
          </motion.div>

          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '20px 24px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#888', textTransform: 'uppercase', marginBottom: 10, fontFamily: INTER }}>
              XP
            </div>
            <div style={{ fontFamily: SORA, fontSize: 48, fontWeight: 800, color: '#4DA6FF', lineHeight: 1, letterSpacing: '-0.03em' }}>
              {user.xp.toLocaleString()}
            </div>
            <AnimatePresence mode="wait">
              {xpFlash ? (
                <motion.div key="flash" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ fontSize: 12, color: '#FF4D4D', marginTop: 8, fontWeight: 700, fontFamily: INTER }}>
                  XP earned!
                </motion.div>
              ) : (
                <motion.div key="static" style={{ fontSize: 12, color: '#aaa', marginTop: 8, fontFamily: INTER }}>
                  best streak: {user.longestStreak} days
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '20px 24px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#888', textTransform: 'uppercase', marginBottom: 10, fontFamily: INTER }}>
              Friend Rank
            </div>
            <div style={{ fontFamily: SORA, fontSize: 48, fontWeight: 800, color: '#F5F5F5', lineHeight: 1, letterSpacing: '-0.03em' }}>
              #{friendRank}
            </div>
            <div style={{ fontSize: 12, color: '#aaa', marginTop: 8, fontFamily: INTER }}>among your friends</div>
          </div>
        </div>

        {/* Level-up toast */}
        <AnimatePresence>
          {leveledUp && (
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              style={{ background: '#1a2a1a', border: '1px solid #2a4a2a', padding: '14px 20px', marginBottom: 20, fontSize: 14, fontWeight: 700, color: '#00C896', fontFamily: INTER }}>
              Level up! You advanced to the next level.
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>

          {/* Tracks */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontFamily: SORA, fontSize: 15, fontWeight: 700, color: '#F5F5F5' }}>
                Today&#39;s Workout
              </h2>
              {addableTracks.length > 0 && (
                <button onClick={() => setPickingTrack(v => !v)} style={{
                  background: 'transparent', border: '1px solid #2a2a2a', color: '#aaa',
                  padding: '7px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', fontFamily: INTER,
                }}>
                  + Add Track
                </button>
              )}
            </div>

            <AnimatePresence>
              {pickingTrack && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 16 }}>
                  <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '16px 20px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, fontFamily: INTER }}>
                      Choose a track
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {addableTracks.filter(t => t.type !== 'custom').map(t => (
                        <button key={t.type} onClick={() => handleAddTrack(t.type)} style={{
                          background: 'transparent', border: `1px solid ${TRACK_COLORS[t.type]}`,
                          color: TRACK_COLORS[t.type], padding: '8px 16px', fontSize: 12, fontWeight: 700, fontFamily: INTER,
                        }}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                    {addableTracks.find(t => t.type === 'custom') && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        <input value={customName} onChange={e => setCustomName(e.target.value)}
                          placeholder="Custom track name..."
                          style={{ flex: 1, background: '#111', border: '1px solid #2a2a2a', color: '#F5F5F5', padding: '8px 12px', fontSize: 13 }}
                        />
                        <button onClick={() => handleAddTrack('custom')} style={{
                          background: TRACK_COLORS.custom, border: 'none', color: '#F5F5F5',
                          padding: '8px 16px', fontSize: 11, fontWeight: 700, fontFamily: INTER,
                        }}>
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {tracks.length === 0 && !pickingTrack && (
              <div style={{ padding: '48px', textAlign: 'center', border: '1px solid #1e1e1e', color: '#888', fontSize: 14, fontFamily: INTER }}>
                <div style={{ marginBottom: 8, color: '#aaa', fontFamily: SORA, fontWeight: 700 }}>No tracks yet</div>
                Pick a track to start leveling up — Cardio, Calisthenics, Lifting, Flexibility, or your own.
              </div>
            )}

            {tracks.length > 0 && (
              <>
                <div style={{ display: 'flex', gap: 2, marginBottom: 20, flexWrap: 'wrap' }}>
                  {tracks.map(t => {
                    const color = TRACK_COLORS[t.trackType];
                    const isActive = activeTrack === t.trackType;
                    return (
                      <button key={t.trackType} onClick={() => setActiveTrack(t.trackType)} style={{
                        background: isActive ? color : '#1a1a1a',
                        border: `1px solid ${isActive ? color : '#2a2a2a'}`,
                        color: isActive ? '#F5F5F5' : '#aaa',
                        padding: '8px 16px', fontSize: 12, fontWeight: 700,
                        letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: INTER,
                      }}>
                        {t.customName ?? ALL_TRACKS.find(a => a.type === t.trackType)?.label}
                      </button>
                    );
                  })}
                </div>

                {current && (
                  <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div>
                        <div style={{ fontFamily: SORA, fontSize: 20, fontWeight: 800, color: '#F5F5F5', letterSpacing: '-0.02em' }}>
                          Level {current.level + 1} — <span style={{ color: trackColor }}>{LEVEL_NAMES[current.level]}</span>
                        </div>
                        <div style={{ fontSize: 12, color: '#aaa', marginTop: 4, fontFamily: INTER }}>
                          {current.completions} / {required > 0 ? required : '—'} sessions to next level
                        </div>
                      </div>
                      <button onClick={() => handleRemoveTrack(current.trackType)} style={{
                        background: 'transparent', border: 'none', color: '#666', fontSize: 11, fontFamily: INTER, padding: 4,
                      }}>
                        Remove
                      </button>
                    </div>

                    {required > 0 && (
                      <div style={{ height: 4, background: '#222', marginBottom: 24 }}>
                        <motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }}
                          style={{ height: '100%', background: trackColor }} />
                      </div>
                    )}

                    <div style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12, fontFamily: INTER }}>
                      Today&#39;s tasks {allTasksDone && <span style={{ color: trackColor }}>· All done!</span>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {levelTasks.map((task, i) => {
                        const done = todayTasks.includes(i);
                        return (
                          <motion.div key={i} layout style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            padding: '14px 16px',
                            background: done ? '#161616' : '#111111',
                            border: `1px solid ${done ? '#282818' : '#222'}`,
                            cursor: 'pointer',
                          }} onClick={() => handleTaskToggle(current.trackType, i)}>
                            <div style={{
                              width: 20, height: 20,
                              border: `2px solid ${done ? trackColor : '#444'}`,
                              background: done ? trackColor : 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0, transition: 'all 0.15s',
                            }}>
                              {done && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                  <path d="M1 4L4 7L9 1" stroke="#F5F5F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 500, color: done ? '#555' : '#F5F5F5', textDecoration: done ? 'line-through' : 'none', fontFamily: INTER }}>
                              {task}
                            </span>
                            {!done && <span style={{ marginLeft: 'auto', fontSize: 11, color: '#666', fontFamily: INTER }}>+25 XP</span>}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '20px 24px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#888', textTransform: 'uppercase', marginBottom: 14, fontFamily: INTER }}>
                Today&#39;s Progress
              </div>
              {tracks.length > 0 ? tracks.map(t => {
                const color = TRACK_COLORS[t.trackType];
                const tToday = t.lastTaskDate === today ? t.tasksDoneToday : [];
                const total = TRACK_LEVEL_TASKS[t.trackType][t.level]?.length ?? 0;
                return (
                  <div key={t.trackType} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: '#aaa', fontFamily: INTER }}>
                        {t.customName ?? ALL_TRACKS.find(a => a.type === t.trackType)?.label}
                      </span>
                      <span style={{ fontSize: 12, color: '#aaa', fontFamily: INTER }}>{tToday.length}/{total}</span>
                    </div>
                    <div style={{ height: 3, background: '#222' }}>
                      <div style={{ height: '100%', background: color, width: total > 0 ? `${(tToday.length / total) * 100}%` : '0%', transition: 'width 0.4s' }} />
                    </div>
                  </div>
                );
              }) : (
                <div style={{ fontSize: 13, color: '#666', fontFamily: INTER }}>Add a track to begin.</div>
              )}
            </div>

            <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '20px 24px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#888', textTransform: 'uppercase', marginBottom: 14, fontFamily: INTER }}>
                Quick Links
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { href: '/health', label: 'Health Tracking' },
                  { href: '/social', label: 'Social Feed' },
                  { href: '/leaderboard', label: 'Leaderboard' },
                ].map(action => (
                  <a key={action.href} href={action.href} style={{
                    display: 'block', padding: '10px 14px', background: '#111111',
                    border: '1px solid #222', color: '#aaa', fontSize: 12,
                    fontWeight: 600, textDecoration: 'none', fontFamily: INTER,
                  }}>
                    {action.label} →
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
