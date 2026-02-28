'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '@/components/Nav';
import { useAuth } from '@/hooks/useAuth';
import {
  initializePosts, getPosts, addPost, likePost, addComment,
  getEvents, joinEvent, leaveEvent, createEvent,
  formatTimeAgo, type Post, type Event,
} from '@/lib/mockDB';

const SORA = "'Sora', 'Inter', system-ui, sans-serif";
const INTER = "'Inter', system-ui, sans-serif";

type Topic = 'all' | 'workout' | 'recipe' | 'motivation' | 'general';

const TOPICS: { key: Topic; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'workout', label: 'Workouts' },
  { key: 'recipe', label: 'Recipes' },
  { key: 'motivation', label: 'Motivation' },
  { key: 'general', label: 'General' },
];

const TOPIC_COLORS: Record<string, string> = {
  workout: '#FF4D4D',
  recipe: '#00C896',
  motivation: '#4DA6FF',
  general: '#888',
};

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

export default function Social() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Posts state
  const [posts, setPosts] = useState<Post[]>([]);
  const [topic, setTopic] = useState<Topic>('all');
  const [content, setContent] = useState('');
  const [composeTopic, setComposeTopic] = useState<Exclude<Topic, 'all'>>('workout');
  const [composing, setComposing] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Events state
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<'posts' | 'events'>('posts');
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '', description: '', category: 'challenge' as Event['category'],
    date: '', location: '',
  });

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading, router]);

  useEffect(() => {
    setPosts(initializePosts());
    setEvents(getEvents());
  }, []);

  // ── Post handlers ──────────────────────────────────────────────────────────
  function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !content.trim()) return;
    setPosts(addPost({ userId: user.id, username: user.username, displayName: user.displayName, content: content.trim(), topic: composeTopic }));
    setContent('');
    setComposing(false);
  }

  function handleLike(postId: string) {
    if (!user) return;
    setPosts(likePost(postId, user.id));
  }

  function toggleComments(postId: string) {
    setExpandedComments(prev => {
      const next = new Set(prev);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return next;
    });
  }

  function handleComment(postId: string) {
    if (!user || !commentInputs[postId]?.trim()) return;
    setPosts(addComment(postId, { userId: user.id, username: user.username, displayName: user.displayName, content: commentInputs[postId].trim() }));
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  }

  // ── Event handlers ─────────────────────────────────────────────────────────
  function handleJoin(eventId: string) { if (!user) return; setEvents(joinEvent(eventId, user.id)); }
  function handleLeave(eventId: string) { if (!user) return; setEvents(leaveEvent(eventId, user.id)); }

  function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !newEvent.title.trim() || !newEvent.description.trim() || !newEvent.date.trim()) return;
    setEvents(createEvent({
      title: newEvent.title.trim(),
      description: newEvent.description.trim(),
      category: newEvent.category,
      date: newEvent.date.trim(),
      location: newEvent.location.trim() || undefined,
    }, user.id));
    setNewEvent({ title: '', description: '', category: 'challenge', date: '', location: '' });
    setCreatingEvent(false);
  }

  if (loading || !user) return null;

  const filtered = topic === 'all' ? posts : posts.filter(p => (p.topic ?? 'general') === topic);

  return (
    <div style={{ minHeight: '100vh', background: '#111111' }}>
      <Nav user={user} />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px 48px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#888', textTransform: 'uppercase', marginBottom: 6, fontFamily: INTER }}>Social</p>
            <h1 style={{ fontFamily: SORA, fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: '#F5F5F5' }}>What&#39;s happening.</h1>
          </div>
          {view === 'posts' && (
            <button onClick={() => setComposing(v => !v)} style={{ background: '#FF4D4D', border: 'none', color: '#F5F5F5', padding: '10px 22px', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0, marginLeft: 16, fontFamily: INTER }}>
              Post
            </button>
          )}
          {view === 'events' && (
            <button onClick={() => setCreatingEvent(v => !v)} style={{ background: '#FF4D4D', border: 'none', color: '#F5F5F5', padding: '10px 22px', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0, marginLeft: 16, fontFamily: INTER }}>
              + Create
            </button>
          )}
        </div>

        {/* View tabs */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 20, borderBottom: '1px solid #1e1e1e' }}>
          {(['posts', 'events'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '8px 20px', background: 'transparent', border: 'none',
              borderBottom: view === v ? '2px solid #FF4D4D' : '2px solid transparent',
              color: view === v ? '#F5F5F5' : '#888', fontSize: 12, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: -1, fontFamily: INTER,
            }}>
              {v === 'posts' ? 'Feed' : 'Events'}
            </button>
          ))}
        </div>

        {/* ── POSTS VIEW ─────────────────────────────────────────────────────── */}
        {view === 'posts' && (
          <>
            {/* Compose */}
            <AnimatePresence>
              {composing && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 20 }}>
                  <form onSubmit={handlePost} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', padding: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#FF4D4D', marginBottom: 12, fontFamily: SORA }}>{user.displayName}</div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                      {TOPICS.filter(t => t.key !== 'all').map(t => (
                        <button key={t.key} type="button" onClick={() => setComposeTopic(t.key as Exclude<Topic, 'all'>)} style={{
                          background: composeTopic === t.key ? (TOPIC_COLORS[t.key] ?? '#888') : 'transparent',
                          border: `1px solid ${composeTopic === t.key ? (TOPIC_COLORS[t.key] ?? '#888') : '#2a2a2a'}`,
                          color: composeTopic === t.key ? '#F5F5F5' : '#888',
                          padding: '4px 12px', fontSize: 11, fontWeight: 700, fontFamily: INTER,
                        }}>{t.label}</button>
                      ))}
                    </div>
                    <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Share a workout, recipe, or thought..." autoFocus rows={3}
                      style={{ width: '100%', background: '#111111', border: '1px solid #2a2a2a', color: '#F5F5F5', padding: '12px 14px', fontSize: 14, resize: 'none', outline: 'none', fontFamily: INTER }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                      <button type="button" onClick={() => setComposing(false)} style={{ background: 'transparent', border: '1px solid #2a2a2a', color: '#888', padding: '8px 16px', fontSize: 11, fontFamily: INTER }}>Cancel</button>
                      <button type="submit" style={{ background: '#FF4D4D', border: 'none', color: '#F5F5F5', padding: '8px 22px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: INTER }}>Post</button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Topic filter */}
            <div style={{ display: 'flex', gap: 2, marginBottom: 20, flexWrap: 'wrap' }}>
              {TOPICS.map(t => (
                <button key={t.key} onClick={() => setTopic(t.key)} style={{
                  background: topic === t.key ? '#FF4D4D' : '#1a1a1a',
                  border: `1px solid ${topic === t.key ? '#FF4D4D' : '#2a2a2a'}`,
                  color: topic === t.key ? '#F5F5F5' : '#aaa',
                  padding: '6px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: INTER,
                }}>{t.label}</button>
              ))}
            </div>

            {/* Posts list */}
            {filtered.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', border: '1px solid #1e1e1e', color: '#888', fontSize: 13, fontFamily: INTER }}>Nothing here yet. Be the first to post.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filtered.map((post, i) => {
                  const liked = user ? post.likedBy.includes(user.id) : false;
                  const postTopic = post.topic ?? 'general';
                  const topicColor = TOPIC_COLORS[postTopic] ?? '#888';
                  const comments = post.comments ?? [];
                  const isExpanded = expandedComments.has(post.id);

                  return (
                    <motion.div key={post.id} initial={i === 0 ? { opacity: 0, y: -8 } : false} animate={{ opacity: 1, y: 0 }}
                      style={{ background: '#1a1a1a', border: '1px solid #222' }}>
                      <div style={{ padding: '20px 24px' }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontFamily: SORA, fontSize: 13, fontWeight: 700, color: '#F5F5F5' }}>{post.displayName}</span>
                            <span style={{ fontSize: 11, color: '#666', fontFamily: INTER }}>@{post.username}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: topicColor, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: INTER, background: '#111', padding: '2px 8px', border: `1px solid ${topicColor}22` }}>
                              {postTopic}
                            </span>
                          </div>
                          <span style={{ fontSize: 11, color: '#666', fontFamily: INTER }}>{formatTimeAgo(post.timestamp)}</span>
                        </div>

                        {/* Content */}
                        <p style={{ fontSize: 14, color: '#ddd', lineHeight: 1.65, marginBottom: 16, fontFamily: INTER }}>{post.content}</p>

                        {/* PR ref */}
                        {post.prRef && (
                          <div style={{ background: '#111111', border: '1px solid #2a2a2a', padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 2, height: 32, background: '#FF4D4D', flexShrink: 0 }} />
                            <div>
                              <div style={{ fontSize: 10, fontWeight: 700, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: INTER }}>Personal Record</div>
                              <div style={{ fontFamily: SORA, fontSize: 14, fontWeight: 700, color: '#FF4D4D', marginTop: 2 }}>{post.prRef.exercise} — {post.prRef.value}{post.prRef.unit}</div>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <button onClick={() => handleLike(post.id)} style={{
                            background: 'transparent', border: `1px solid ${liked ? '#FF4D4D' : '#2a2a2a'}`,
                            color: liked ? '#FF4D4D' : '#888', padding: '6px 14px', fontSize: 11, fontWeight: 700,
                            letterSpacing: '0.06em', textTransform: 'uppercase', display: 'flex', alignItems: 'center',
                            gap: 6, fontFamily: INTER, transition: 'all 0.15s',
                          }}>
                            <svg width="12" height="11" viewBox="0 0 12 11" fill={liked ? '#FF4D4D' : 'none'} stroke={liked ? '#FF4D4D' : '#888'} strokeWidth="1.5">
                              <path d="M6 10C6 10 1 6.8 1 3.5C1 2.12 2.12 1 3.5 1C4.47 1 5.3 1.54 5.74 2.34L6 2.83L6.26 2.34C6.7 1.54 7.53 1 8.5 1C9.88 1 11 2.12 11 3.5C11 6.8 6 10 6 10Z"/>
                            </svg>
                            {post.likes}
                          </button>
                          <button onClick={() => toggleComments(post.id)} style={{
                            background: 'transparent', border: `1px solid ${isExpanded ? '#4DA6FF' : '#2a2a2a'}`,
                            color: isExpanded ? '#4DA6FF' : '#888', padding: '6px 14px', fontSize: 11, fontWeight: 700,
                            display: 'flex', alignItems: 'center', gap: 6, fontFamily: INTER,
                          }}>
                            <svg width="13" height="12" viewBox="0 0 13 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M11.5 7.5C11.5 8.05 11.05 8.5 10.5 8.5H3.5L1.5 10.5V2.5C1.5 1.95 1.95 1.5 2.5 1.5H10.5C11.05 1.5 11.5 1.95 11.5 2.5V7.5Z"/>
                            </svg>
                            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                          </button>
                        </div>
                      </div>

                      {/* Comments section */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            style={{ overflow: 'hidden', borderTop: '1px solid #222' }}>
                            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                              {comments.length === 0 && (
                                <div style={{ fontSize: 13, color: '#666', fontFamily: INTER }}>No comments yet. Be the first.</div>
                              )}
                              {comments.map(c => (
                                <div key={c.id} style={{ display: 'flex', gap: 10 }}>
                                  <div style={{
                                    width: 28, height: 28, background: '#2a2a2a', flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 10, fontWeight: 800, color: '#888', fontFamily: SORA,
                                  }}>
                                    {c.displayName.slice(0, 2).toUpperCase()}
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                      <span style={{ fontSize: 12, fontWeight: 700, color: '#F5F5F5', fontFamily: SORA }}>{c.displayName}</span>
                                      <span style={{ fontSize: 11, color: '#555', fontFamily: INTER }}>{formatTimeAgo(c.timestamp)}</span>
                                    </div>
                                    <p style={{ fontSize: 13, color: '#ccc', lineHeight: 1.5, fontFamily: INTER }}>{c.content}</p>
                                  </div>
                                </div>
                              ))}

                              {/* Comment input */}
                              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                                <input
                                  value={commentInputs[post.id] ?? ''}
                                  onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleComment(post.id); } }}
                                  placeholder="Add a comment..."
                                  style={{ flex: 1, background: '#111', border: '1px solid #2a2a2a', color: '#F5F5F5', padding: '8px 12px', fontSize: 13, fontFamily: INTER }}
                                />
                                <button onClick={() => handleComment(post.id)} style={{
                                  background: '#FF4D4D', border: 'none', color: '#F5F5F5',
                                  padding: '8px 16px', fontSize: 11, fontWeight: 700, fontFamily: INTER,
                                }}>
                                  Send
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── EVENTS VIEW ────────────────────────────────────────────────────── */}
        {view === 'events' && (
          <>
            {/* Create event form */}
            <AnimatePresence>
              {creatingEvent && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 20 }}>
                  <form onSubmit={handleCreateEvent} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: INTER }}>New Event</div>

                    <input value={newEvent.title} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))}
                      placeholder="Event title" style={{ background: '#111', border: '1px solid #2a2a2a', color: '#F5F5F5', padding: '10px 14px', fontSize: 14, fontFamily: INTER }} />

                    <textarea value={newEvent.description} onChange={e => setNewEvent(p => ({ ...p, description: e.target.value }))}
                      placeholder="What is this event about?" rows={2}
                      style={{ background: '#111', border: '1px solid #2a2a2a', color: '#F5F5F5', padding: '10px 14px', fontSize: 13, resize: 'none', outline: 'none', fontFamily: INTER }} />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                      <select value={newEvent.category} onChange={e => setNewEvent(p => ({ ...p, category: e.target.value as Event['category'] }))}>
                        <option value="challenge">Challenge</option>
                        <option value="meetup">Meetup</option>
                        <option value="gathering">Gathering</option>
                      </select>
                      <input value={newEvent.date} onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))}
                        placeholder="Date (e.g. Mar 15)" style={{ background: '#111', border: '1px solid #2a2a2a', color: '#F5F5F5', padding: '10px 14px', fontSize: 13, fontFamily: INTER }} />
                      <input value={newEvent.location} onChange={e => setNewEvent(p => ({ ...p, location: e.target.value }))}
                        placeholder="Location (optional)" style={{ background: '#111', border: '1px solid #2a2a2a', color: '#F5F5F5', padding: '10px 14px', fontSize: 13, fontFamily: INTER }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <button type="button" onClick={() => setCreatingEvent(false)} style={{ background: 'transparent', border: '1px solid #2a2a2a', color: '#888', padding: '8px 16px', fontSize: 11, fontFamily: INTER }}>Cancel</button>
                      <button type="submit" style={{ background: '#FF4D4D', border: 'none', color: '#F5F5F5', padding: '8px 22px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', fontFamily: INTER }}>Create</button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Events list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {events.map(event => {
                const isJoined = user && event.attendees.includes(user.id);
                const catColor = CATEGORY_COLOR[event.category];
                return (
                  <div key={event.id} style={{ background: '#1a1a1a', border: `1px solid ${isJoined ? '#2a2a1a' : '#1e1e1e'}`, padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: catColor, fontFamily: INTER }}>{CATEGORY_LABEL[event.category]}</span>
                        <span style={{ fontSize: 10, color: '#666', fontFamily: INTER }}>{event.date}</span>
                        {event.location && <span style={{ fontSize: 10, color: '#666', fontFamily: INTER }}>· {event.location}</span>}
                      </div>
                      <div style={{ fontFamily: SORA, fontSize: 16, fontWeight: 800, color: '#F5F5F5', marginBottom: 6 }}>{event.title}</div>
                      <div style={{ fontSize: 13, color: '#aaa', lineHeight: 1.6, fontFamily: INTER, maxWidth: 480 }}>{event.description}</div>
                      <div style={{ marginTop: 10, fontSize: 11, color: '#666', fontFamily: INTER }}>
                        {event.attendees.length} {event.attendees.length === 1 ? 'person' : 'people'} going
                      </div>
                    </div>
                    <button onClick={() => isJoined ? handleLeave(event.id) : handleJoin(event.id)} style={{
                      background: isJoined ? 'transparent' : '#FF4D4D',
                      border: isJoined ? '1px solid #3a3a3a' : 'none',
                      color: isJoined ? '#888' : '#F5F5F5',
                      padding: '10px 22px', fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: INTER, whiteSpace: 'nowrap',
                    }}>
                      {isJoined ? 'Leave' : 'Join'}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
