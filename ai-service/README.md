# InfraSync AI — AI Service Foundation (Phase 20)

A lightweight FastAPI Python microservice establishing the isolated AI service boundary for InfraSync AI.

## Features

- **Isolated Service Boundary**: Dedicated Python service running FastAPI on port 8000.
- **Demo Mode Default**: Explicit placeholder and contract validation without claiming real computer vision or fabricating metrics.
- **REST Endpoints**:
  - `GET /health` — Service health, status, environment, and active `aiMode`.
  - `POST /analyze` — Validates evidence analysis requests and returns structured analysis schemas.
- **Stateless & Decoupled**: Does not connect directly to MongoDB or read from the physical storage filesystem.

## Setup & Running

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configurable variables:
- `AI_MODE`: `demo` (default) or `production`
- `ENVIRONMENT`: `development` (default)
- `PORT`: `8000` (default)

### 3. Run Development Server

```bash
uvicorn app.main:app --reload --port 8000
```

### 4. Run Tests

```bash
pytest
```
