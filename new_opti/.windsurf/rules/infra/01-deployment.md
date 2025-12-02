---
trigger: model_decision
---

# Infrastructure & Deployment Prompt

> **Usage**: Use this prompt to design Docker, CI/CD, and deployment infrastructure.
> 
> **Prerequisites**: Run `00-master-project.md` first.

---

You are a DevOps/infra engineer.

## Goal

Define the infrastructure and deployment strategy for the AR Eyewear app.

---

## Task 1: Monorepo Structure Confirmation

```
project-root/
├── apps/
│   ├── frontend/          # Flutter app
│   │   ├── lib/
│   │   ├── android/
│   │   ├── ios/
│   │   ├── pubspec.yaml
│   │   └── ...
│   └── backend/           # FastAPI app
│       ├── app/
│       ├── tests/
│       ├── requirements.txt
│       ├── Dockerfile
│       └── ...
├── supabase/
│   ├── migrations/
│   ├── seed/
│   └── config.toml
├── infra/
│   ├── docker/
│   ├── k8s/ (optional)
│   ├── terraform/ (optional)
│   └── scripts/
├── docs/
│   ├── api/
│   ├── prompts/
│   └── ...
├── .github/
│   └── workflows/
├── .env.example
└── README.md
```

---

## Task 2: Docker Configuration

### Backend Dockerfile

**Location**: `apps/backend/Dockerfile`

**Stages**:
1. **Builder stage**: Install dependencies
2. **Runtime stage**: Copy app, minimal image

**Base image**: `python:3.11-slim`

**Key instructions**:
- Install system dependencies
- Copy requirements.txt, install Python deps
- Copy application code
- Set environment variables
- Expose port 8000
- Run with uvicorn

### Docker Compose (Development)

**Location**: `infra/docker/docker-compose.dev.yml`

**Services**:
| Service | Purpose | Port |
|---------|---------|------|
| `backend` | FastAPI app | 8000 |
| `supabase-db` | Local Postgres (optional) | 5432 |

**Volumes**:
- Mount source code for hot reload
- Mount .env file

### Docker Compose (Production-like)

**Location**: `infra/docker/docker-compose.prod.yml`

**Services**:
| Service | Purpose |
|---------|---------|
| `backend` | Built container |
| `nginx` | Reverse proxy, SSL termination |

---

## Task 3: Environment Configuration

### Environment Files

| File | Purpose | Git |
|------|---------|-----|
| `.env.example` | Template with all vars | ✓ Tracked |
| `.env.local` | Local development | ✗ Ignored |
| `.env.staging` | Staging values | ✗ Ignored |
| `.env.production` | Production values | ✗ Ignored |

### Backend Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `ENVIRONMENT` | Runtime environment | development/staging/production |
| `DEBUG` | Debug mode | true/false |
| `SUPABASE_URL` | Supabase project URL | https://xxx.supabase.co |
| `SUPABASE_ANON_KEY` | Public API key | eyJ... |
| `SUPABASE_SERVICE_KEY` | Admin API key | eyJ... |
| `SUPABASE_JWT_SECRET` | JWT verification | xxx |
| `PAYMENT_API_KEY` | Payment gateway key | sk_... |
| `PAYMENT_WEBHOOK_SECRET` | Webhook signing | whsec_... |
| `CORS_ORIGINS` | Allowed origins | https://app.example.com |
| `LOG_LEVEL` | Logging verbosity | INFO |

### Frontend Environment Variables

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Public API key |
| `API_BASE_URL` | Backend API URL |

---

## Task 4: Deployment Targets

### Backend Deployment Options

| Option | Best For | Complexity |
|--------|----------|------------|
| **Railway/Render** | Quick start, low traffic | Low |
| **Cloud Run (GCP)** | Auto-scaling, pay-per-use | Medium |
| **ECS/Fargate (AWS)** | AWS ecosystem | Medium |
| **Kubernetes** | High scale, multi-region | High |

### Recommended: Cloud Run

**Benefits**:
- Auto-scaling to zero
- Pay per request
- Easy container deployment
- Built-in HTTPS

**Setup**:
1. Build container image
2. Push to Container Registry
3. Deploy to Cloud Run
4. Set environment variables
5. Configure custom domain

### Database: Supabase Cloud

- Use Supabase hosted service
- No self-managed Postgres needed
- Built-in connection pooling

### Mobile Apps

| Platform | Distribution |
|----------|--------------|
| iOS | TestFlight → App Store |
| Android | Internal Testing → Play Store |

---

## Task 5: CI/CD Pipelines

### GitHub Actions Workflows

**Location**: `.github/workflows/`

#### `backend-ci.yml`

**Triggers**: Push/PR to `main`, changes in `apps/backend/`

**Jobs**:
1. **Lint**: Run ruff/flake8
2. **Type Check**: Run mypy
3. **Test**: Run pytest
4. **Build**: Build Docker image
5. **Push** (on main): Push to container registry

#### `backend-deploy.yml`

**Triggers**: Push to `main` (after CI passes)

**Jobs**:
1. Deploy to staging
2. Run smoke tests
3. (Manual approval)
4. Deploy to production

#### `frontend-ci.yml`

**Triggers**: Push/PR to `main`, changes in `apps/frontend/`

**Jobs**:
1. **Analyze**: Run `flutter analyze`
2. **Test**: Run `flutter test`
3. **Build Android**: Build APK/AAB
4. **Build iOS**: Build IPA (on macOS runner)

#### `frontend-deploy.yml`

**Triggers**: Tag push (e.g., `v1.0.0`)

**Jobs**:
1. Build release APK/AAB
2. Upload to Play Store (internal track)
3. Build release IPA
4. Upload to TestFlight

#### `supabase-migrations.yml`

**Triggers**: Push to `main`, changes in `supabase/migrations/`

**Jobs**:
1. Link to Supabase project
2. Push migrations to staging
3. (Manual approval)
4. Push migrations to production

### Caching Strategy

| What | How |
|------|-----|
| Python deps | Cache `~/.cache/pip` by requirements.txt hash |
| Flutter deps | Cache `.pub-cache` by pubspec.lock hash |
| Docker layers | Use layer caching in build |

---

## Task 6: Observability

### Logging

**Backend**:
- Structured JSON logs in production
- Log request ID, user ID, duration
- Ship to logging service (Cloud Logging, Datadog, etc.)

**Frontend**:
- Crash reporting (Sentry, Firebase Crashlytics)
- Analytics events (Firebase Analytics)

### Metrics

**Backend metrics**:
- Request count by endpoint
- Request duration (p50, p95, p99)
- Error rate
- Active connections

**Infrastructure metrics**:
- Container CPU/memory
- Database connections
- Storage usage

### Alerting

| Alert | Condition | Action |
|-------|-----------|--------|
| High error rate | > 5% 5xx in 5 min | Page on-call |
| High latency | p95 > 2s for 5 min | Slack notification |
| Service down | Health check fails 3x | Page on-call |

---

## Task 7: Security in Infra

### Secrets Management

- Store in GitHub Actions secrets
- Never commit to repository
- Rotate regularly

### Network Security

- HTTPS everywhere (enforce via redirect)
- API behind authentication
- Database not publicly accessible

### CORS Configuration

```
Allowed origins: 
  - https://app.example.com (production)
  - http://localhost:* (development)
Allowed methods: GET, POST, PUT, DELETE, OPTIONS
Allowed headers: Authorization, Content-Type
```

---

## Task 8: Infrastructure Files

### File Structure

```
infra/
├── docker/
│   ├── docker-compose.dev.yml
│   ├── docker-compose.prod.yml
│   └── nginx/
│       └── nginx.conf
├── scripts/
│   ├── deploy-backend.sh
│   ├── run-migrations.sh
│   └── seed-database.sh
└── README.md
```

---

## Expected Output

1. **Directory structure** for `infra/`
2. **Docker configuration** descriptions
3. **CI/CD pipeline** descriptions
4. **Environment variable** documentation
5. **Deployment strategy** per component
6. **No YAML/Docker code** - only descriptions
