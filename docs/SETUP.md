# BotLab local setup

## 1. Install

```bash
npm install
```

## 2. Supabase

Create a Supabase project and apply `supabase/migrations/001_initial_schema.sql` using the Supabase SQL editor or migration tooling.

Create `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Only the anonymous/public key belongs in the browser. Never expose a Supabase service-role key in Vite environment variables.

## 3. Run

```bash
npm run dev
```

## Current backend modules

- `src/lib/supabase.ts` — browser Supabase client
- `src/lib/botlab/auth.ts` — authentication operations
- `src/lib/botlab/workspaces.ts` — workspace onboarding/listing
- `src/lib/botlab/bots.ts` — bot CRUD

The current repository still contains the public marketing landing page. Product dashboard routes should be added behind authentication rather than replacing the public homepage.
