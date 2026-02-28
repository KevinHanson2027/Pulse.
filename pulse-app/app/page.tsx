'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/mockAuth';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Landing() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) router.replace('/dashboard');
  }, [router]);

  return (
    <main style={{
      minHeight: '100vh',
      background: '#111111',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 40px',
        borderBottom: '1px solid #1e1e1e',
      }}>
        <Logo size="sm" />
        <Link href="/auth?mode=login" style={{
          fontSize: 12,
          fontWeight: 700,
          color: '#555',
          textDecoration: 'none',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          Login
        </Link>
      </div>

      {/* Hero */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
          padding: '6px 14px',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: '#FF4D4D',
          textTransform: 'uppercase',
          marginBottom: 32,
        }}>
          Performance Social OS
        </div>

        <h1 style={{
          fontFamily: "'Sora', 'Inter', system-ui, sans-serif",
          fontSize: 'clamp(40px, 7vw, 80px)',
          fontWeight: 800,
          lineHeight: 1.0,
          letterSpacing: '-0.04em',
          color: '#F5F5F5',
          marginBottom: 8,
          maxWidth: 720,
        }}>
          The Operating System
        </h1>
        <h1 style={{
          fontFamily: "'Sora', 'Inter', system-ui, sans-serif",
          fontSize: 'clamp(40px, 7vw, 80px)',
          fontWeight: 800,
          lineHeight: 1.0,
          letterSpacing: '-0.04em',
          color: '#FF4D4D',
          marginBottom: 32,
          maxWidth: 720,
        }}>
          for the Disciplined.
        </h1>

        <p style={{
          fontSize: 16,
          color: '#555',
          lineHeight: 1.7,
          maxWidth: 400,
          marginBottom: 48,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}>
          Never Miss a Beat.<br />
          Discipline becomes social currency.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth?mode=signup" style={{
            display: 'inline-block',
            background: '#FF4D4D',
            color: '#F5F5F5',
            padding: '15px 40px',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textDecoration: 'none',
            textTransform: 'uppercase',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}>
            Start Execution
          </Link>
          <Link href="/auth?mode=login" style={{
            display: 'inline-block',
            background: 'transparent',
            color: '#F5F5F5',
            padding: '15px 40px',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textDecoration: 'none',
            textTransform: 'uppercase',
            border: '1px solid #2a2a2a',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}>
            Login
          </Link>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{
        borderTop: '1px solid #1e1e1e',
        display: 'flex',
      }}>
        {[
          { value: '10K+', label: 'Active Operators' },
          { value: '2.4M', label: 'Habits Logged' },
          { value: '94%', label: 'Streak Retention' },
          { value: '48h', label: 'Avg Session Depth' },
        ].map((stat, i) => (
          <div key={i} style={{
            flex: 1,
            textAlign: 'center',
            padding: '28px 16px',
            borderRight: i < 3 ? '1px solid #1e1e1e' : 'none',
          }}>
            <div style={{
              fontFamily: "'Sora', 'Inter', system-ui, sans-serif",
              fontSize: 28,
              fontWeight: 800,
              color: '#FF4D4D',
              letterSpacing: '-0.02em',
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: 11,
              color: '#444',
              marginTop: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontFamily: "'Inter', system-ui, sans-serif",
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
