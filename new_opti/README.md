# OptiVista Monorepo

This directory is the active OptiVista codebase.

## Structure

```txt
new_opti/
├── apps/
│   ├── backend/   # FastAPI backend
│   ├── admin/     # React/Vite admin dashboard
│   ├── seller/    # React/Vite seller dashboard
│   └── mobile/    # Expo Router mobile app
├── supabase/      # PostgreSQL schema, migrations, RLS policies, storage docs
├── docs/          # architecture, handbook, API/UI notes
└── infra/         # deployment/infrastructure files when needed
```

## Active Apps

- `apps/mobile` — customer mobile app built with Expo + React Native.
- `apps/admin` — internal admin dashboard built with React/Vite.
- `apps/seller` — seller portal built with React/Vite.
- `apps/backend` — FastAPI backend for API orchestration and service integrations.

## Supabase

Supabase is the source of truth for:

- authentication
- PostgreSQL data
- row-level security policies
- storage buckets
- realtime tables where explicitly enabled

Current migrations start with:

- `supabase/migrations/0001_init.sql`
- `supabase/migrations/0002_seed_data.sql`

Older incremental migrations are kept only if they are still needed for migration history. Prefer the consolidated schema for fresh environments.

## Local Setup

Copy each app's `.env.example` to `.env` locally and fill real values. Never commit `.env` files.

```bash
cd apps/backend && pip install -r requirements.txt
cd ../admin && npm install
cd ../seller && npm install
cd ../mobile && npm install
```

## Generated Files

Do not commit:

- `node_modules/`
- `dist/`
- `.expo/`
- `__pycache__/`
- `*.pyc`
- `.DS_Store`
- `.env` / `.env.*` except `.env.example`
