# OptiVista Architecture

## Overview

OptiVista is a monorepo with four active applications backed by Supabase.

```txt
Customer Mobile App (Expo)
        │
        ├── Supabase Auth / Storage / Realtime
        │
        └── FastAPI Backend ── Supabase PostgreSQL

Admin Dashboard (React/Vite) ── Supabase + FastAPI
Seller Dashboard (React/Vite) ─ Supabase + FastAPI
```

## Active Components

### `apps/mobile`

Expo Router app for customers. Handles product discovery, AR try-on entry points, cart, checkout, order history, profile, settings, and feedback.

### `apps/admin`

React/Vite dashboard for platform operations: products, orders, reviews, feedback, users, sellers, and settings.

### `apps/seller`

React/Vite dashboard for seller operations: products, orders, reviews, analytics, payouts, and settings.

### `apps/backend`

FastAPI backend. Provides API orchestration, validation, service boundaries, JWT verification, payment integration hooks, storage URL generation, and backend-only privileged Supabase operations.

### `supabase`

Supabase owns auth, PostgreSQL tables, RLS policies, storage buckets, and seed data. Fresh environments should start from `migrations/0001_init.sql` and `migrations/0002_seed_data.sql`.

## Security Model

- Public catalog data can be read anonymously where intended.
- User-owned records are protected by RLS.
- Admin/seller capabilities are role-gated.
- Backend-only operations use service-role credentials and must never be exposed to clients.
- `.env` files stay local and ignored.

## Removed Legacy Architecture

The old root Flutter app, old Node backend, old React frontend, and MySQL SQL dumps are no longer part of the active architecture.
