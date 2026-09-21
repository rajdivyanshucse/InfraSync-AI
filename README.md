# InfraSync AI — Intelligent Infrastructure Construction Monitoring Platform

InfraSync AI is an enterprise-grade construction intelligence platform connecting planned schedules (Primavera P6 / WBS), ground execution quantities, multimodal field evidence, deterministic AI-assisted schedule-linking & delay/risk analysis, and authoritative human verification workflows into a unified, auditable operational system.

---

## 🏗️ System Architecture

```
React 18 SPA (Vite)
      ↓ HTTP / REST (JWT / Prototype Role Headers)
Express.js REST API Boundary
      ↓ (Rate Limiter / Security Headers / Input Sanitizer / RBAC / Tenancy Guard)
Domain Controllers & Services
      ↓
Repository & Persistence Layer (MongoDB / Zero-Dependency Mock Store)
      ↓
File Storage Provider (Local Storage / SHA-256 Checksums / Traversal Guard)

AI Microservice Boundary:
Node.js AI Client → Python FastAPI Deterministic AI Engines (Schedule Linker & Risk Analyzer)
```

---

## 🚀 Quick Start

### 1. Start Python AI Microservice
```bash
cd ai-service
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000
```

### 2. Start Express.js Backend API
```bash
cd backend
npm install
npm start
```

### 3. Start React Frontend
```bash
npm install
npm run dev
```

The application will be live at:
- **Frontend SPA**: `http://localhost:5173`
- **REST API**: `http://localhost:5000/api`
- **AI Health Status**: `http://localhost:5000/api/ai/health`
- **Python Service**: `http://localhost:8000/health`

---

## 🐳 Docker Deployment

Run the complete multi-service stack with a single command:

```bash
# Start AI service & Node API in mock mode
docker-compose up --build -d

# Start with optional MongoDB persistence
docker-compose --profile with-db up --build -d
```

---

## 🧪 Comprehensive Automated Test Suites

InfraSync AI includes 8 distinct automated test suites:

```bash
# 1. End-to-End System Integration Suite (21/21 passed)
node backend/test/e2e-integration.test.js

# 2. Admin, Security & Hardening Suite (14/14 passed)
node backend/test/security.test.js

# 3. Human Verification & Audit Workflow Suite (13/13 passed)
node backend/test/verification.test.js

# 4. AI Microservice Proxy Suite (12/12 passed)
node backend/test/ai-proxy.test.js

# 5. Storage Unit Test Suite (9/9 passed)
node backend/test/storage.test.js

# 6. Upload End-to-End Suite (7/7 passed)
node backend/test/upload-endpoint.test.js

# 7. Backend REST API Smoke Suite (19/19 passed)
node backend/test/api.test.js

# 8. Python FastAPI Pytest Suite (6/6 passed)
cd ai-service && python -m pytest && cd ..

# 9. Static Analysis & Linter
npx oxlint

# 10. Production Frontend Build
npm run build
```

---

## 📖 Additional Documentation
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) — Comprehensive deployment procedures, environment configuration, and container setup.
- [`SECURITY.md`](./SECURITY.md) — Security threat model, authorization matrix, tenancy enforcement, and prototype limitations.
