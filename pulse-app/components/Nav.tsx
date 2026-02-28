'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/mockAuth';
import { User } from '@/lib/mockDB';
import Logo from './Logo';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/physical', label: 'Physical' },
  { href: '/feed', label: 'Feed' },
  { href: '/leaderboard', label: 'Rank' },
];

export default function Nav({ user }: { user: User }) {
  const path = usePathname();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace('/');
  }

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 60,
      background: '#111111',
      borderBottom: '1px solid #1e1e1e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        <Logo size="sm" />

        <div style={{ display: 'flex' }}>
          {NAV_ITEMS.map(item => {
            const active = path === item.href;
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'block',
                padding: '0 14px',
                height: 60,
                lineHeight: '60px',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: active ? '#FF4D4D' : '#555',
                textDecoration: 'none',
                borderBottom: active ? '2px solid #FF4D4D' : '2px solid transparent',
                transition: 'color 0.15s',
                fontFamily: "'Inter', system-ui, sans-serif",
              }}>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#F5F5F5',
            fontFamily: "'Sora', 'Inter', system-ui, sans-serif",
          }}>
            {user.displayName}
          </div>
          <div style={{ fontSize: 11, color: '#FF4D4D', fontWeight: 600, letterSpacing: '0.06em' }}>
            {user.xp.toLocaleString()} OU
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '1px solid #2a2a2a',
            color: '#555',
            padding: '6px 14px',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Exit
        </button>
      </div>
    </nav>
  );
}
