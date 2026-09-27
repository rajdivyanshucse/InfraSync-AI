# InfraSync AI — Production Hardening & Deployment Guide

## 1. System Architecture Overview

InfraSync AI is architected as an observable, hardened, multi-tier infrastructure project execution intelligence platform:

```
┌───────────────────────────────────────────────────────────────┐
│                      React 19 SPA (Vite)                      │
│   (Role Switcher, WBS Gantt, Spatial Site-View, Verification) │
└──────────────────────────────┬────────────────────────────────┘
                               │ HTTP / REST (X-User-Role / Auth)
                               ▼
┌───────────────────────────────────────────────────────────────┐
│                    Node.js / Express Backend                  │
│    (Security Headers, Request Tracing, Rate Limiter, RBAC,    │
│     Project Scoping, Audit Log, Health & Readiness Probes)    │
└──────────────┬───────────────────────────────┬────────────────┘
               │                               │ HTTP (Internal Bridge)
               ▼                               ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│ Persistence & Storage Layer  │ │  Python FastAPI AI Service   │
│  - MongoDB (Mongoose) / Mock │ │  - Deterministic Linker      │
│  - Local / Cloud Storage     │ │  - Delay/Risk Analyzer       │
│  - Compound Query Indexes    │ │  - Health & Readiness Probes │
└──────────────────────────────┘ └──────────────────────────────┘
```

---

## 2. Environment Configurations

### Development (`NODE_ENV=development`)
```ini
# Backend (backend/.env)
PORT=5000
NODE_ENV=development
DATA_SOURCE=mock
AI_MODE=demo
CORS_ORIGIN=http://localhost:5173
API_PREFIX=/api
STORAGE_PROVIDER=local
STORAGE_ROOT=./storage/uploads
AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_TIMEOUT_MS=10000

# AI Service (ai-service/.env)
PORT=8000
AI_MODE=demo
ENVIRONMENT=development

# Frontend (.env)
VITE_API_BASE_URL=http://localhost:5000
VITE_API_PREFIX=/api
```

### Staging (`NODE_ENV=staging`)
```ini
# Backend (backend/.env)
PORT=5000
NODE_ENV=staging
DATA_SOURCE=mongodb
MONGODB_URI=mongodb+srv://<staging-db-user>:<staging-db-password>@cluster0.mongodb.net/infra_sync_staging
MONGODB_DB_NAME=infra_sync_staging
CORS_ORIGIN=https://staging.infrasync.example.com
API_PREFIX=/api
STORAGE_PROVIDER=local
STORAGE_ROOT=/var/data/infrasync/uploads
AI_SERVICE_URL=http://ai-service:8000
AI_SERVICE_TIMEOUT_MS=10000

# AI Service (ai-service/.env)
PORT=8000
AI_MODE=delay_risk_analysis
ENVIRONMENT=staging

# Frontend (.env.staging)
VITE_API_BASE_URL=https://api-staging.infrasync.example.com
VITE_API_PREFIX=/api
```

### Production (`NODE_ENV=production`)
```ini
# Backend (backend/.env)
PORT=5000
NODE_ENV=production
DATA_SOURCE=mongodb
MONGODB_URI=mongodb+srv://<prod-db-user>:<prod-db-password>@cluster0.mongodb.net/infra_sync_prod
MONGODB_DB_NAME=infra_sync_prod
CORS_ORIGIN=https://infrasync.example.com
API_PREFIX=/api
STORAGE_PROVIDER=local
STORAGE_ROOT=/var/data/infrasync/uploads
AI_SERVICE_URL=http://ai-service:8000
AI_SERVICE_TIMEOUT_MS=10000

# AI Service (ai-service/.env)
PORT=8000
AI_MODE=delay_risk_analysis
ENVIRONMENT=production

# Frontend (.env.production)
VITE_API_BASE_URL=https://api.infrasync.example.com
VITE_API_PREFIX=/api
```

---

## 3. Health & Readiness Probes

### Backend Express Server
- **Liveness Probe**: `GET /health` or `GET /api/health`
  - Returns HTTP 200 `{ status: "ok", service: "infrasync-api", uptimeSeconds: ... }` when the process is alive.
- **Readiness Probe**: `GET /ready` or `GET /api/ready`
  - Validates MongoDB connection and storage configuration. Returns HTTP 200 when ready, or HTTP 503 if required database dependencies are unavailable.

### FastAPI AI Service
- **Liveness Probe**: `GET /health`
  - Returns HTTP 200 `{ status: "ok", service: "infrasync-ai-service" }`.
- **Readiness Probe**: `GET /ready`
  - Validates loaded analytical engines (`schedule_linker_engine`, `risk_analyzer_engine`, `cv_feature_extractor`) and runtime configuration.

---

## 4. Startup & Execution Commands

### Local Development
```bash
# 1. Start AI Microservice
cd ai-service
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000

# 2. Start Backend REST API
cd backend
npm install
npm start

# 3. Start Frontend UI
cd ..
npm install
npm run dev
```

### Docker Container Orchestration
```bash
# Build and start all services
docker-compose up --build -d

# Start with local MongoDB instance
docker-compose --profile with-db up --build -d

# Check service logs
docker-compose logs -f backend

# Stop all containers
docker-compose down
```

---

## 5. Validation & Automated Test Matrix

```bash
# Frontend Static Analysis & Production Build
npx oxlint .
npm run build

# Backend Test Suite (Smoke + Hardening: 46 tests)
cd backend && npm test && cd ..

# AI Service Test Suite (Pytest: 12 tests)
cd ai-service && python -m pytest tests && cd ..
```

---

## 6. Operational Rollback Procedure

In the event of a staging or production release failure:
1. **Identify Failing Component**: Inspect `GET /health` and `GET /ready` across backend and AI service.
2. **Revert Release Artifact**: Re-tag or redeploy previous known good Docker image / container commit.
3. **Verify Database Compatibility**: Verify MongoDB indexes and schema compatibility using `GET /api/ready`.
4. **Run Deployment Smoke Test**: Execute `npm test` against the staging/production backend.
5. **Restore Traffic**: Re-route load balancer / ingress traffic to the restored version.

---

## 7. Production vs. Prototype Boundary

| Component | Prototype / Demo Mode | Production Hardened Mode |
| :--- | :--- | :--- |
| **Authentication** | Role header switching (`x-user-role`) | JWT / OIDC token bearer authentication |
| **Data Persistence** | In-memory repository fallback | MongoDB Atlas cluster with compound indexes |
| **AI Schedule Linking** | Deterministic multi-signal heuristic engine | Deterministic + CV model feature inference |
| **Media Storage** | Local filesystem (`./storage/uploads`) | Enterprise object store (S3 / GCS) |
| **Logging & Tracing** | Structured console output with `X-Request-Id` | Centralized log aggregator (Datadog / CloudWatch) |
