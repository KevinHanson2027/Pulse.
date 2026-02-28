'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Nav from '@/components/Nav';
import { useAuth } from '@/hooks/useAuth';
import { getEvents, joinEvent, leaveEvent, type Event } from '@/lib/mockDB';

const SORA = "'Sora', 'Inter', system-ui, sans-serif";
const INTER = "'Inter', system-ui, sans-serif";

const CATEGORY_LABEL: Record<Event['category'], string> = {
  challenge: 'Challenge',
  meetup: 'Meetup',
  gathering: 'Gathering',
};

const CATEGORY_COLOR: Record<Event['category'], string> = {
  challenge: '#FF4D4D',
  meetup: '#4DA6FF',
  gathering: '#888',
};

export default function Events() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<'all' | Event['category']>('all');

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading, router]);

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  if (loading || !user) return null;

  function handleJoin(eventId: string) {
    if (!user) return;
    setEvents(joinEvent(eventId, user.id));
  }

  function handleLeave(eventId: string) {
    if (!user) return;
    setEvents(leaveEvent(eventId, user.id));
  }

  const filtered = filter === 'all' ? events : events.filter(e => e.category === filter);
  const joined = events.filter(e => user && e.attendees.includes(user.id));

  return (
    <div style={{ minHeight: '100vh', background: '#111111' }}>
      <Nav user={user} />
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '80px 24px 48px' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
            color: '#444', textTransform: 'uppercase', marginBottom: 6, fontFamily: INTER,
          }}>
            Events
          </p>
          <h1 style={{ fontFamily: SORA, fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: '#F5F5F5' }}>
            Activate.
          </h1>
        </div>

        {/* Your events callout */}
        {joined.length > 0 && (
          <div style={{
            background: '#1e1212',
            border: '1px solid #3a1a1a',
            padding: '14px 24px',
            marginBottom: 32,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#FF4D4D', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: INTER }}>
              Joined
            </span>
            <span style={{ fontFamily: SORA, fontSize: 22, fontWeight: 800, color: '#FF4D4D' }}>
              {joined.length}
            </span>
            <span style={{ fontSize: 12, color: '#555', fontFamily: INTER }}>
              {joined.map(e => e.title).join(' · ')}
            </span>
          </div>
        )}

        {/* Filter */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 28 }}>
          {(['all', 'challenge', 'meetup', 'gathering'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? '#FF4D4D' : '#1a1a1a',
                border: `1px solid ${filter === f ? '#FF4D4D' : '#2a2a2a'}`,
                color: filter === f ? '#F5F5F5' : '#555',
                padding: '6px 16px',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: INTER,
              }}
            >
              {f === 'all' ? 'All' : CATEGORY_LABEL[f]}
            </button>
          ))}
        </div>

        {/* Event cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filtered.map(event => {
            const isJoined = user && event.attendees.includes(user.id);
            const catColor = CATEGORY_COLOR[event.category];
            return (
              <motion.div
                key={event.id}
                layout
                style={{
                  background: isJoined ? '#1a1612' : '#1a1a1a',
                  border: `1px solid ${isJoined ? '#3a2a1a' : '#1e1e1e'}`,
                  padding: '20px 24px',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: 20,
                  alignItems: 'center',
                }}
              >
                <div>
                  {/* Category + Date row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: catColor,
                      fontFamily: INTER,
                    }}>
                      {CATEGORY_LABEL[event.category]}
                    </span>
                    <span style={{ fontSize: 10, color: '#333', fontFamily: INTER, letterSpacing: '0.06em' }}>
                      {event.date}
                    </span>
                  </div>

                  {/* Title */}
                  <div style={{
                    fontFamily: SORA,
                    fontSize: 17,
                    fontWeight: 800,
                    color: '#F5F5F5',
                    letterSpacing: '-0.02em',
                    marginBottom: 8,
                  }}>
                    {event.title}
                  </div>

                  {/* Description */}
                  <div style={{
                    fontSize: 13,
                    color: '#555',
                    lineHeight: 1.6,
                    fontFamily: INTER,
                    maxWidth: 520,
                  }}>
                    {event.description}
                  </div>

                  {/* Attendee count */}
                  <div style={{ marginTop: 12, fontSize: 11, color: '#333', fontFamily: INTER, letterSpacing: '0.06em' }}>
                    {event.attendees.length} {event.attendees.length === 1 ? 'operator' : 'operators'} joined
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => isJoined ? handleLeave(event.id) : handleJoin(event.id)}
                  style={{
                    background: isJoined ? 'transparent' : '#FF4D4D',
                    border: isJoined ? '1px solid #3a3a3a' : 'none',
                    color: isJoined ? '#555' : '#F5F5F5',
                    padding: '10px 22px',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontFamily: INTER,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isJoined ? 'Leave' : 'Join'}
                </button>
              </motion.div>
            );
          })}
        </div>

        <div style={{
          marginTop: 24, fontSize: 11, color: '#2a2a2a',
          textAlign: 'center', fontFamily: INTER, letterSpacing: '0.06em',
        }}>
          NEW EVENTS ADDED WEEKLY. SHOW UP.
        </div>
      </main>
    </div>
  );
}
