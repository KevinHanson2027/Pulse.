'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Nav from '@/components/Nav';
import { useAuth } from '@/hooks/useAuth';
import { getFriendsLeaderboard, type User } from '@/lib/mockDB';

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
    if (user) setBoard(getFriendsLeaderboard(user.id));
  }, [user]);

  if (loading || !user) return null;

  const topThree = board.slice(0, 3);
  const rest = board.slice(3);
  const userEntry = board.find(u => u.id === user.id);

  return (
    <div style={{ minHeight: '100vh', background: '#111111' }}>
      <Nav user={user} />
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '80px 24px 48px' }}>

        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#888', textTransform: 'uppercase', marginBottom: 6, fontFamily: INTER }}>
            Leaderboard
          </p>
          <h1 style={{ fontFamily: SORA, fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: '#F5F5F5' }}>
            Who&#39;s keeping up.
          </h1>
          <p style={{ fontSize: 13, color: '#888', marginTop: 8, fontFamily: INTER }}>
            Ranked by current streak — longest streak wins.
          </p>
        </div>

        {/* Your position */}
        {userEntry && (
          <div style={{
            background: '#1e1212', border: '1px solid #3a1a1a', padding: '16px 24px',
            marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#FF4D4D', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: INTER }}>
                You
              </span>
              <span style={{ fontFamily: SORA, fontSize: 28, fontWeight: 800, color: '#FF4D4D', letterSpacing: '-0.02em' }}>
                #{userEntry.rank}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: SORA, fontSize: 14, fontWeight: 700, color: '#F5F5F5' }}>{userEntry.displayName}</div>
              <div style={{ fontSize: 12, color: '#aaa', fontWeight: 600, marginTop: 2, fontFamily: INTER }}>
                {userEntry.streak} day streak
              </div>
            </div>
          </div>
        )}

        {/* Podium */}
        {topThree.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
            {topThree.map((entry, i) => {
              const isUser = entry.id === user.id;
              const podiumColor = i === 0 ? '#FF4D4D' : i === 1 ? '#aaa' : '#666';
              return (
                <motion.div key={entry.id} layout style={{
                  background: isUser ? '#1e1212' : '#1a1a1a',
                  border: `1px solid ${isUser ? '#3a1a1a' : i === 0 ? '#3a2222' : '#2a2a2a'}`,
                  padding: '20px',
                  paddingTop: 20 + (i === 0 ? 60 : i === 1 ? 40 : 24),
                  position: 'relative',
                }}>
                  <div style={{ position: 'absolute', top: 14, left: 20, fontFamily: SORA, fontSize: 32, fontWeight: 800, color: podiumColor, lineHeight: 1 }}>
                    #{entry.rank}
                  </div>
                  <div style={{ fontFamily: SORA, fontSize: 14, fontWeight: 700, color: '#F5F5F5', marginBottom: 4 }}>
                    {entry.displayName}
                    {isUser && <span style={{ fontSize: 10, color: '#FF4D4D', marginLeft: 8, fontFamily: INTER }}>You</span>}
                  </div>
                  <div style={{ fontFamily: SORA, fontSize: 24, fontWeight: 800, color: podiumColor, letterSpacing: '-0.02em' }}>
                    {entry.streak}
                    <span style={{ fontSize: 12, fontWeight: 600, marginLeft: 4, color: '#666', fontFamily: INTER }}>days</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 6, fontFamily: INTER }}>
                    best: {entry.longestStreak}d
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Table */}
        {rest.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr 120px 100px', padding: '8px 20px', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', fontFamily: INTER }}>
              <span>Rank</span>
              <span>Name</span>
              <span style={{ textAlign: 'right' }}>Streak</span>
              <span style={{ textAlign: 'right' }}>Best</span>
            </div>
            {rest.map(entry => {
              const isUser = entry.id === user.id;
              return (
                <motion.div key={entry.id} layout style={{
                  display: 'grid', gridTemplateColumns: '52px 1fr 120px 100px',
                  padding: '14px 20px',
                  background: isUser ? '#1e1212' : '#1a1a1a',
                  border: `1px solid ${isUser ? '#3a1a1a' : '#1e1e1e'}`,
                  alignItems: 'center', marginBottom: 2,
                }}>
                  <span style={{ fontFamily: SORA, fontSize: 14, fontWeight: 800, color: '#555' }}>#{entry.rank}</span>
                  <div>
                    <span style={{ fontFamily: SORA, fontSize: 14, fontWeight: 700, color: '#F5F5F5' }}>{entry.displayName}</span>
                    {isUser && <span style={{ fontSize: 10, color: '#FF4D4D', marginLeft: 8, fontFamily: INTER }}>You</span>}
                    <div style={{ fontSize: 11, color: '#666', marginTop: 2, fontFamily: INTER }}>@{entry.username}</div>
                  </div>
                  <span style={{ fontFamily: SORA, fontSize: 15, fontWeight: 700, color: '#FF4D4D', textAlign: 'right' }}>
                    {entry.streak}d
                  </span>
                  <span style={{ fontSize: 11, color: '#666', textAlign: 'right', fontFamily: INTER }}>{entry.longestStreak}d</span>
                </motion.div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 24, fontSize: 11, color: '#333', textAlign: 'center', fontFamily: INTER, letterSpacing: '0.06em' }}>
          RANKED BY CURRENT STREAK
        </div>
      </main>
    </div>
  );
}
