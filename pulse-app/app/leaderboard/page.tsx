'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Nav from '@/components/Nav';
import { useAuth } from '@/hooks/useAuth';
import { getLeaderboard, type User } from '@/lib/mockDB';

const SORA = "'Sora', 'Inter', system-ui, sans-serif";
const INTER = "'Inter', system-ui, sans-serif";

export default function Leaderboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [board, setBoard] = useState<User[]>([]);

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading, router]);

  useEffect(() => {
    setBoard(getLeaderboard());
  }, []);

  if (loading || !user) return null;

  const topThree = board.slice(0, 3);
  const rest = board.slice(3);
  const userEntry = board.find(u => u.id === user.id);

  return (
    <div style={{ minHeight: '100vh', background: '#111111' }}>
      <Nav user={user} />
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '80px 24px 48px' }}>

        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#444', textTransform: 'uppercase', marginBottom: 6, fontFamily: INTER }}>
            Leaderboard
          </p>
          <h1 style={{ fontFamily: SORA, fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: '#F5F5F5' }}>
            Climb or fall.
          </h1>
        </div>

        {/* Your position callout */}
        {userEntry && (
          <motion.div
            layout
            style={{
              background: '#1e1212',
              border: '1px solid #3a1a1a',
              padding: '16px 24px',
              marginBottom: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#FF4D4D', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: INTER }}>
                Your Position
              </span>
              <span style={{ fontFamily: SORA, fontSize: 28, fontWeight: 800, color: '#FF4D4D', letterSpacing: '-0.02em' }}>
                #{userEntry.rank}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: SORA, fontSize: 14, fontWeight: 700, color: '#F5F5F5' }}>{userEntry.displayName}</div>
              <div style={{ fontSize: 12, color: '#FF4D4D', fontWeight: 600, marginTop: 2, fontFamily: INTER }}>
                {userEntry.xp.toLocaleString()} OU
              </div>
            </div>
          </motion.div>
        )}

        {/* Podium */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
          {topThree.map((entry, i) => {
            const isUser = entry.id === user.id;
            const podiumColor = i === 0 ? '#FF4D4D' : i === 1 ? '#888' : '#555';
            return (
              <motion.div
                key={entry.id}
                layout
                style={{
                  background: isUser ? '#1e1212' : '#1a1a1a',
                  border: `1px solid ${isUser ? '#3a1a1a' : i === 0 ? '#3a2222' : '#2a2a2a'}`,
                  padding: '20px',
                  position: 'relative',
                  paddingTop: 20 + (i === 0 ? 64 : i === 1 ? 44 : 32),
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 16,
                  left: 20,
                  fontFamily: SORA,
                  fontSize: 36,
                  fontWeight: 800,
                  color: podiumColor,
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}>
                  #{entry.rank}
                </div>
                <div style={{ fontFamily: SORA, fontSize: 14, fontWeight: 700, color: '#F5F5F5', marginBottom: 6 }}>
                  {entry.displayName}
                  {isUser && <span style={{ fontSize: 10, color: '#FF4D4D', marginLeft: 8, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: INTER }}>You</span>}
                </div>
                <div style={{ fontFamily: SORA, fontSize: 22, fontWeight: 800, color: podiumColor, letterSpacing: '-0.02em' }}>
                  {entry.xp.toLocaleString()}
                  <span style={{ fontSize: 11, fontWeight: 600, marginLeft: 4, color: '#444', fontFamily: INTER }}>OU</span>
                </div>
                <div style={{ fontSize: 11, color: '#333', marginTop: 8, fontFamily: INTER }}>
                  Chain: {entry.streak}d
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Full table */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '52px 1fr 130px 100px 100px',
            padding: '8px 20px',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#333',
            fontFamily: INTER,
          }}>
            <span>Rank</span>
            <span>Operator</span>
            <span style={{ textAlign: 'right' }}>Output Units</span>
            <span style={{ textAlign: 'right' }}>Chain</span>
            <span style={{ textAlign: 'right' }}>Best</span>
          </div>

          {rest.map(entry => {
            const isUser = entry.id === user.id;
            return (
              <motion.div
                key={entry.id}
                layout
                style={{
                  display: 'grid',
                  gridTemplateColumns: '52px 1fr 130px 100px 100px',
                  padding: '14px 20px',
                  background: isUser ? '#1e1212' : '#1a1a1a',
                  border: `1px solid ${isUser ? '#3a1a1a' : '#1e1e1e'}`,
                  alignItems: 'center',
                  marginBottom: 2,
                }}
              >
                <span style={{ fontFamily: SORA, fontSize: 14, fontWeight: 800, color: '#444' }}>#{entry.rank}</span>
                <div>
                  <span style={{ fontFamily: SORA, fontSize: 14, fontWeight: 700, color: '#F5F5F5' }}>{entry.displayName}</span>
                  {isUser && <span style={{ fontSize: 10, color: '#FF4D4D', marginLeft: 8, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: INTER }}>You</span>}
                  <div style={{ fontSize: 11, color: '#333', marginTop: 2, fontFamily: INTER }}>@{entry.username}</div>
                </div>
                <span style={{ fontFamily: SORA, fontSize: 15, fontWeight: 700, color: '#4DA6FF', textAlign: 'right' }}>
                  {entry.xp.toLocaleString()}
                </span>
                <span style={{ fontSize: 13, color: '#555', textAlign: 'right', fontFamily: INTER }}>{entry.streak}d</span>
                <span style={{ fontSize: 11, color: '#333', textAlign: 'right', fontFamily: INTER }}>{entry.longestStreak}d</span>
              </motion.div>
            );
          })}
        </div>

        <div style={{ marginTop: 24, fontSize: 11, color: '#2a2a2a', textAlign: 'center', fontFamily: INTER, letterSpacing: '0.06em' }}>
          RANKINGS UPDATE IN REAL TIME. EXECUTE TO CLIMB.
        </div>
      </main>
    </div>
  );
}
