# InfraSync AI — REST API Foundation (Phase 17)

## Overview
The **InfraSync AI Backend** provides a structured Node.js + Express.js REST API layer that connects the React frontend to future persistent repositories and AI intelligence microservices.

> [!NOTE]
> This phase establishes the **REST API Architecture & Foundation**. All endpoints serve controlled prototype data via the repository pattern to enable seamless migration to MongoDB and external services in subsequent phases.

---

## 🏗️ Architecture

The backend follows a strict 4-tier separation of concerns:

```text
HTTP Request
    ↓
Routes (/src/routes/*.routes.js)
    ↓
Controllers (/src/controllers/*.controller.js)
    ↓
Services (/src/services/*.service.js)
    ↓
Repositories (/src/repositories/*.repository.js)
    ↓
Data Source (Prototype Data / Future MongoDB)
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0+ (Tested on Node.js v22.15)
- **npm**: v9.0+

### 2. Installation
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `backend/` root (or copy `.env.example`):
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
API_PREFIX=/api
```

### 4. Running the Server
```bash
# Start development server with file watch
npm run dev

# Start production server
npm start

# Run API smoke test suite
npm test
```

---

## 📡 API Endpoint Reference

### Base & Health
- `GET /` — API Server Info
- `GET /api/health` — Service health check & environment metadata

### Projects Domain
- `GET /api/projects` — List all infrastructure projects
- `GET /api/projects/:projectId` — Retrieve project metadata, phases, and stakeholders

### Schedule & P6 Domain
- `GET /api/projects/:projectId/schedule` — Project schedule baseline and structure
- `GET /api/projects/:projectId/milestones` — Key project milestones & completion states
- `GET /api/projects/:projectId/activities` — Schedule activity register

### Execution Tracking Domain
- `GET /api/projects/:projectId/execution` — Execution progress and quantity metrics
- `GET /api/projects/:projectId/micro-activities` — Micro-activity ground tracking register
- `GET /api/projects/:projectId/execution-units` — Physical execution units status

### Evidence & Field Capture Domain
- `GET /api/projects/:projectId/evidence` — Field evidence capture records
- `GET /api/evidence/:evidenceId` — Single evidence detail with metadata

### Site View & Spatial Domain
- `GET /api/projects/:projectId/site-view` — Spatial layout and coordinate grid
- `GET /api/projects/:projectId/zones` — Site execution zones & stationing
- `GET /api/projects/:projectId/capture-points` — Fixed optical & telemetry capture points

### Risk Intelligence Domain
- `GET /api/projects/:projectId/risk-events` — Rule-based early warning events

### Alerts & Human Intervention Domain
- `GET /api/projects/:projectId/alerts` — Project alerts and action items
- `GET /api/alerts/:alertId` — Single alert detail and intervention state

### Reporting & Project Intelligence Domain
- `GET /api/projects/:projectId/reports/summary` — Consolidated project executive report summary

---

## 📦 Standard Response Formats

### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response (`404 Not Found`, `400 Bad Request`, `500 Server Error`)
```json
{
  "success": false,
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "Project not found: proj-999"
  }
}
```

---

## 🔒 Security Baseline
- **CORS Protection**: Restricted to configured `CORS_ORIGIN`.
- **Payload Limits**: JSON / URL-encoded body limit set to 10MB.
- **Security Headers**: Includes `X-Content-Type-Options: nosniff`, `X-Frame-Options`, `X-XSS-Protection`, and `Strict-Transport-Security`.
- **Safe Errors**: Stack traces suppressed in production responses.
