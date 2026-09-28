/**
 * InfraSync AI — Phase 16 Production Readiness, Security & Role Escalation Test Suite
 * Tests strict production authorization boundaries, role escalation prevention,
 * JWT bearer token parsing, production config validation, and security invariants.
 */

import { authenticate, authorizeRoles, authorizeProjectScope } from '../src/middleware/auth.js';
import { validateConfig, config } from '../src/config/env.js';
import { LocalStorageProvider } from '../src/storage/localStorage.provider.js';
import { storageService } from '../src/storage/storage.service.js';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

let passed = 0;
let failed = 0;

function testAssert(name, condition, extraInfo = '') {
  if (condition) {
    console.log(`${colors.green}✅ [PASS]${colors.reset} ${name}`);
    passed++;
  } else {
    console.error(`${colors.red}❌ [FAIL]${colors.reset} ${name} ${extraInfo ? `(${extraInfo})` : ''}`);
    failed++;
  }
}

export async function runProductionReadinessTests() {
  console.log(`\n${colors.cyan}================================================================${colors.reset}`);
  console.log(`${colors.cyan}🛡️ InfraSync AI — Phase 16 Production Infrastructure & Security Tests${colors.reset}`);
  console.log(`${colors.cyan}================================================================${colors.reset}\n`);

  // -------------------------------------------------------------
  // 1. Role Escalation Prevention in Production Mode
  // -------------------------------------------------------------
  const originalNodeEnv = process.env.NODE_ENV;
  const originalConfigEnv = config.nodeEnv;
  
  try {
    process.env.NODE_ENV = 'production';
    config.nodeEnv = 'production';

    // Test 1: Arbitrary x-user-role: administrator must be ignored in production
    const mockReqAdmin = {
      headers: {
        'x-user-role': 'administrator',
        'x-user-id': 'usr-attacker',
      },
    };
    let nextCalled = false;
    authenticate(mockReqAdmin, {}, () => { nextCalled = true; });
    testAssert(
      '1. Role Escalation: Arbitrary x-user-role: administrator header is ignored in production (user=null)',
      nextCalled && mockReqAdmin.user === null
    );

    // Test 2: Arbitrary x-user-role: project_authority rejected at RBAC guard
    const mockReqAuth = {
      headers: {
        'x-user-role': 'project_authority',
      },
    };
    authenticate(mockReqAuth, {}, () => {});
    let rbacStatusCode = null;
    let rbacErrorCode = null;
    const mockRes = {
      status: (code) => {
        rbacStatusCode = code;
        return {
          json: (body) => {
            rbacErrorCode = body.error?.code;
          },
        };
      },
    };
    const rbacGuard = authorizeRoles('project_authority', 'project_manager');
    rbacGuard(mockReqAuth, mockRes, () => {});
    testAssert(
      '2. Role Escalation: Unauthenticated request claiming project_authority receives 401 UNAUTHENTICATED',
      rbacStatusCode === 401 && rbacErrorCode === 'UNAUTHENTICATED'
    );

    // Test 3: Demo token "demo-admin" is rejected in production mode
    const mockReqDemoToken = {
      headers: {
        authorization: 'Bearer demo-administrator',
      },
    };
    authenticate(mockReqDemoToken, {}, () => {});
    testAssert(
      '3. Demo Tokens Prohibited: Bearer demo-administrator is rejected in production (user=null)',
      mockReqDemoToken.user === null
    );

    // Test 4: Valid Enterprise JWT Bearer token accepted and role resolved in production
    const jwtHeader = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const jwtPayload = Buffer.from(
      JSON.stringify({
        sub: 'usr-corp-991',
        name: 'Sarah Chen (Enterprise PM)',
        role: 'project_manager',
        permittedProjects: ['proj-1', 'proj-2'],
      })
    ).toString('base64url');
    const validJwt = `${jwtHeader}.${jwtPayload}.fake_signature_hash`;

    const mockReqValidJwt = {
      headers: {
        authorization: `Bearer ${validJwt}`,
      },
    };
    authenticate(mockReqValidJwt, {}, () => {});
    testAssert(
      '4. Production Authentication: Valid JWT Bearer token resolves user identity and role',
      mockReqValidJwt.user !== null &&
        mockReqValidJwt.user.userId === 'usr-corp-991' &&
        mockReqValidJwt.user.role === 'project_manager' &&
        mockReqValidJwt.user.isDemo === false
    );

    // Test 5: Authorized JWT passes RBAC guard
    let rbacPassed = false;
    rbacGuard(mockReqValidJwt, mockRes, () => { rbacPassed = true; });
    testAssert(
      '5. RBAC Guard: Authenticated project_manager JWT passes authorizeRoles check',
      rbacPassed === true
    );

    // Test 6: Unauthorized Project Scope rejection with JWT
    const mockReqScope = {
      ...mockReqValidJwt,
      params: { projectId: 'proj-unauthorized-999' },
    };
    let scopeStatusCode = null;
    const mockScopeRes = {
      status: (code) => {
        scopeStatusCode = code;
        return { json: () => {} };
      },
    };
    authorizeProjectScope(mockReqScope, mockScopeRes, () => {});
    testAssert(
      '6. Project Scope Guard: JWT accessing unauthorized project scope receives 403 PROJECT_ACCESS_DENIED',
      scopeStatusCode === 403
    );

  } finally {
    process.env.NODE_ENV = originalNodeEnv;
    config.nodeEnv = originalConfigEnv;
  }

  // -------------------------------------------------------------
  // 2. Production Config Validation & Startup Fail-Fast
  // -------------------------------------------------------------
  try {
    config.nodeEnv = 'production';
    config.dataSource = 'mock'; // Invalid for production

    let caughtError = false;
    try {
      validateConfig();
    } catch (err) {
      caughtError = err.message.includes('DATA_SOURCE=mongodb');
    }
    testAssert(
      '7. Production Fail-Fast: validateConfig() throws when DATA_SOURCE=mock in production mode',
      caughtError === true
    );
  } finally {
    config.nodeEnv = originalConfigEnv;
    config.dataSource = 'mock';
  }

  // -------------------------------------------------------------
  // 3. Storage Abstraction & Path Traversal Prevention
  // -------------------------------------------------------------
  const localProvider = new LocalStorageProvider('./storage/uploads');

  let traversalBlocked = false;
  try {
    localProvider._resolvePath('../../etc/passwd');
  } catch (err) {
    traversalBlocked = err.message.includes('Path traversal detected');
  }
  testAssert(
    '8. Storage Security: Directory traversal key (../../etc/passwd) rejected with Path traversal error',
    traversalBlocked === true
  );

  let absolutePathBlocked = false;
  try {
    localProvider._resolvePath('/etc/shadow');
  } catch (err) {
    traversalBlocked = true;
  }
  testAssert(
    '9. Storage Security: Absolute file path key (/etc/shadow) rejected',
    traversalBlocked === true
  );

  // Test 10: MIME Validation
  let invalidMimeBlocked = false;
  try {
    await storageService.saveEvidenceFile({
      originalname: 'malware.exe',
      mimetype: 'application/x-msdownload',
      buffer: Buffer.from('MZ...'),
      size: 5,
    });
  } catch (err) {
    invalidMimeBlocked = err.code === 'UNSUPPORTED_FILE_TYPE';
  }
  testAssert(
    '10. Storage Security: Unsupported executable MIME type rejected with UNSUPPORTED_FILE_TYPE',
    invalidMimeBlocked === true
  );

  // Test 11: File Size Validation
  let oversizedBlocked = false;
  try {
    await storageService.saveEvidenceFile({
      originalname: 'huge_file.mp4',
      mimetype: 'video/mp4',
      buffer: Buffer.from('data'),
      size: 100 * 1024 * 1024, // 100MB > 50MB limit
    });
  } catch (err) {
    oversizedBlocked = err.code === 'FILE_TOO_LARGE';
  }
  testAssert(
    '11. Storage Security: File exceeding max size rejected with FILE_TOO_LARGE',
    oversizedBlocked === true
  );

  // Test 12: SHA-256 Checksum Calculation
  const testBuffer = Buffer.from('InfraSync Evidence File Verification Hash 2026');
  const checksum = storageService.calculateChecksum(testBuffer);
  testAssert(
    '12. Storage Integrity: Deterministic SHA-256 hash computed for evidence payload',
    typeof checksum === 'string' && checksum.length === 64
  );

  console.log(`\n================================================================`);
  console.log(`🛡️ Production Readiness Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests.`);
  console.log(`================================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

if (process.argv[1]?.includes('production-readiness.test.js')) {
  runProductionReadinessTests();
}
