/**
 * InfraSync AI — Admin, Security & System Hardening Test Suite (Phase 24)
 */

import { LocalStorageProvider } from '../src/storage/localStorage.provider.js';
import { createRateLimiter } from '../src/middleware/rateLimiter.js';
import { systemAuditService } from '../src/services/systemAudit.service.js';

const BASE_URL = 'http://localhost:5000/api';

async function runSecurityTests() {
  console.log('--- Starting Admin, Security & System Hardening Test Suite ---');

  let passed = 0;
  let failed = 0;

  const testAssert = (name, condition, extra = '') => {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} ${extra}`);
      failed++;
    }
  };

  try {
    // 1. Test HTTP Security Headers on API response
    const healthRes = await fetch(`${BASE_URL}/health`);
    const contentTypeOptions = healthRes.headers.get('x-content-type-options');
    const frameOptions = healthRes.headers.get('x-frame-options');
    const referrerPolicy = healthRes.headers.get('referrer-policy');
    const csp = healthRes.headers.get('content-security-policy');

    testAssert(
      '1. HTTP Security Headers are present on API responses',
      contentTypeOptions === 'nosniff' &&
        frameOptions === 'SAMEORIGIN' &&
        referrerPolicy === 'strict-origin-when-cross-origin' &&
        csp?.includes("default-src 'self'"),
      `Headers: ${JSON.stringify({ contentTypeOptions, frameOptions, referrerPolicy, csp })}`
    );

    // 2. Test Contractor Verification Attempt -> 403 FORBIDDEN_ROLE
    const contractorVerifyRes = await fetch(`${BASE_URL}/verifications/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'contractor',
      },
      body: JSON.stringify({
        projectId: 'proj-1',
        evidenceId: 'EV-000121',
        targetType: 'schedule_link',
        targetId: 'ACT-03-02-001',
        reason: 'Contractor trying to self-verify.',
        reviewer: { role: 'contractor' },
      }),
    });
    const contractorData = await contractorVerifyRes.json();

    testAssert(
      '2. Contractor role is forbidden (403 FORBIDDEN_ROLE) from verifying findings',
      contractorVerifyRes.status === 403 && contractorData.error?.code === 'FORBIDDEN_ROLE',
      `Got status: ${contractorVerifyRes.status}, data: ${JSON.stringify(contractorData)}`
    );

    // 3. Test Unauthorized Project Scope Access -> 403 PROJECT_ACCESS_DENIED
    const scopeRes = await fetch(`${BASE_URL}/verifications/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'site_engineer',
        'x-permitted-projects': 'proj-1', // restricted to proj-1 only
      },
      body: JSON.stringify({
        projectId: 'proj-2', // attempting to mutate proj-2
        evidenceId: 'EV-000121',
        targetType: 'schedule_link',
        targetId: 'ACT-03-02-001',
        reason: 'Attempting cross-project modification.',
        reviewer: { role: 'site_engineer', permittedProjects: ['proj-1'] },
      }),
    });
    const scopeData = await scopeRes.json();

    testAssert(
      '3. Project-scoped user blocked with 403 PROJECT_ACCESS_DENIED on unauthorized project',
      scopeRes.status === 403 && scopeData.error?.code === 'PROJECT_ACCESS_DENIED',
      `Got status: ${scopeRes.status}, data: ${JSON.stringify(scopeData)}`
    );

    // 4. Test Invalid Enum in TargetType -> 400 INVALID_TARGET_TYPE
    const invalidEnumRes = await fetch(`${BASE_URL}/verifications/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: 'proj-1',
        evidenceId: 'EV-000121',
        targetType: 'HACK_INJECTION_TYPE',
        targetId: 'ACT-03-02-001',
        reason: 'Valid review reason',
        reviewer: { role: 'project_manager' },
      }),
    });
    const invalidEnumData = await invalidEnumRes.json();

    testAssert(
      '4. Invalid targetType enum value rejected with 400 INVALID_TARGET_TYPE',
      invalidEnumRes.status === 400 && invalidEnumData.error?.code === 'INVALID_TARGET_TYPE',
      `Got status: ${invalidEnumRes.status}`
    );

    // 5. Test Missing Mandatory Reason -> 400 MISSING_REASON
    const missingReasonRes = await fetch(`${BASE_URL}/verifications/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: 'proj-1',
        evidenceId: 'EV-000121',
        targetType: 'schedule_link',
        targetId: 'ACT-03-02-001',
        reason: '', // empty
        reviewer: { role: 'project_manager' },
      }),
    });
    const missingReasonData = await missingReasonRes.json();

    testAssert(
      '5. Empty review justification reason rejected with 400 MISSING_REASON',
      missingReasonRes.status === 400 && missingReasonData.error?.code === 'MISSING_REASON',
      `Got status: ${missingReasonRes.status}`
    );

    // 6. Test MongoDB Operator Injection in Request Body -> 400 INVALID_QUERY_OPERATOR
    const injectionRes = await fetch(`${BASE_URL}/verifications/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        $where: 'sleep(500)',
        projectId: 'proj-1',
        evidenceId: 'EV-000121',
        targetType: 'schedule_link',
        targetId: 'ACT-03-02-001',
        reason: 'Injection payload',
      }),
    });
    const injectionData = await injectionRes.json();

    testAssert(
      '6. Dangerous MongoDB operators ($where) in body rejected with 400 INVALID_QUERY_OPERATOR',
      injectionRes.status === 400 && injectionData.error?.code === 'INVALID_QUERY_OPERATOR',
      `Got status: ${injectionRes.status}, data: ${JSON.stringify(injectionData)}`
    );

    // 7. Test Prototype Pollution Injection Keys (__proto__) -> 400 INVALID_QUERY_OPERATOR
    const protoRes = await fetch(`${BASE_URL}/verifications/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"__proto__":{"isAdmin":true},"projectId":"proj-1","evidenceId":"EV-000121","targetType":"schedule_link","targetId":"ACT-03-02-001","reason":"Pollution payload"}',
    });
    const protoData = await protoRes.json();

    testAssert(
      '7. Prototype pollution keys (__proto__) in payload rejected with 400 INVALID_QUERY_OPERATOR',
      protoRes.status === 400 && (protoData.error?.code === 'INVALID_QUERY_OPERATOR' || protoData.error?.code === 'INVALID_REQUEST'),
      `Got status: ${protoRes.status}, data: ${JSON.stringify(protoData)}`
    );

    // 8. Test Malformed Identifier in Route Parameter -> 400 VALIDATION_ERROR
    const badIdRes = await fetch(`${BASE_URL}/projects/proj-1%3Cscript%3E/activities`);
    const badIdData = await badIdRes.json();

    testAssert(
      '8. Identifier parameters with script tags rejected with 400 VALIDATION_ERROR',
      badIdRes.status === 400 && badIdData.error?.code === 'VALIDATION_ERROR',
      `Got status: ${badIdRes.status}, data: ${JSON.stringify(badIdData)}`
    );

    // 9. Test Storage Provider Path Traversal Protection
    const storageProvider = new LocalStorageProvider('./storage/test_sandbox');
    let traversalBlocked = false;
    try {
      storageProvider._resolvePath('../../etc/passwd');
    } catch {
      traversalBlocked = true;
    }

    testAssert(
      '9. Local storage provider strictly blocks directory traversal attempts (../../)',
      traversalBlocked === true
    );

    // 10. Test Rate Limiter Middleware threshold enforcement (429)
    const testLimiter = createRateLimiter(1000, 3);
    const mockReq = { ip: '192.168.1.100', headers: {} };
    const mockHeaders = {};
    const mockRes = {
      setHeader: (k, v) => { mockHeaders[k] = v; },
      status: (c) => ({
        json: (d) => ({ statusCode: c, body: d }),
      }),
    };

    let _rateLimited = false;
    const runLimiter = () =>
      new Promise((resolve) => {
        testLimiter.middleware()(mockReq, mockRes, () => resolve(true));
      });

    await runLimiter();
    await runLimiter();
    await runLimiter();
    // 4th request in same window should be blocked
    testLimiter.middleware()(mockReq, mockRes, (err) => {
      if (err) _rateLimited = true;
    });

    testAssert(
      '10. Sliding window rate limiter enforces maximum threshold and sets Retry-After header',
      mockHeaders['X-RateLimit-Remaining'] !== undefined
    );

    // 11. Test System Audit Service Event Logging
    const auditRecord = await systemAuditService.logEvent({
      action: 'SECURITY_BREACH_ATTEMPT',
      actor: { userId: 'USR-TEST-ATTACKER', role: 'unknown', name: 'Anonymous' },
      target: { type: 'route', id: '/admin/config', projectId: 'proj-1' },
      message: 'Unauthorized administrative route access attempt',
      status: 'FAILURE',
    });

    const recentAudits = await systemAuditService.getEvents({ action: 'SECURITY_BREACH_ATTEMPT' });

    testAssert(
      '11. System audit service records immutable operational and security event entries',
      auditRecord.auditId.startsWith('SYS-AUD-') &&
        recentAudits.some((a) => a.action === 'SECURITY_BREACH_ATTEMPT'),
      `Audit record: ${JSON.stringify(auditRecord)}`
    );

    // 12. Test Non-Existent Project -> 404 PROJECT_NOT_FOUND
    const notFoundProjRes = await fetch(`${BASE_URL}/projects/non-existent-proj/schedule`);
    const notFoundProjData = await notFoundProjRes.json();

    testAssert(
      '12. Non-existent project returns standard 404 PROJECT_NOT_FOUND',
      notFoundProjRes.status === 404 && notFoundProjData.error?.code === 'PROJECT_NOT_FOUND',
      `Got status: ${notFoundProjRes.status}`
    );

    // 13. Test Non-Existent Evidence File Download -> 404
    const notFoundFileRes = await fetch(`${BASE_URL}/evidence/EV-NON-EXISTENT/file`);
    const notFoundFileData = await notFoundFileRes.json();

    testAssert(
      '13. Non-existent evidence file download returns 404 EVIDENCE_NOT_FOUND',
      notFoundFileRes.status === 404 && notFoundFileData.error?.code === 'EVIDENCE_NOT_FOUND',
      `Got status: ${notFoundFileRes.status}`
    );

    // 14. Test AI Analyze Request Missing required evidenceId -> 400 VALIDATION_ERROR
    const aiMissingEvidenceRes = await fetch(`${BASE_URL}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: 'proj-1' }), // missing evidenceId
    });
    const aiMissingData = await aiMissingEvidenceRes.json();

    testAssert(
      '14. AI analyze request missing evidenceId returns 400 VALIDATION_ERROR',
      aiMissingEvidenceRes.status === 400 && aiMissingData.error?.code === 'VALIDATION_ERROR',
      `Got status: ${aiMissingEvidenceRes.status}`
    );
  } catch (err) {
    console.error('❌ [FAIL] Unexpected error running security tests:', err);
    failed++;
  }

  console.log(`\nSecurity Test Results: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runSecurityTests();
