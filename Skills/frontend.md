
Persist:
- MobileNav
- TopBar
- Session context

---

## 3. Design System

### Brand Identity

- Tough
- Minimal
- Performance-first
- High contrast

---

### Color System

**Charcoal** `#111111`
- Primary background
- Primary text
- Default dark mode

**Ice Blue** `#4DA6FF`
- Accent
- Streaks
- Progress bars
- Action states

**Soft Grey** `#F5F5F5`
- Card surfaces
- Secondary backgrounds

---

### Typography

- **Sora** → Headers
- **Inter** → Body

Tone: Sharp. Confident. Direct.

---

### Layout & Grid

- 8px grid system
- Tight spacing
- Sharp edges
- No softness

---

### Elevation Rules

No soft shadows.

Use:
- 1px or 2px solid borders
- Charcoal or Soft Grey

---

### Dark Mode

Charcoal is default.

We do not support soft themes.

---

## 4. Component System

Components must feel native and durable.

---

### Core Layout Components

**AppShell**
- Session management
- Realtime context
- Layout wrapper

**MobileNav**
- Persistent bottom navigation
- Tabs:
  - Dashboard
  - Physical
  - Social
  - Leaderboard
  - Events

---

### Feature Components

**StreakCard**
- Dashboard centerpiece
- High visual dominance

**ProgressGraph**
- XP tracking
- Weekly trendlines

**PRVideoCard**
- Social feed media card
- Playback
- Engagement
- Performance metrics

---

### Composition Pattern

Use ShadCN primitives:
- Button
- Dialog
- Card
- Sheet

Wrap them in Pulse-specific theming.

Never raw ShadCN defaults.

---

## 5. State Management Strategy

Keep it simple.

---

### Server State

Managed via:
- Next.js RSC
- Supabase database

---

### Client State

- `useState` for local UI
- No heavy global stores

---

### Context Usage

Only for:
- Auth session
- Global Realtime connection

Avoid overuse.

---

### Realtime Sync

Supabase Realtime (WebSockets)

Sync:
- Streak updates
- Leaderboard rank
- Social feed inserts

---

### Optimistic UI

Mandatory for:
- Habit check-offs
- Feed likes
- PR submissions

App must feel native.

---

## 6. Realtime UX Handling

Realtime is a competitive advantage.

---

### Subscription Model

Use:

```ts
on('INSERT', 'leaderboard')