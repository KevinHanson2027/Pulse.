'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Nav from '@/components/Nav';
import { useAuth } from '@/hooks/useAuth';
import {
  getPhysicalTrackers, updateTrackerValue, addCustomTracker,
  getMood, setMood, getDailyAffirmation, getDailyWellnessExercise,
  type PhysicalTracker, type MoodType,
} from '@/lib/mockDB';

const SORA = "'Sora', 'Inter', system-ui, sans-serif";
const INTER = "'Inter', system-ui, sans-serif";

const MOODS: { type: MoodType; label: string; color: string }[] = [
  { type: 'great', label: 'Great', color: '#00C896' },
  { type: 'good', label: 'Good', color: '#4DA6FF' },
  { type: 'okay', label: 'Okay', color: '#F5A623' },
  { type: 'tough', label: 'Tough', color: '#FF8C42' },
  { type: 'rough', label: 'Rough', color: '#FF4D4D' },
];

const TRACKER_COLORS = ['#FF4D4D', '#4DA6FF', '#00C896', '#F5A623', '#A855F7'];

export default function Health() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<'physical' | 'mental'>('physical');
  const [trackers, setTrackers] = useState<PhysicalTracker[]>([]);
  const [mood, setMoodState] = useState<MoodType | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [addingTracker, setAddingTracker] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const affirmation = getDailyAffirmation();
  const exercise = getDailyWellnessExercise();

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setTrackers(getPhysicalTrackers(user.id));
      setMoodState(getMood(user.id));
    }
  }, [user]);

  function handleUpdateValue(id: string) {
    if (!user) return;
    const val = parseFloat(editValue);
    if (isNaN(val)) return;
    setTrackers(updateTrackerValue(user.id, id, val));
    setEditingId(null);
    setEditValue('');
  }

  function handleAddTracker(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !newLabel.trim() || !newGoal || !newUnit.trim()) return;
    setTrackers(addCustomTracker(user.id, newLabel.trim(), parseFloat(newGoal), newUnit.trim()));
    setNewLabel(''); setNewGoal(''); setNewUnit('');
    setAddingTracker(false);
  }

  function handleMood(m: MoodType) {
    if (!user) return;
    setMood(user.id, m);
    setMoodState(m);
  }

  if (loading || !user) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#111111' }}>
      <Nav user={user} />
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '80px 24px 48px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#888', textTransform: 'uppercase', marginBottom: 6, fontFamily: INTER }}>
            Health
          </p>
          <h1 style={{ fontFamily: SORA, fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: '#F5F5F5' }}>
            Take care of yourself.
          </h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 32, borderBottom: '1px solid #1e1e1e' }}>
          {(['physical', 'mental'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '10px 24px',
              background: 'transparent',
              border: 'none',
              borderBottom: tab === t ? '2px solid #FF4D4D' : '2px solid transparent',
              color: tab === t ? '#F5F5F5' : '#888',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: -1,
              fontFamily: INTER,
            }}>
              {t === 'physical' ? 'Physical' : 'Mental'}
            </button>
          ))}
        </div>

        {/* ── PHYSICAL TAB ── */}
        {tab === 'physical' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {trackers.map((tracker, idx) => {
                const pct = Math.min((tracker.current / tracker.goal) * 100, 100);
                const color = TRACKER_COLORS[idx % TRACKER_COLORS.length];
                const isEditing = editingId === tracker.id;
                return (
                  <div key={tracker.id} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontFamily: SORA, fontSize: 15, fontWeight: 700, color: '#F5F5F5' }}>{tracker.label}</div>
                        <div style={{ fontSize: 12, color: '#aaa', marginTop: 2, fontFamily: INTER }}>
                          {tracker.current.toLocaleString()} / {tracker.goal.toLocaleString()} {tracker.unit}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: SORA, fontSize: 28, fontWeight: 800, color, letterSpacing: '-0.02em' }}>
                          {Math.round(pct)}%
                        </div>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                            <input
                              type="number"
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              placeholder={String(tracker.current)}
                              autoFocus
                              style={{ width: 80, background: '#111', border: '1px solid #2a2a2a', color: '#F5F5F5', padding: '4px 8px', fontSize: 12 }}
                            />
                            <button onClick={() => handleUpdateValue(tracker.id)} style={{
                              background: '#FF4D4D', border: 'none', color: '#F5F5F5',
                              padding: '4px 10px', fontSize: 11, fontWeight: 700, fontFamily: INTER,
                            }}>
                              Save
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => { setEditingId(tracker.id); setEditValue(String(tracker.current)); }} style={{
                            background: 'transparent', border: '1px solid #2a2a2a', color: '#888',
                            padding: '4px 10px', fontSize: 11, fontWeight: 700, marginTop: 4, fontFamily: INTER,
                          }}>
                            Update
                          </button>
                        )}
                      </div>
                    </div>
                    <div style={{ height: 6, background: '#222' }}>
                      <motion.div
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        style={{ height: '100%', background: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add custom tracker */}
            <div style={{ marginTop: 12 }}>
              {!addingTracker ? (
                <button onClick={() => setAddingTracker(true)} style={{
                  width: '100%', background: 'transparent', border: '1px dashed #2a2a2a',
                  color: '#888', padding: '14px', fontSize: 12, fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: INTER,
                }}>
                  + Add Custom Tracker
                </button>
              ) : (
                <form onSubmit={handleAddTracker} style={{
                  background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '20px 24px',
                  display: 'flex', flexDirection: 'column', gap: 12,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: INTER }}>
                    New Tracker
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px', gap: 10 }}>
                    <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Label (e.g. Protein)" style={{ background: '#111', border: '1px solid #2a2a2a', color: '#F5F5F5', padding: '8px 12px', fontSize: 13 }} />
                    <input type="number" value={newGoal} onChange={e => setNewGoal(e.target.value)} placeholder="Goal" style={{ background: '#111', border: '1px solid #2a2a2a', color: '#F5F5F5', padding: '8px 12px', fontSize: 13 }} />
                    <input value={newUnit} onChange={e => setNewUnit(e.target.value)} placeholder="Unit (g, oz...)" style={{ background: '#111', border: '1px solid #2a2a2a', color: '#F5F5F5', padding: '8px 12px', fontSize: 13 }} />
                  </div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setAddingTracker(false)} style={{ background: 'transparent', border: '1px solid #2a2a2a', color: '#888', padding: '8px 16px', fontSize: 11, fontFamily: INTER }}>Cancel</button>
                    <button type="submit" style={{ background: '#FF4D4D', border: 'none', color: '#F5F5F5', padding: '8px 20px', fontSize: 11, fontWeight: 700, fontFamily: INTER }}>Add</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ── MENTAL TAB ── */}
        {tab === 'mental' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Daily affirmation */}
            <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '28px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#888', textTransform: 'uppercase', marginBottom: 16, fontFamily: INTER }}>
                Today&#39;s Affirmation
              </div>
              <p style={{ fontFamily: SORA, fontSize: 20, fontWeight: 700, color: '#F5F5F5', lineHeight: 1.5, letterSpacing: '-0.01em' }}>
                &#8220;{affirmation}&#8221;
              </p>
            </div>

            {/* Yoga/Meditation */}
            <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '28px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#888', textTransform: 'uppercase', marginBottom: 16, fontFamily: INTER }}>
                Today&#39;s Practice
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontFamily: SORA, fontSize: 18, fontWeight: 800, color: '#F5F5F5', letterSpacing: '-0.01em' }}>
                  {exercise.name}
                </div>
                <div style={{ background: '#111', border: '1px solid #2a2a2a', padding: '4px 12px', fontSize: 11, fontWeight: 700, color: '#aaa', fontFamily: INTER }}>
                  {exercise.duration}
                </div>
              </div>
              <p style={{ fontSize: 14, color: '#bbb', lineHeight: 1.7, fontFamily: INTER }}>
                {exercise.description}
              </p>
            </div>

            {/* Mood board */}
            <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '28px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#888', textTransform: 'uppercase', marginBottom: 16, fontFamily: INTER }}>
                How are you feeling today?
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {MOODS.map(m => (
                  <button
                    key={m.type}
                    onClick={() => handleMood(m.type)}
                    style={{
                      background: mood === m.type ? m.color : 'transparent',
                      border: `1px solid ${mood === m.type ? m.color : '#2a2a2a'}`,
                      color: mood === m.type ? '#F5F5F5' : '#aaa',
                      padding: '10px 24px',
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: INTER,
                      transition: 'all 0.15s',
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              {mood && (
                <div style={{ marginTop: 16, fontSize: 13, color: '#888', fontFamily: INTER }}>
                  You logged: <span style={{ color: MOODS.find(m => m.type === mood)?.color }}>{mood}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
