# Product Requirements Document: Pulse

**Participants:** Founding Team, Seed Investors, Product Team  
**Status:** Planning / Execution Ready  
**Tech Stack:** Next.js (App Router), Vercel, Supabase (Postgres, Auth, Realtime), Tailwind + ShadCN, Stripe  

---

## 1. Executive Summary

Pulse is a performance-driven social operating system for real life.

It is not just another wellness tracker; it is a platform where discipline becomes social. By combining habit tracking, performance logging, social sharing, and real-world community activation, Pulse turns daily consistency into a high-stakes competitive sport.

Its brand is tough, clean, and confident — intentionally moving away from “soft wellness” toward a high-agency performance culture.

---

## 2. Problem Statement

Existing wellness and habit apps suffer from several behavioral gaps:

### Aesthetic Mismatch
Most trackers use a “soft wellness” aesthetic that fails to motivate performance-oriented users.

### Isolation Gap
Habit tracking is often a lonely experience, leading to loss of motivation once novelty wears off.

### Fragmentation
Users must jump between:
- Strava (fitness)
- Headspace (mental health)
- Substack / BeReal (social)

### Accountability Deficit
Without public proof-of-work (PR videos, streak visibility), it is easy to abandon discipline.

---

## 3. Target User Persona

### The High-Agency Striver (22–35)
- Motivated by growth and competition  
- Finds standard habit trackers too soft  
- Wants public accountability  

### The Performance Athlete
- Focused on measurable gains  
- Logs physical + mental PRs  
- Builds a public reputation of excellence  

---

## 4. Core Value Proposition

**Pulse makes discipline visible and progress social.**

### Visible Proof
Encourages video proof for PRs and physical splits.

### Public Accountability
Streaks are public and leaderboard-driven.

### Integrated Lifestyle
Merges workouts, mental health habits, and meetups into a single operating system.

---

## 5. Competitive Landscape

### Direct Competitors
- Strava (too fitness-focused)
- Duolingo (language-only streak focus)

### Indirect Competitors
- BeReal (social updates)
- Substack (reflection)
- Headspace (wellness)

### Strategic Positioning
Strava × Duolingo × BeReal × Substack

Pulse occupies the **tough performance quadrant** that these apps leave empty.

---

## 6. Feature Breakdown by Tab

| Tab | Purpose | Key Features | MVP vs Future |
|------|---------|--------------|---------------|
| Dashboard | Daily Control Center | Bold Daily Streak display, XP progress, "Plan for Today" checklist | MVP: Basic streak/XP engine<br>Future: AI progress coach |
| Physical + Health | Performance Logging | Workout logging, PR tracking with video proof, recipes with macro info, meditation streaks | MVP: Workout/PR logs<br>Future: Recipe discovery + ratings |
| Social | Social Network | Feed for splits, PR videos, reflections. Daily check-ins | MVP: Post / Like / Comment<br>Future: Public streak visibility levels |
| Leaderboard | Competitive Energy | Rankings for Top Streaks, PR Goals, Weekly XP | MVP: Global + Friends filters<br>Future: Local category rankings |
| Events | Real-World Community | Meetups, group workouts, fitness challenges | MVP: N/A (Phase 3)<br>Future: Brand partnerships |

---

## 7. User Flows

### Onboarding
1. Sign up (email/password or magic link)  
2. Select performance goals  
3. Set daily habits  
4. Follow friends  

### Creating a Streak
1. Define habit  
2. Complete task  
3. Mark done  
4. Streak increments (animated)

### Logging a Workout
1. Navigate to Physical tab  
2. Enter metrics  
3. Attach proof video  
4. PR recorded  

### Posting a PR
1. Toggle “Share to Social”  
2. Appears in feed  
3. Friends engage  

### Viewing Leaderboard
1. Enter Leaderboard  
2. Filter by Friends  
3. Compare XP + streak  

### Joining Event
1. Discover event  
2. Click Join  
3. Add to calendar  
4. Check in on-site  

---

## 8. Data Model Overview

### User
- ID
- Auth
- XP Total
- Badges
- Performance Metrics

### Habit
- ID
- UserID
- Name
- Frequency
- Current Streak
- Max Streak

### PerformanceLog
- UserID
- Type (Workout / PR)
- Metrics (Weight, Reps, Time)
- VideoURL (Supabase Storage)

### Post
- UserID
- Content (Text/Video/Image)
- Linked PerformanceLog

### LeaderboardEntry
- UserID
- Category
- Rank
- XP Period

### Event
- Name
- Location
- Time
- Attendees

---

## 9. KPIs & Success Metrics

### Activation
% completing first "Plan for Today"

### Retention
Day 30 / Day 90 streak retention

### Engagement
- DAU
- XP per session
- Interactions per post

### Social Growth
Shared PR videos + workout splits

### Revenue
Pro tier conversion rate

---

## 10. Monetization Plan (Phase 3)

### Free Tier
- Habit tracking  
- Social feed  
- Standard leaderboards  

### Pulse Pro
- Advanced analytics  
- AI habit suggestions  
- Exclusive events  
- Ad-free  

### Upgrade Incentive
Access to brand partnerships + Discipline Challenges.

---

## 11. Risks & Assumptions

### Technical
Realtime leaderboard at 100k+ users.

### Behavioral
Users consistently upload proof videos.

### Market
Must maintain tough brand identity.

---

## 12. Phased Roadmap

### Phase 1 (MVP)
- Habit streak engine  
- Workout logging  
- Friend leaderboards  

### Phase 2 (Social Expansion)
- Feed  
- PR video sharing  
- Recipe sharing  

### Phase 3 (Events + Monetization)
- Community features  
- Brand partnerships  
- Stripe integration  