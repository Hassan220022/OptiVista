# OptiVista Project Description

OptiVista is an AR-enhanced eyewear commerce platform. The current implementation uses Expo for the customer mobile app, React/Vite for admin and seller dashboards, FastAPI for backend orchestration, and Supabase for authentication, PostgreSQL data, storage, realtime support, and row-level security.

## Current Architecture

```txt
Customer Mobile App (Expo)
        │
        ├── Supabase Auth / PostgreSQL / Storage
        │
        └── FastAPI Backend

Admin Dashboard (React/Vite) ── Supabase + FastAPI
Seller Dashboard (React/Vite) ─ Supabase + FastAPI
```

## Active Source Tree

```txt
new_optivista/
├── apps/
│   ├── backend/
│   ├── admin/
│   ├── seller/
│   └── mobile/
├── supabase/
└── docs/
```

## Removed Legacy Stack

The previous Flutter app, old Node backend, old React frontend, and MySQL dump files are no longer part of the active project. They were replaced by the Expo/FastAPI/Supabase monorepo under `new_optivista/`.
