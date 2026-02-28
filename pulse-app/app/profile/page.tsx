'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import { useAuth } from '@/hooks/useAuth';
import { saveCurrentUser } from '@/lib/mockAuth';
import { updateProfile, getAvatarUrl, saveAvatarUrl } from '@/lib/mockDB';

const SORA = "'Sora', 'Inter', system-ui, sans-serif";
const INTER = "'Inter', system-ui, sans-serif";

const AVATAR_COLORS = [
  { hex: '#FF4D4D', label: 'Red' },
  { hex: '#4DA6FF', label: 'Blue' },
  { hex: '#00C896', label: 'Green' },
  { hex: '#F5A623', label: 'Orange' },
  { hex: '#A855F7', label: 'Purple' },
  { hex: '#FF8C42', label: 'Amber' },
  { hex: '#EC4899', label: 'Pink' },
  { hex: '#F5F5F5', label: 'White' },
];

export default function Profile() {
  const router = useRouter();
  const { user, loading, setUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FF4D4D');
  const [avatarUrl, setAvatarUrlState] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/');
    if (user) {
      setDisplayName(user.displayName);
      setSelectedColor(user.avatarColor ?? '#FF4D4D');
      setAvatarUrlState(getAvatarUrl(user.id));
    }
  }, [user, loading, router]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target?.result as string;
      saveAvatarUrl(user.id, url);
      setAvatarUrlState(url);
    };
    reader.readAsDataURL(file);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !displayName.trim()) return;
    const updated = updateProfile(user.id, { displayName: displayName.trim(), avatarColor: selectedColor });
    if (updated) {
      saveCurrentUser(updated);
      setUser(updated);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading || !user) return null;

  const initials = (displayName || user.displayName).split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{ minHeight: '100vh', background: '#111111' }}>
      <Nav user={{ ...user, displayName: displayName || user.displayName, avatarColor: selectedColor }} />
      <main style={{ maxWidth: 520, margin: '0 auto', padding: '80px 24px 48px' }}>

        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#888', textTransform: 'uppercase', marginBottom: 6, fontFamily: INTER }}>Profile</p>
          <h1 style={{ fontFamily: SORA, fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: '#F5F5F5' }}>Your Account</h1>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Profile picture */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#888', textTransform: 'uppercase', marginBottom: 14, fontFamily: INTER }}>
              Profile Picture
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {/* Preview */}
              <div style={{
                width: 80, height: 80, flexShrink: 0, overflow: 'hidden',
                background: avatarUrl ? 'transparent' : selectedColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Profile" style={{ width: 80, height: 80, objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 28, fontWeight: 800, color: selectedColor === '#F5F5F5' ? '#111' : '#F5F5F5', fontFamily: SORA }}>
                    {initials}
                  </span>
                )}
              </div>

              {/* Upload + remove */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button type="button" onClick={() => fileRef.current?.click()} style={{
                  background: 'transparent', border: '1px solid #2a2a2a', color: '#F5F5F5',
                  padding: '8px 20px', fontSize: 12, fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: INTER,
                }}>
                  Upload Photo
                </button>
                {avatarUrl && (
                  <button type="button" onClick={() => { if (!user) return; saveAvatarUrl(user.id, ''); setAvatarUrlState(null); }} style={{
                    background: 'transparent', border: '1px solid #2a2a2a', color: '#888',
                    padding: '6px 20px', fontSize: 11, fontFamily: INTER,
                  }}>
                    Remove
                  </button>
                )}
                <div style={{ fontSize: 11, color: '#555', fontFamily: INTER }}>JPG, PNG, GIF · Stored locally</div>
              </div>

              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
            </div>
          </div>

          {/* Avatar color (shown only when no photo) */}
          {!avatarUrl && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#888', textTransform: 'uppercase', marginBottom: 12, fontFamily: INTER }}>
                Avatar Color
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {AVATAR_COLORS.map(c => (
                  <button key={c.hex} type="button" onClick={() => setSelectedColor(c.hex)} title={c.label} style={{
                    width: 32, height: 32, background: c.hex,
                    border: selectedColor === c.hex ? '2px solid #F5F5F5' : '2px solid transparent',
                    outline: selectedColor === c.hex ? '1px solid #888' : 'none',
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Display name */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#888', textTransform: 'uppercase', marginBottom: 8, fontFamily: INTER }}>
              Display Name
            </label>
            <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" />
          </div>

          {/* Username (read-only) */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#888', textTransform: 'uppercase', marginBottom: 8, fontFamily: INTER }}>
              Username
            </label>
            <div style={{ padding: '12px 14px', background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#666', fontSize: 14, fontFamily: INTER }}>
              @{user.username}
            </div>
            <div style={{ fontSize: 11, color: '#555', marginTop: 6, fontFamily: INTER }}>Username cannot be changed.</div>
          </div>

          {/* Stats */}
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[{ label: 'Streak', value: `${user.streak}d` }, { label: 'XP', value: user.xp.toLocaleString() }, { label: 'Best Streak', value: `${user.longestStreak}d` }].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: SORA, fontSize: 20, fontWeight: 800, color: '#FF4D4D' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2, fontFamily: INTER }}>{s.label}</div>
              </div>
            ))}
          </div>

          <button type="submit" style={{
            background: saved ? '#1a2a1a' : '#FF4D4D',
            color: saved ? '#00C896' : '#F5F5F5',
            border: 'none', padding: '14px', fontSize: 13, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: INTER, transition: 'background 0.2s',
          }}>
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </form>
      </main>
    </div>
  );
}
