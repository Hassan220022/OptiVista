# OptiVista

OptiVista is an AR eyewear commerce platform. The active codebase lives in `new_optivista/` and uses Expo for the customer mobile app, React/Vite for admin and seller dashboards, FastAPI for backend services, and Supabase for auth, database, storage, and realtime features.

## Current Source of Truth

```txt
new_optivista/
├── apps/
│   ├── backend/   # FastAPI API and service layer
│   ├── admin/     # React/Vite admin dashboard
│   ├── seller/    # React/Vite seller dashboard
│   └── mobile/    # Expo Router mobile app
├── supabase/      # schema, migrations, policies, storage docs
├── docs/          # architecture and project docs
└── infra/         # deployment/infrastructure notes or configs
```

Legacy Flutter, old Node backend, old React frontend, MySQL dumps, and generated build artifacts have been removed from the active project structure.

## Tech Stack

| Area | Technology |
| --- | --- |
| Mobile | Expo, React Native, Expo Router, Zustand |
| Admin dashboard | React, Vite, TypeScript, Tailwind CSS |
| Seller dashboard | React, Vite, TypeScript, Tailwind CSS |
| Backend | FastAPI, Pydantic, Supabase client |
| Data/Auth/Storage | Supabase PostgreSQL, Auth, Storage, RLS |

## Apps

### Backend

```bash
cd new_optivista/apps/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

### Admin Dashboard

```bash
cd new_optivista/apps/admin
npm install
cp .env.example .env
npm run dev
```

### Seller Dashboard

```bash
cd new_optivista/apps/seller
npm install
cp .env.example .env
npm run dev
```

### Mobile App

```bash
cd new_optivista/apps/mobile
npm install
cp .env.example .env
npm run ios     # or npm run android / npm run web
```

## Security Rules

- Never commit `.env` or secret-bearing local config files.
- Use `.env.example` files for placeholders only.
- Supabase access is protected with RLS policies in `new_optivista/supabase/`.
- MCP configs and token-bearing automation files are ignored.
- Generated files such as `node_modules/`, `dist/`, `.expo/`, `__pycache__/`, `.pyc`, and `.DS_Store` are ignored.

## Documentation

- `new_optivista/docs/architecture.md` — current system architecture
- `new_optivista/docs/UI_ARCHITECTURE.md` — current mobile/admin/seller UI map
- `new_optivista/docs/HANDBOOK.md` — repo guide
- `new_optivista/supabase/storage/buckets.md` — storage bucket intent

## Authors

- Hassan Mikawi
- Yehia Hatem
- Mostafa Othman
