'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '@/components/Nav';
import { useAuth } from '@/hooks/useAuth';
import { addPR, addPost, getPRs, type PREntry } from '@/lib/mockDB';

const SORA = "'Sora', 'Inter', system-ui, sans-serif";
const INTER = "'Inter', system-ui, sans-serif";

const EXERCISES = ['Deadlift', 'Squat', 'Bench Press', 'Overhead Press', 'Pull-Up', 'Row', 'Sprint', 'Run', 'Other'];
const UNITS = ['kg', 'lbs', 'reps', 'km', 'min', 'sec'];

export default function Physical() {
  const router = useRouter();
  const { user, loading, updateUser } = useAuth();
  const [prs, setPRs] = useState<PREntry[]>([]);
  const [exercise, setExercise] = useState('Deadlift');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('kg');
  const [shareToFeed, setShareToFeed] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [lastPR, setLastPR] = useState<PREntry | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) setPRs(getPRs(user.id));
  }, [user]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !value.trim()) return;

    const entry = addPR({
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      exercise,
      value: value.trim(),
      unit,
      sharedToFeed: shareToFeed,
    });

    if (shareToFeed) {
      addPost({
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
        content: `Limit Break — ${exercise} ${value}${unit}. Verified.`,
        prRef: entry,
      });
    }

    updateUser(u => ({ ...u, xp: u.xp + 100 }));
    setPRs(getPRs(user.id));
    setLastPR(entry);
    setValue('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  if (loading || !user) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#111111' }}>
      <Nav user={user} />
      <main style={{ maxWidth: 1040, margin: '0 auto', padding: '80px 24px 48px' }}>

        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#444', textTransform: 'uppercase', marginBottom: 6, fontFamily: INTER }}>
            Performance Log
          </p>
          <h1 style={{ fontFamily: SORA, fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: '#F5F5F5' }}>
            Log Limit Break
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 24 }}>

          {/* Form */}
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '28px' }}>
            <h2 style={{ fontFamily: SORA, fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#F5F5F5', marginBottom: 24 }}>
              New PR Entry
            </h2>

            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    padding: '12px 16px',
                    background: '#1e1212',
                    border: '1px solid #3a1a1a',
                    color: '#FF4D4D',
                    fontSize: 13,
                    fontWeight: 700,
                    marginBottom: 20,
                    fontFamily: INTER,
                  }}
                >
                  Limit Break logged. +100 OU.
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#444', textTransform: 'uppercase', marginBottom: 8, fontFamily: INTER }}>
                  Exercise
                </label>
                <select value={exercise} onChange={e => setExercise(e.target.value)}>
                  {EXERCISES.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#444', textTransform: 'uppercase', marginBottom: 8, fontFamily: INTER }}>
                    Value
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder="142.5"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#444', textTransform: 'uppercase', marginBottom: 8, fontFamily: INTER }}>
                    Unit
                  </label>
                  <select value={unit} onChange={e => setUnit(e.target.value)}>
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setShareToFeed(v => !v)}
                  style={{
                    width: 20,
                    height: 20,
                    border: `2px solid ${shareToFeed ? '#FF4D4D' : '#333'}`,
                    background: shareToFeed ? '#FF4D4D' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.15s',
                  }}
                >
                  {shareToFeed && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L4 7L9 1" stroke="#F5F5F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
                <span style={{ fontSize: 13, color: '#666', fontFamily: INTER }}>Share to Feed</span>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: 8,
                  background: '#FF4D4D',
                  color: '#F5F5F5',
                  border: 'none',
                  padding: '14px',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  width: '100%',
                  fontFamily: INTER,
                }}
              >
                Lock PR
              </button>
            </form>
          </div>

          {/* PR History */}
          <div>
            <h2 style={{ fontFamily: SORA, fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#F5F5F5', marginBottom: 16 }}>
              PR History
            </h2>

            {prs.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', border: '1px solid #1e1e1e', color: '#333', fontSize: 13, fontFamily: INTER }}>
                Zero data. Start moving.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {prs.map((pr, i) => (
                  <motion.div
                    key={pr.id}
                    initial={i === 0 && lastPR?.id === pr.id ? { opacity: 0, y: -8 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: SORA, fontSize: 14, fontWeight: 700, color: '#F5F5F5' }}>{pr.exercise}</div>
                      <div style={{ fontSize: 11, color: '#444', marginTop: 2, fontFamily: INTER }}>
                        {new Date(pr.timestamp).toLocaleDateString()}
                        {pr.sharedToFeed && <span style={{ marginLeft: 8, color: '#333', letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 10 }}>· Shared</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: SORA, fontSize: 24, fontWeight: 800, color: '#FF4D4D', letterSpacing: '-0.02em' }}>
                        {pr.value}
                        <span style={{ fontSize: 13, fontWeight: 600, marginLeft: 3, color: '#555', fontFamily: INTER }}>{pr.unit}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
