---

### Public Read Access

Globally readable:
- Social posts
- Public profiles
- Leaderboards
- Public events

Authenticated SELECT allowed.

---

### Event Visibility

Users can view attendee lists only if:

- They are attending
- Event marked as global

---

### Future Privacy

`users.is_private BOOLEAN`

RLS policy:

- Restrict profile/posts to approved followers

---

## 4. Streak Calculation Logic

Streaks are the product core.

---

### Definition

Active if completion exists:

- Today
- OR yesterday  
  (Based on user timezone)

---

### Stored vs Computed

- `current_streak` stored for fast UI rendering
- Recomputed daily via Edge Function

Ensures auditability.

---

### Reset Logic

If no completion within 48 hours:

- Cron-triggered Edge Function resets `current_streak = 0`

---

### Buffer Window

Late-night buffer (e.g., until 3 AM).

Prevents unfair streak breaks.

---

## 5. Leaderboard Ranking Logic

Competitive gamification engine.

---

### Ranking Types

- Global XP
- Daily Streaks
- Category PRs

---

### SQL Logic

Use:

- `RANK()`
- `DENSE_RANK()`

---

### Performance Optimization

For 100k+ users:

- Materialized Views
- Refresh every 15 minutes

Reduces heavy window-function load.

---

## 6. Realtime Strategy

Supabase Realtime powers live engagement.

---

### Broadcast Events

Emit:

- New posts
- Likes
- Comments
- Streak changes

---

### Leaderboard Updates

Users see rank shifts instantly.

---

### Subscription Model

Clients subscribe to scoped channels:

- Event room_id
- Feed channels
- Leaderboard channels

Avoid global polling.

---

## 7. Storage Strategy

Media must be fast and scalable.

---

### PR Videos

- Public bucket
- 50MB file limit
- CDN served

---

### Signed URLs

Used for:

- Private assets
- Sensitive content

---

### Media Processing

Edge Functions:

- Extract metadata
- Trigger compression
- Validate file type

---

## 8. Edge Functions

Automation layer of Pulse.

---

### Required Functions

#### recalculate_streaks

- Daily cron job

#### award_xp

- Triggered on workout or post

#### push_notifications

- Event reminders
- Streak warnings

---

### Trigger Types

- HTTP requests
- Database webhooks
- Scheduled Cron jobs

---

## 9. Security Considerations

Data integrity first.

---

### Rate Limiting

Prevent:

- Spam posts
- Completion abuse

Handled via Supabase middleware.

---

### Data Validation

All server-side payloads validated using:

- Zod
- Joi

Prevents malformed input and injection.

---

### Account Verification

Email verification required before:

- Posting
- Joining leaderboards

---

### Secrets Management

Stored in:

- Supabase environment variables
- Vercel environment variables

Never hardcoded.

---

## 10. Scalability Plan

Designed for 0 → 100k+ users.

---

### Indexing

Aggressive indexing on:

- Feed-heavy columns
- Leaderboard metrics

---

### Partitioning (Future)

Partition `habit_completions` by month.

Prevents historical bloat from affecting live queries.

---

### Read Replication

Add read replicas if:

- Social feed volume spikes
- Leaderboard usage peaks

---

## 11. Monetization Architecture (Future Phase)

Stripe integration for premium features.

---

### Subscriptions Table

- id
- user_id
- stripe_customer_id
- status (active, canceled)
- tier_id

---

### Webhook Handling

Edge Function listens to:

- `customer.subscription.updated`

Toggles feature flags.

---

### Feature Gating

Verified via:

- Next.js middleware
- RLS policies

Restricts premium data access.

---

# End of Document
