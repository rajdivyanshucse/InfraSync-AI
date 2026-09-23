import app from '../src/server.js';

export async function runHardeningTests() {
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const port = server.address().port;
  const BASE_URL = `http://localhost:${port}/api`;

  console.log(`\n--- Starting Phase 13 Hardening & Reliability Tests against ${BASE_URL} ---`);

  const tests = [
    // -------------------------------------------------------------
    // 1. Full E2E Lifecycle Workflow Transitions
    // -------------------------------------------------------------
    {
      name: 'E2E Step 1: Ingest/Fetch Site Evidence for Project',
      url: `${BASE_URL}/projects/proj-1/evidence`,
      method: 'GET',
      headers: { 'x-user-role': 'site_engineer', 'x-user-id': 'usr-eng-01' },
      expectStatus: 200,
      validate: (res) => Array.isArray(res.data) && res.data.length > 0,
    },
    {
      name: 'E2E Step 2: Ingest QA Review Decision on Evidence',
      url: `${BASE_URL}/evidence/EV-000121/review`,
      method: 'PATCH',
      headers: { 'x-user-role': 'site_engineer', 'x-user-id': 'usr-eng-01' },
      body: { status: 'verified', reviewer: 'Ananya Sen', note: 'Visual inspection matched design specs.' },
      expectStatus: 200,
      validate: (res) => res.data.status === 'verified',
    },
    {
      name: 'E2E Step 3: Authoritative Verification Approval by Project Manager',
      url: `${BASE_URL}/verifications/verify`,
      method: 'POST',
      headers: { 'x-user-role': 'project_manager', 'x-user-id': 'usr-pm-01' },
      body: {
        projectId: 'proj-1',
        evidenceId: 'EV-000121',
        targetType: 'schedule_link',
        targetId: 'ACT-03-02-001',
        reason: 'Confirmed against site inspection record and daily piling log.',
      },
      expectStatus: 200,
      validate: (res) => res.data.status === 'verified' && res.data.decision === 'verified',
    },
    {
      name: 'E2E Step 4: Risk Event Early Warning Acknowledged',
      url: `${BASE_URL}/projects/proj-1/risk-events/RSK-001/acknowledge`,
      method: 'POST',
      headers: { 'x-user-role': 'project_manager', 'x-user-id': 'usr-pm-01' },
      body: { acknowledged: true, actor: 'Sarah Jenkins' },
      expectStatus: 200,
      validate: (res) => res.data.acknowledged === true,
    },
    {
      name: 'E2E Step 5: Operational Alert Intervention Logged',
      url: `${BASE_URL}/alerts/ALT-0001`,
      method: 'PUT',
      headers: { 'x-user-role': 'project_manager', 'x-user-id': 'usr-pm-01' },
      body: {
        status: 'actionInProgress',
        actor: 'Sarah Jenkins',
        note: 'Additional pile rig deployed to workfront.',
      },
      expectStatus: 200,
      validate: (res) => res.data.status === 'actionInProgress',
    },
    {
      name: 'E2E Step 6: Operational Alert Resolved and Signed Off',
      url: `${BASE_URL}/alerts/ALT-0001/signoff`,
      method: 'POST',
      headers: { 'x-user-role': 'project_authority', 'x-user-id': 'usr-auth-01' },
      body: {
        resolutionNote: 'Piling productivity recovered to 100% of baseline rate.',
        actor: 'Divyanshu Sharma',
      },
      expectStatus: 200,
      validate: (res) => res.data.status === 'resolved',
    },
    {
      name: 'E2E Step 7: System Audit Trail Recorded All Workflow Events',
      url: `${BASE_URL}/audit-logs?projectId=proj-1`,
      method: 'GET',
      headers: { 'x-user-role': 'administrator', 'x-user-id': 'usr-admin-01' },
      expectStatus: 200,
      validate: (res) => Array.isArray(res.data) && res.data.length >= 4,
    },

    // -------------------------------------------------------------
    // 2. 6-Role Authorization Matrix & Forbidden Access
    // -------------------------------------------------------------
    {
      name: 'Auth Matrix: Contractor FORBIDDEN from verifying findings (403)',
      url: `${BASE_URL}/verifications/verify`,
      method: 'POST',
      headers: { 'x-user-role': 'contractor', 'x-user-id': 'usr-cnt-01' },
      body: {
        projectId: 'proj-1',
        evidenceId: 'EV-000121',
        targetType: 'schedule_link',
        targetId: 'ACT-03-02-001',
        reason: 'Contractor trying to verify own work.',
      },
      expectStatus: 403,
      validate: (res) => res.success === false && res.error.code === 'FORBIDDEN_ROLE',
    },
    {
      name: 'Auth Matrix: Site Engineer permitted to verify findings (200)',
      url: `${BASE_URL}/verifications/verify`,
      method: 'POST',
      headers: { 'x-user-role': 'site_engineer', 'x-user-id': 'usr-eng-01' },
      body: {
        projectId: 'proj-1',
        evidenceId: 'EV-000121',
        targetType: 'schedule_link',
        targetId: 'ACT-03-02-001',
        reason: 'Site Engineer technical sign-off recorded.',
      },
      expectStatus: 200,
      validate: (res) => res.data.status === 'verified',
    },
    {
      name: 'Auth Matrix: Discipline Manager permitted to verify findings (200)',
      url: `${BASE_URL}/verifications/verify`,
      method: 'POST',
      headers: { 'x-user-role': 'discipline_manager', 'x-user-id': 'usr-disc-01' },
      body: {
        projectId: 'proj-1',
        evidenceId: 'EV-000121',
        targetType: 'schedule_link',
        targetId: 'ACT-03-02-001',
        reason: 'Discipline Manager structural review confirmed.',
      },
      expectStatus: 200,
      validate: (res) => res.data.status === 'verified',
    },
    {
      name: 'Auth Matrix: Project Authority permitted to reject findings (200)',
      url: `${BASE_URL}/verifications/reject`,
      method: 'POST',
      headers: { 'x-user-role': 'project_authority', 'x-user-id': 'usr-auth-01' },
      body: {
        projectId: 'proj-1',
        evidenceId: 'EV-000121',
        targetType: 'schedule_link',
        targetId: 'ACT-03-02-001',
        reason: 'Rejected due to revised piling schedule.',
      },
      expectStatus: 200,
      validate: (res) => res.data.status === 'rejected',
    },

    // -------------------------------------------------------------
    // 3. Project-Scope & IDOR Isolation
    // -------------------------------------------------------------
    {
      name: 'Project Scope: Evidence-Project mismatch rejected (400)',
      url: `${BASE_URL}/ai/analyze`,
      method: 'POST',
      headers: { 'x-user-role': 'project_manager', 'x-user-id': 'usr-pm-01' },
      body: {
        evidenceId: 'EV-000121',
        projectId: 'proj-999-invalid',
      },
      expectStatus: 400,
      validate: (res) => res.success === false && (res.error.code === 'EVIDENCE_PROJECT_MISMATCH' || res.error.code === 'VALIDATION_ERROR'),
    },
    {
      name: 'Project Scope: Querying non-existent project returns clean 404',
      url: `${BASE_URL}/projects/proj-unknown/schedule`,
      method: 'GET',
      headers: { 'x-user-role': 'project_manager', 'x-user-id': 'usr-pm-01' },
      expectStatus: 404,
      validate: (res) => res.success === false && res.error.code === 'PROJECT_NOT_FOUND',
    },

    // -------------------------------------------------------------
    // 4. Idempotency & Duplicate Mutation Resilience
    // -------------------------------------------------------------
    {
      name: 'Idempotency: Re-submitting same verification update succeeds without state corruption',
      url: `${BASE_URL}/verifications/verify`,
      method: 'POST',
      headers: { 'x-user-role': 'project_manager', 'x-user-id': 'usr-pm-01' },
      body: {
        projectId: 'proj-1',
        evidenceId: 'EV-000121',
        targetType: 'schedule_link',
        targetId: 'ACT-03-02-001',
        reason: 'Re-confirming verified status after field re-inspection.',
      },
      expectStatus: 200,
      validate: (res) => res.data.status === 'verified',
    },
    {
      name: 'Idempotency: Re-acknowledging risk event keeps status true',
      url: `${BASE_URL}/projects/proj-1/risk-events/RSK-001/acknowledge`,
      method: 'POST',
      headers: { 'x-user-role': 'site_engineer', 'x-user-id': 'usr-eng-01' },
      body: { acknowledged: true, actor: 'Ananya Sen' },
      expectStatus: 200,
      validate: (res) => res.data.acknowledged === true,
    },

    // -------------------------------------------------------------
    // 5. Input Validation & Error Matrix
    // -------------------------------------------------------------
    {
      name: 'Validation: Missing review reason rejected with 400 MISSING_REASON',
      url: `${BASE_URL}/verifications/reject`,
      method: 'POST',
      headers: { 'x-user-role': 'project_manager', 'x-user-id': 'usr-pm-01' },
      body: {
        projectId: 'proj-1',
        evidenceId: 'EV-000121',
        targetType: 'schedule_link',
        targetId: 'ACT-03-02-001',
        reason: '   ', // whitespace only
      },
      expectStatus: 400,
      validate: (res) => res.success === false && res.error.code === 'MISSING_REASON',
    },
    {
      name: 'Validation: Invalid targetType rejected with 400 INVALID_TARGET_TYPE',
      url: `${BASE_URL}/verifications/verify`,
      method: 'POST',
      headers: { 'x-user-role': 'project_manager', 'x-user-id': 'usr-pm-01' },
      body: {
        projectId: 'proj-1',
        evidenceId: 'EV-000121',
        targetType: 'unsupported_type_xyz',
        targetId: 'ACT-03-02-001',
        reason: 'Valid justification reason.',
      },
      expectStatus: 400,
      validate: (res) => res.success === false && res.error.code === 'INVALID_TARGET_TYPE',
    },
  ];

  let passed = 0;
  let failed = 0;

  try {
    for (const t of tests) {
      try {
        const options = {
          method: t.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(t.headers || {}),
          },
        };
        if (t.body) {
          options.body = JSON.stringify(t.body);
        }
        const response = await fetch(t.url, options);
        const data = await response.json();
        const statusOk = response.status === t.expectStatus;
        const dataOk = t.validate ? t.validate(data) : true;

        if (statusOk && dataOk) {
          console.log(`✅ [PASS] ${t.name} (Status: ${response.status})`);
          passed++;
        } else {
          console.error(`❌ [FAIL] ${t.name} (Expected: ${t.expectStatus}, Got: ${response.status})`, data);
          failed++;
        }
      } catch (err) {
        console.error(`❌ [FAIL] ${t.name} (Network/Execution Error: ${err.message})`);
        failed++;
      }
    }
  } finally {
    server.close();
  }

  console.log(`\nHardening Results: ${passed} passed, ${failed} failed out of ${tests.length} tests.`);
  if (failed > 0) process.exit(1);
  return { passed, failed, total: tests.length };
}

if (process.argv[1]?.includes('hardening.test.js')) {
  runHardeningTests();
}
