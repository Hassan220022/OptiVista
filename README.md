# OptiVista

OptiVista is an eyewear commerce platform with customer mobile shopping, admin operations, seller tooling, a FastAPI service layer, and Supabase-backed auth/data/storage. The active project is this repository root; there is no wrapper project folder.

## Repository Structure

```txt
OptiVista/
├── apps/
│   ├── backend/   # FastAPI backend API, services, auth, integrations, Docker dev config
│   ├── admin/     # React 19 + Vite 7 admin dashboard
│   ├── seller/    # React 19 + Vite 7 seller dashboard
│   └── mobile/    # Expo SDK 56 / React Native mobile app
├── supabase/
│   ├── migrations/
│   │   ├── 0001_init.sql
│   │   └── 0002_seed_data.sql
│   ├── config/    # Supabase environment examples
│   └── storage/   # Storage bucket notes
├── docs/          # Architecture, UI, API, handbook, decision records, paper
├── LICENSE
└── README.md
```

Legacy Flutter code, old Node backend code, old React frontend code, MySQL dumps, and generated artifacts are not part of the active source tree.

## Tech Stack

| Area | Stack |
| --- | --- |
| Backend | FastAPI, Uvicorn, Pydantic, Pydantic Settings, Supabase Python client, python-jose, httpx, pytest |
| Admin app | React 19, Vite 7, TypeScript, Tailwind CSS 4, Supabase, TanStack React Query |
| Seller app | React 19, Vite 7, TypeScript, Tailwind CSS 4, Supabase, TanStack React Query |
| Mobile app | Expo SDK 56, React Native, Expo Router, Zustand, Supabase |
| Data platform | Supabase PostgreSQL, Auth, Storage, migrations, RLS policies |

## Local Setup

### Prerequisites

- Node.js and npm for `apps/admin`, `apps/seller`, and `apps/mobile`
- Python 3.11+ recommended for `apps/backend`
- Supabase project credentials for local `.env` files
- Expo tooling/device simulator if running native mobile targets

### Backend

```bash
cd apps/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

### Admin Dashboard

```bash
cd apps/admin
npm install
cp .env.example .env
npm run dev
```

### Seller Dashboard

```bash
cd apps/seller
npm install
cp .env.example .env
npm run dev
```

### Mobile App

```bash
cd apps/mobile
npm install
cp .env.example .env
npm run ios      # or: npm run android / npm run web
```

### Database

Apply the Supabase migrations in order:

1. `supabase/migrations/0001_init.sql`
2. `supabase/migrations/0002_seed_data.sql`

Use the Supabase CLI, dashboard SQL editor, or your deployment workflow.

## Environment Rules

- Each app owns its own `.env.example`; copy it to `.env` inside that app before running locally.
- Do not share one `.env` across apps unless values are intentionally identical.
- Backend secrets belong only in `apps/backend/.env`.
- Browser/mobile apps must only use public Supabase values and other client-safe configuration.
- Keep real keys, tokens, service-role credentials, and local `.env` files out of git.

## Useful Commands

| Command | Directory | Purpose |
| --- | --- | --- |
| `uvicorn app.main:app --reload` | `apps/backend` | Start backend dev server |
| `pytest` | `apps/backend` | Run backend tests |
| `npm run dev` | `apps/admin` | Start admin dev server |
| `npm run build` | `apps/admin` | Build admin app |
| `npm run lint` | `apps/admin` | Lint admin app |
| `npm run dev` | `apps/seller` | Start seller dev server |
| `npm run build` | `apps/seller` | Build seller app |
| `npm run lint` | `apps/seller` | Lint seller app |
| `npm run start` | `apps/mobile` | Start Expo dev server |
| `npm run ios` | `apps/mobile` | Start Expo on iOS |
| `npm run android` | `apps/mobile` | Start Expo on Android |
| `npm run web` | `apps/mobile` | Start Expo web target |
| `npm run lint` | `apps/mobile` | Lint mobile app |

## Documentation

- `docs/architecture.md` — system architecture overview
- `docs/UI_ARCHITECTURE.md` — UI structure across mobile, admin, and seller apps
- `docs/HANDBOOK.md` — contributor and project handbook
- `docs/api_guide.md` — API usage guide
- `docs/decision_records.md` — architectural and product decision records
- `docs/project_discription.md` — project description document
- `docs/Optivista_mobile_paper.pdf` — mobile project paper
- `supabase/storage/buckets.md` — storage bucket intent

## Security and Hygiene

- Never commit `.env`, service-role keys, API tokens, local credentials, or generated secrets.
- Keep `.env.example` files placeholder-only.
- Treat Supabase RLS and backend authorization as required layers, not optional checks.
- Keep generated files out of source control: `node_modules/`, `dist/`, `.expo/`, `__pycache__/`, `.pyc`, coverage output, and OS metadata.
- Do not reintroduce removed legacy source trees or database dumps into active source.
- Review migration changes carefully before applying them to shared Supabase projects.

## Contributors

- Hassan Mikawi
- Yehia Hatem
- Mostafa Othman
