'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '@/components/Nav';
import { useAuth } from '@/hooks/useAuth';
import { getPosts, addPost, likePost, formatTimeAgo, type Post } from '@/lib/mockDB';

const SORA = "'Sora', 'Inter', system-ui, sans-serif";
const INTER = "'Inter', system-ui, sans-serif";

export default function Feed() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [composing, setComposing] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading, router]);

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !content.trim()) return;
    setPosts(addPost({
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      content: content.trim(),
    }));
    setContent('');
    setComposing(false);
  }

  function handleLike(postId: string) {
    if (!user) return;
    setPosts(likePost(postId, user.id));
  }

  if (loading || !user) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#111111' }}>
      <Nav user={user} />
      <main style={{ maxWidth: 680, margin: '0 auto', padding: '80px 24px 48px' }}>

        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#444', textTransform: 'uppercase', marginBottom: 6, fontFamily: INTER }}>
            Social Feed
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h1 style={{ fontFamily: SORA, fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: '#F5F5F5' }}>
              The community is watching.
            </h1>
            <button
              onClick={() => setComposing(v => !v)}
              style={{
                background: '#FF4D4D',
                border: 'none',
                color: '#F5F5F5',
                padding: '10px 22px',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                flexShrink: 0,
                marginLeft: 16,
                fontFamily: INTER,
              }}
            >
              Post
            </button>
          </div>
        </div>

        {/* Compose */}
        <AnimatePresence>
          {composing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginBottom: 20 }}
            >
              <form onSubmit={handlePost} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', padding: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#FF4D4D', marginBottom: 12, letterSpacing: '0.06em', fontFamily: SORA }}>
                  {user.displayName}
                </div>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Log your output. No filters."
                  autoFocus
                  rows={3}
                  style={{
                    width: '100%',
                    background: '#111111',
                    border: '1px solid #2a2a2a',
                    color: '#F5F5F5',
                    padding: '12px 14px',
                    fontSize: 14,
                    resize: 'none',
                    outline: 'none',
                    fontFamily: INTER,
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                  <button
                    type="button"
                    onClick={() => setComposing(false)}
                    style={{ background: 'transparent', border: '1px solid #2a2a2a', color: '#555', padding: '8px 16px', fontSize: 11, fontWeight: 700, fontFamily: INTER }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ background: '#FF4D4D', border: 'none', color: '#F5F5F5', padding: '8px 22px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: INTER }}
                  >
                    Execute
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts */}
        {posts.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', border: '1px solid #1e1e1e', color: '#333', fontSize: 13, fontFamily: INTER }}>
            Zero data. Start moving.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {posts.map((post, i) => {
              const liked = user ? post.likedBy.includes(user.id) : false;
              return (
                <motion.div
                  key={post.id}
                  initial={i === 0 ? { opacity: 0, y: -8 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid #222',
                    padding: '20px 24px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <span style={{ fontFamily: SORA, fontSize: 13, fontWeight: 700, color: '#F5F5F5' }}>{post.displayName}</span>
                      <span style={{ fontSize: 12, color: '#333', marginLeft: 8, fontFamily: INTER }}>@{post.username}</span>
                    </div>
                    <span style={{ fontSize: 11, color: '#333', fontFamily: INTER }}>{formatTimeAgo(post.timestamp)}</span>
                  </div>

                  <p style={{ fontSize: 14, color: '#C0C0C0', lineHeight: 1.65, marginBottom: 16, fontFamily: INTER }}>
                    {post.content}
                  </p>

                  {post.prRef && (
                    <div style={{
                      background: '#111111',
                      border: '1px solid #2a2a2a',
                      padding: '10px 14px',
                      marginBottom: 16,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}>
                      <div style={{ width: 2, height: 32, background: '#FF4D4D', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: INTER }}>Limit Break</div>
                        <div style={{ fontFamily: SORA, fontSize: 14, fontWeight: 700, color: '#FF4D4D', marginTop: 2 }}>
                          {post.prRef.exercise} — {post.prRef.value}{post.prRef.unit}
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button
                      onClick={() => handleLike(post.id)}
                      style={{
                        background: 'transparent',
                        border: `1px solid ${liked ? '#FF4D4D' : '#2a2a2a'}`,
                        color: liked ? '#FF4D4D' : '#444',
                        padding: '6px 14px',
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontFamily: INTER,
                        transition: 'all 0.15s',
                      }}
                    >
                      <svg width="12" height="11" viewBox="0 0 12 11" fill={liked ? '#FF4D4D' : 'none'} stroke={liked ? '#FF4D4D' : '#444'} strokeWidth="1.5">
                        <path d="M6 10C6 10 1 6.8 1 3.5C1 2.12 2.12 1 3.5 1C4.47 1 5.3 1.54 5.74 2.34L6 2.83L6.26 2.34C6.7 1.54 7.53 1 8.5 1C9.88 1 11 2.12 11 3.5C11 6.8 6 10 6 10Z"/>
                      </svg>
                      {post.likes}
                    </button>
                    <span style={{ fontSize: 11, color: '#2a2a2a', fontFamily: INTER }}>
                      Acknowledged.
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
