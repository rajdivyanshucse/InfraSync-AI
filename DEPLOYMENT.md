# InfraSync AI — Deployment & Integration Guide (Phase 25)

## 1. System Architecture Overview

InfraSync AI is designed as a modular, enterprise-ready infrastructure monitoring prototype consisting of three primary layers:

```
┌───────────────────────────────────────────────────────────────┐
│                      React 18 SPA (Vite)                      │
│   (Role Switcher, WBS Gantt, Spatial Site-View, Verification) │
└──────────────────────────────┬────────────────────────────────┘
                               │ HTTP / REST (JWT / Demo Headers)
                               ▼
┌───────────────────────────────────────────────────────────────┐
│                    Node.js / Express.js                       │
│    (Security Headers, Rate Limiter, Input Sanitizer, RBAC,    │
│     Tenancy Enforcement, Append-Only System Audit Log)        │
└──────────────┬───────────────────────────────┬────────────────┘
               │                               │ HTTP (Internal Bridge)
               ▼                               ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│ Persistence & Storage Layer  │ │  Python FastAPI Microservice │
│  - MongoDB (Mongoose) / Mock │ │  - Deterministic Linker      │
│  - Local Storage (SHA-256)   │ │  - Delay/Risk Analyzer       │
└──────────────────────────────┘ └──────────────────────────────┘
```

---

## 2. Environment Configurations

### Backend Configuration (`backend/.env`)

```ini
PORT=5000
NODE_ENV=development
API_PREFIX=/api
CORS_ORIGIN=http://localhost:5173

# Persistence Mode: 'mock' (default in-memory store) or 'mongodb'
DATA_SOURCE=mock
MONGO_URI=mongodb://localhost:27017/infrasync

# File Storage Root Directory
STORAGE_ROOT=./storage/uploads

# Python AI Service Proxy Configuration
AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_TIMEOUT_MS=10000

# Security & Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=120
```

### Python AI Service Configuration (`ai-service/.env`)

```ini
PORT=8000
AI_MODE=demo
ENVIRONMENT=development
```

### Frontend Configuration (`.env`)

```ini
VITE_API_BASE_URL=http://localhost:5000
VITE_API_PREFIX=/api
```

---

## 3. Local Startup Procedures

### Prerequisites
- Node.js >= 18.x
- Python >= 3.10
- npm >= 9.x

### Step 1: Start Python AI Microservice
```bash
cd ai-service
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000
```

### Step 2: Start Express.js Backend API
```bash
cd backend
npm install
npm start
```

### Step 3: Start React Frontend
```bash
# In workspace root
npm install
npm run dev
```

The application will be accessible at:
- **Frontend SPA**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`
- **AI Health Status**: `http://localhost:5000/api/ai/health`
- **Python Service**: `http://localhost:8000/health`

---

## 4. Docker Deployment (Optional)

InfraSync AI includes ready-to-run container configurations for seamless local and server orchestration:

```bash
# Start AI service and Backend in mock mode
docker-compose up --build -d

# Start with optional MongoDB database
docker-compose --profile with-db up --build -d

# Stop all containers
docker-compose down
```

---

## 5. Automated Validation & Test Commands

To execute all test suites:

```bash
# 1. End-to-End System Integration Suite (21 tests)
node backend/test/e2e-integration.test.js

# 2. Security & Hardening Suite (14 tests)
node backend/test/security.test.js

# 3. Human Verification & Audit Workflow Suite (13 tests)
node backend/test/verification.test.js

# 4. AI Microservice Proxy Suite (12 tests)
node backend/test/ai-proxy.test.js

# 5. Storage Unit Tests (9 tests)
node backend/test/storage.test.js

# 6. Upload End-to-End Tests (7 tests)
node backend/test/upload-endpoint.test.js

# 7. Backend REST API Smoke Tests (19 tests)
node backend/test/api.test.js

# 8. Python FastAPI Pytest Suite (6 tests)
cd ai-service && python -m pytest && cd ..

# 9. Static Analysis / Linter
npx oxlint

# 10. Frontend Production Build
npm run build
```

---

## 6. Deployment Readiness & Production Roadmap

```
================================================================================
VERIFIED READY FOR DEPLOYMENT (Prototype Boundary)
================================================================================
✔ Node REST API & FastAPI AI Service orchestration with health monitoring
✔ Dual-mode data persistence (MongoDB & zero-dependency Mock store)
✔ Role-Based Access Control (RBAC) and Project Tenancy authorization
✔ Strict input validation, MongoDB query operator injection & prototype pollution defense
✔ Local filesystem storage provider with SHA-256 checksums and path traversal rejection
✔ Append-only human verification and system security audit ledgers
✔ Multi-stage Dockerfiles and docker-compose infrastructure

================================================================================
PRODUCTION REQUIREMENTS STILL PENDING (Post-Prototype Enterprise Integration)
================================================================================
⚠ Enterprise Single Sign-On (SSO / OAuth2 / OIDC / Azure Entra ID / Okta)
⚠ HTTPS / TLS Certificate Termination (via Cloudflare / NGINX / AWS ALB)
⚠ Distributed Rate Limiting & Session Store (Redis Cluster)
⚠ Cloud Object Storage Provider (AWS S3 / Google Cloud Storage with Pre-Signed URLs)
⚠ Enterprise Secrets Management (AWS Secrets Manager / HashiCorp Vault)
⚠ CI/CD Pipeline Deployment (GitHub Actions / GitLab CI)
================================================================================
```
