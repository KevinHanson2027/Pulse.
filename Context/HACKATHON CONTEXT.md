HACKATHON CONTEXT — READ BEFORE GENERATING CODE

We are currently building Pulse inside a hackathon virtual machine environment.

This environment likely has the following constraints:

We may NOT be able to connect to:

Supabase

Vercel

External OAuth providers

Stripe

We may NOT be able to deploy publicly.

GitHub integration may not be available.

Outbound internet connections may be restricted or unstable.

Because of this:

We are NOT building production infrastructure right now.

We are building a fully functional frontend simulation of Pulse that demonstrates the product experience.

This means:

No real backend.

No real database.

No real authentication provider.

No external API dependencies.

Instead, we need a mock architecture that:

Simulates authentication

Simulates user accounts

Simulates streak tracking

Simulates XP and leaderboard updates

Simulates social posts

Uses local state and/or localStorage

Feels production-ready

The goal is to demonstrate:

UX quality

Product clarity

Competitive positioning

Realtime-feeling interactions

Strong brand identity

NOT infrastructure complexity.

TECH REQUIREMENTS FOR THIS BUILD

You must:

Build everything using local state and mock data.

Create a mock data layer (e.g., /lib/mockDB.ts).

Create a mock auth system (e.g., /lib/mockAuth.ts).

Store data in:

React state

localStorage

Avoid:

Supabase

Stripe

WebSockets

Server Actions

API routes requiring external calls

Ensure everything runs locally inside the VM with no external services.

PRODUCT GOAL

We are building a working demo of:

Pulse — The performance-driven social operating system.

Key demo flows we must support:

Sign up / Login (simulated)

Create a habit

Complete a habit

Streak increments visually

XP increases

Leaderboard updates

Post a PR

View social feed

See rank changes

It must feel real.

But it does NOT need real backend services.

IMPORTANT

This is a hackathon demo build.

We care about:

Clean UI

Strong brand alignment

Smooth animations

Clear competitive positioning

We do NOT care about:

Production auth

Real databases

External integrations

Everything should be modular so that in production we can swap the mock layer for Supabase.

ARCHITECTURE REQUIREMENT

Structure the project like this:

/app
/components
/lib
mockAuth.ts
mockDB.ts
/hooks

All backend-like behavior should be abstracted into the mock layer so it can later be replaced with Supabase.

FINAL INSTRUCTION

Do NOT attempt to connect to any external services.

Build a self-contained frontend-only Pulse demo that simulates:

Accounts

Streaks

XP

Leaderboards

Social posting

The demo must run completely offline inside a restricted VM.
