'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signUp, login } from '@/lib/mockAuth';
import Logo from '@/components/Logo';

function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const m = params.get('mode');
    if (m === 'login') setMode('login');
  }, [params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!username.trim()) { setError('Username required.'); return; }
    if (mode === 'signup' && !displayName.trim()) { setError('Display name required.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    if (mode === 'signup') {
      const { error: err } = signUp(username.trim().toLowerCase(), displayName.trim());
      if (err) { setError(err); setLoading(false); return; }
    } else {
      const { error: err } = login(username.trim().toLowerCase());
      if (err) { setError(err); setLoading(false); return; }
    }
    router.replace('/dashboard');
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#111111',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <Logo size="md" />
        </div>

        {/* Mode tabs */}
        <div style={{ display: 'flex', marginBottom: 32, borderBottom: '1px solid #2a2a2a' }}>
          {(['signup', 'login'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              style={{
                flex: 1,
                padding: '10px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: mode === m ? '2px solid #FF4D4D' : '2px solid transparent',
                color: mode === m ? '#FF4D4D' : '#444',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: -1,
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              {m === 'signup' ? 'Sign Up' : 'Login'}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 24 }}>
          <h2 style={{
            fontFamily: "'Sora', 'Inter', system-ui, sans-serif",
            fontSize: 22,
            fontWeight: 800,
            color: '#F5F5F5',
            letterSpacing: '-0.02em',
            marginBottom: 6,
          }}>
            {mode === 'signup' ? 'Create Account.' : 'Login.'}
          </h2>
          <p style={{ fontSize: 13, color: '#444', fontFamily: "'Inter', system-ui, sans-serif" }}>
            {mode === 'signup' ? 'Join the movement.' : 'Continue executing.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mode === 'signup' && (
            <div>
              <label style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#444',
                textTransform: 'uppercase',
                marginBottom: 8,
                fontFamily: "'Inter', system-ui, sans-serif",
              }}>
                Display Name
              </label>
              <input
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="e.g. Alex Stone"
              />
            </div>
          )}

          <div>
            <label style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: '#444',
              textTransform: 'uppercase',
              marginBottom: 8,
              fontFamily: "'Inter', system-ui, sans-serif",
            }}>
              Username
            </label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. alex_stone"
            />
          </div>

          {error && (
            <p style={{ fontSize: 12, color: '#FF4D4D', fontWeight: 600, fontFamily: "'Inter', system-ui, sans-serif" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              background: loading ? '#1a1a1a' : '#FF4D4D',
              color: loading ? '#444' : '#F5F5F5',
              border: 'none',
              padding: '14px',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              width: '100%',
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            {loading ? 'Verifying...' : mode === 'signup' ? 'Execute' : 'Enter'}
          </button>
        </form>

        <div style={{
          marginTop: 24,
          fontSize: 12,
          color: '#333',
          textAlign: 'center',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}>
          {mode === 'signup' ? 'Already have an account? ' : 'No account? '}
          <button
            onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setError(''); }}
            style={{
              background: 'none',
              border: 'none',
              color: '#FF4D4D',
              fontSize: 12,
              fontWeight: 600,
              padding: 0,
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            {mode === 'signup' ? 'Login' : 'Sign up'}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
