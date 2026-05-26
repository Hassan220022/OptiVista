# OptiVista Mobile

Customer mobile app built with Expo, React Native, Expo Router, Supabase, and Zustand.

## Structure

```txt
src/
├── app/         # Expo Router routes
├── components/  # reusable UI and feature components
├── constants/   # app constants
├── hooks/       # React hooks
├── lib/         # API and Supabase helpers
├── stores/      # Zustand stores
├── theme/       # theme tokens/provider
└── types/       # shared TypeScript types
```

## Setup

```bash
npm install
cp .env.example .env
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # web preview
```

## Environment

Use `.env.example` as the template. Real `.env` files stay local and must not be committed.

## Checks

```bash
npm run lint
```
