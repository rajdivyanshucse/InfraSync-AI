# InfraSync AI — Security Architecture & Hardening Guide (Phase 24)

This document details the security posture, defense-in-depth architecture, authorization boundaries, and production readiness requirements for the InfraSync AI platform.

---

## 1. Authentication Architecture

### Prototype / Demo Authentication Mode
- The prototype currently implements a lightweight, testable demo identity layer supporting role switching across 6 infrastructure personas:
  - `Project Authority` (`project_authority`)
  - `Project Manager` (`project_manager`)
  - `Site Engineer` (`site_engineer`)
  - `Discipline Manager` (`discipline_manager`)
  - `Contractor` (`contractor`)
  - `Administrator` (`admin` / `administrator`)
- Demo tokens/headers (e.g. `x-user-role`, `Authorization: Bearer demo-pm`) establish request identity (`req.user`) within Express middleware.

### Production Authentication Requirements
> [!IMPORTANT]
> The current demo authentication is designed for prototype evaluation and paired simulation. Production deployment requires:
> - Integration with enterprise Single Sign-On (SSO) / OpenID Connect (OIDC / OAuth2) or SAML 2.0.
> - Cryptographically signed, short-lived JSON Web Tokens (JWT) with JWKS public key rotation.
> - Secure HTTP-only, SameSite cookies or OAuth2 Bearer tokens.
> - Multi-factor authentication (MFA) for administrative and high-privilege operations.

---

## 2. Role-Based Access Control (RBAC) Matrix

| Domain Operation | Project Authority | Project Manager | Site Engineer | Discipline Manager | Contractor | Administrator |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **View Dashboard / Progress** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View Schedule WBS** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Upload Field Evidence** | ✅ | ✅ | ✅ | ✅ | ✅ (Assigned) | ✅ |
| **Download Evidence Files** | ✅ | ✅ | ✅ | ✅ | ✅ (Assigned) | ✅ |
| **Run AI Analysis Engine** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Verify Schedule Finding** | ✅ | ✅ | ✅ | ✅ (Discipline) | ❌ (403) | ✅ |
| **Reject Schedule Finding** | ✅ | ✅ | ✅ | ✅ (Discipline) | ❌ (403) | ✅ |
| **Confirm Risk Signal** | ✅ | ✅ | ✅ | ✅ (Discipline) | ❌ (403) | ✅ |
| **Project Administration** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 3. Project-Level Scope Enforcement (Multi-Tenancy)
- Requests to project endpoints (`/api/projects/:projectId/...` and `/api/verifications`) are validated against `req.user.permittedProjects`.
- Global roles (`project_authority`, `admin`) have portfolio-wide clearance.
- Project-assigned roles (`project_manager`, `site_engineer`, `contractor`) are restricted strictly to their authorized project scopes. Attempting to access an unauthorized project returns `403 PROJECT_ACCESS_DENIED`.

---

## 4. Input Validation & Query Injection Defense
- **Operator Injection Protection**: Request parameters, query strings, and body payloads are scanned and sanitized against MongoDB query operators (e.g. `$where`, `$gt`, `$ne`, `$regex`, `$expr`) and prototype pollution keys (`__proto__`, `constructor`).
- **Identifier Validation**: Route parameters (`projectId`, `evidenceId`, `verificationId`, etc.) are validated against alphanumeric/hyphen patterns (`/^[A-Za-z0-9_-]+$/`).
- **Enum Guarding**: Critical enum states (`status`, `targetType`, `severity`, `discipline`) are strictly checked against whitelists.
- **Pagination Bounds**: List endpoints clamp pagination to `limit <= 100` (default 50) and `page >= 1` to prevent unbounded memory queries.

---

## 5. File Storage & Upload Security
- **MIME & Extension Whitelist**: Only verified construction media types are permitted:
  - Images: `image/jpeg`, `image/png`, `image/webp`
  - Videos: `video/mp4`, `video/webm`
  - Documents: `application/pdf`
- **Path Traversal Defense**: All file keys are sanitized using `path.basename(key)` and verified via `path.resolve` to ensure target paths never escape the designated `storageRoot`.
- **Integrity Checksums**: Cryptographic SHA-256 hashes are calculated during streaming upload and persisted in metadata for tamper detection.
- **File Size Quota**: Uploads are enforced via Multer memory limits (default: 50MB per file; oversized files return `400 FILE_TOO_LARGE`).
- **Rollback on Failure**: If database metadata persistence fails during evidence upload, the orphaned storage file is immediately deleted.

---

## 6. Isolated AI Microservice Security
- **Strict Boundary**: The Python FastAPI AI service runs as an isolated calculation engine without direct database or filesystem access.
- **Trusted Context Construction**: All schedule, WBS, and evidence context is retrieved and formatted by the trusted Node backend before dispatch.
- **Timeout Protection**: AI requests are governed by an `AbortController` timeout (default: 15,000 ms). Unreachable or timing-out AI calls return `503 AI_SERVICE_UNAVAILABLE`.
- **Error Normalization**: Internal Python tracebacks are caught, sanitized, and normalized before returning to the client.

---

## 7. Append-Only Audit Integrity
- **Decision Traceability**: Every verification approval, rejection, or override creates an immutable `AuditEvent` (`AUD-...`) recording actor ID, name, role, timestamp, and mandatory justification reason.
- **No Overwriting**: Previous decisions and original AI candidate confidence/reasons are preserved permanently in `auditHistory`.
- **System Audit Log**: Sensitive operational events (`FILE_UPLOAD`, `FILE_DOWNLOAD`, `VERIFICATION`, `REJECTION`, `SECURITY_BREACH_ATTEMPT`) are logged to the `SystemAudit` model.

---

## 8. HTTP Security Headers & Rate Limiting
- **Security Headers**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' http://localhost:* http://127.0.0.1:*;`
- **CORS**: Configurable via `CORS_ORIGIN` (rejects unauthorized third-party web origins).
- **Rate Limiting**: Sliding-window rate limiter protects sensitive routes:
  - General API: 300 req / min per IP.
  - Decision & Upload Mutations: 60 req / min per IP.
  - AI Analysis: 30 req / min per IP.

---

## 9. Known Prototype Limitations & Production Deployment Roadmap

| Security Area | Prototype Implementation (Phase 24) | Production Deployment Requirement |
| :--- | :--- | :--- |
| **Authentication** | Demo header / token extraction & role switcher | Enterprise IdP (OIDC, SAML, Azure AD, Okta, MFA) |
| **Secrets Management** | Local `.env` files with git exclusion | AWS Secrets Manager / HashiCorp Vault / GCP KMS |
| **Transport Layer** | HTTP locally on port 5000 | TLS 1.3 Termination (HTTPS only with valid CA certs) |
| **Storage Backend** | Local directory (`./storage/uploads`) | Encrypted Cloud Object Storage (AWS S3, GCP Cloud Storage) |
| **Rate Limiting** | Node process in-memory sliding window | Distributed Redis-backed rate limiter / API Gateway |
| **Penetration Testing** | Automated integration security tests | Formal third-party SAST, DAST, and manual pentesting |
| **Database Encryption** | Plain MongoDB connection string | MongoDB Enterprise with Encryption-at-Rest & TLS certs |
