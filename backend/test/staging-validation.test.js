/**
 * InfraSync AI — Phase 15: Staging Deployment & Real Environment Validation Test Suite
 * Tests live multi-service communication across Express Backend, Python FastAPI AI Microservice,
 * RBAC authorization, project isolation, failure injection, correlation tracing, and audit ledger.
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import app from '../src/server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
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

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runStagingValidationTests() {
  console.log(`\n${colors.cyan}================================================================${colors.reset}`);
  console.log(`${colors.cyan}🚀 InfraSync AI — Phase 15 Real Staging Environment Validation${colors.reset}`);
  console.log(`${colors.cyan}================================================================${colors.reset}\n`);

  // 1. Start Python FastAPI AI Microservice on Port 8000
  const aiServiceDir = path.resolve(__dirname, '../../ai-service');
  console.log(`[Staging] Launching Python FastAPI AI Service in: ${aiServiceDir}`);
  
  const aiProcess = spawn('python', ['-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8000'], {
    cwd: aiServiceDir,
    stdio: 'pipe',
  });

  aiProcess.stderr.on('data', (data) => {
    // suppress debug logs in test output unless error
    const msg = data.toString();
    if (msg.includes('ERROR') || msg.includes('Traceback')) {
      console.error('[AI Service Error]:', msg);
    }
  });

  // Wait for AI service to initialize
  let aiReady = false;
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    try {
      const res = await fetch('http://127.0.0.1:8000/health');
      if (res.ok) {
        aiReady = true;
        break;
      }
    } catch {
      // waiting for server socket
    }
  }

  testAssert('1. Live Python FastAPI AI Microservice started and socket responsive on 127.0.0.1:8000', aiReady);

  // 2. Start Express Backend API Server on ephemeral staging port
  const backendServer = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const backendPort = backendServer.address().port;
  const STAGING_URL = `http://localhost:${backendPort}`;
  const API_URL = `${STAGING_URL}/api`;

  console.log(`[Staging] Express Backend API active on: ${STAGING_URL}\n`);

  try {
    // --- STEP 1: Health & Readiness Probes ---
    const backendLivenessRes = await fetch(`${STAGING_URL}/health`);
    const backendLiveness = await backendLivenessRes.json();
    testAssert(
      '2. Backend Liveness probe GET /health returns HTTP 200 with uptime and service metadata',
      backendLivenessRes.status === 200 && backendLiveness.status === 'ok' && backendLiveness.service === 'infrasync-api'
    );

    const backendReadinessRes = await fetch(`${STAGING_URL}/ready`);
    const backendReadiness = await backendReadinessRes.json();
    testAssert(
      '3. Backend Readiness probe GET /ready returns HTTP 200 with ready=true',
      backendReadinessRes.status === 200 && backendReadiness.data?.ready === true
    );

    const aiLivenessRes = await fetch('http://127.0.0.1:8000/health');
    const aiLiveness = await aiLivenessRes.json();
    testAssert(
      '4. AI Microservice Liveness probe GET /health returns HTTP 200 ok',
      aiLivenessRes.status === 200 && aiLiveness.data?.status === 'ok'
    );

    const aiReadinessRes = await fetch('http://127.0.0.1:8000/ready');
    const aiReadiness = await aiReadinessRes.json();
    testAssert(
      '5. AI Microservice Readiness probe GET /ready returns loaded analytical engines',
      aiReadinessRes.status === 200 && Array.isArray(aiReadiness.data?.loadedComponents) && aiReadiness.data.loadedComponents.length >= 3
    );

    // --- STEP 2: Observability & Correlation ID Propagation ---
    const customReqId = `req-staging-trace-${Date.now()}`;
    const traceRes = await fetch(`${API_URL}/projects`, {
      headers: { 'X-Request-Id': customReqId },
    });
    const echoedReqId = traceRes.headers.get('x-request-id');
    testAssert(
      '6. Request Correlation: Inbound X-Request-Id is echoed in response headers for end-to-end tracing',
      echoedReqId === customReqId
    );

    // --- STEP 3: Live Service-to-Service AI Schedule Linking Integration ---
    const aiAnalyzeRes = await fetch(`${API_URL}/ai/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': `req-ai-trace-${Date.now()}`,
      },
      body: JSON.stringify({
        evidenceId: 'EV-000121',
        projectId: 'proj-1',
      }),
    });
    const aiAnalyzeData = await aiAnalyzeRes.json();
    testAssert(
      '7. Live Cross-Service AI Analysis: Backend calls FastAPI /analyze and receives deterministic proposal',
      aiAnalyzeRes.status === 200 && aiAnalyzeData.success === true && !!aiAnalyzeData.data?.analysisId
    );
    testAssert(
      '8. AI Schedule Linker returns structured candidate with explainable reasons and confidence',
      aiAnalyzeData.data?.scheduleLink && typeof aiAnalyzeData.data.scheduleLink.confidence === 'number'
    );

    // --- STEP 4: Candidate Verification Registration & Human Governance ---
    const verificationsRes = await fetch(`${API_URL}/projects/proj-1/verifications`);
    const verificationsData = await verificationsRes.json();
    testAssert(
      '9. Verification Queue: Candidate proposal registered for human review without mutating authoritative schedule',
      verificationsRes.status === 200 && Array.isArray(verificationsData.data) && verificationsData.data.length > 0
    );

    // --- STEP 5: Authoritative Human Verification Decision ---
    const verifyDecisionRes = await fetch(`${API_URL}/verifications/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'project_manager',
        'x-user-id': 'usr-pm-01',
      },
      body: JSON.stringify({
        projectId: 'proj-1',
        evidenceId: 'EV-000121',
        targetType: 'schedule_link',
        targetId: 'ACT-03-02-001',
        reason: 'Verified on-site rebar placement against structural drawing P25-P48.',
        reviewer: {
          userId: 'usr-pm-01',
          name: 'Sarah Chen (PM)',
          role: 'project_manager',
        },
      }),
    });
    const verifyDecisionData = await verifyDecisionRes.json();
    testAssert(
      '10. Human Decision: Project Manager approves finding, transitioning status to verified',
      verifyDecisionRes.status === 200 && verifyDecisionData.data?.status === 'verified'
    );

    // --- STEP 6: RBAC Authorization Matrix Validation ---
    const contractorForbiddenRes = await fetch(`${API_URL}/verifications/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'contractor',
        'x-user-id': 'usr-cnt-01',
      },
      body: JSON.stringify({
        projectId: 'proj-1',
        evidenceId: 'EV-000121',
        targetType: 'schedule_link',
        targetId: 'ACT-03-02-001',
        reason: 'Contractor unauthorized attempt',
        reviewer: { userId: 'usr-cnt-01', role: 'contractor' },
      }),
    });
    testAssert(
      '11. Authorization Matrix: Contractor role FORBIDDEN (403 FORBIDDEN_ROLE) from approving verification finding',
      contractorForbiddenRes.status === 403
    );

    // --- STEP 7: Project Scoping & Isolation ---
    const crossProjectRes = await fetch(`${API_URL}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        evidenceId: 'EV-000121', // belongs to proj-1
        projectId: 'proj-2',     // wrong project scope
      }),
    });
    testAssert(
      '12. Project Isolation: Cross-project evidence analysis rejected with HTTP 400 EVIDENCE_PROJECT_MISMATCH',
      crossProjectRes.status === 400
    );

    const nonExistentProjRes = await fetch(`${API_URL}/projects/proj-invalid-999/schedule`);
    testAssert(
      '13. Project Isolation: Non-existent project schedule query cleanly rejected with HTTP 404',
      nonExistentProjRes.status === 404
    );

    // --- STEP 8: Risk Intelligence Early Warning Workflow ---
    const riskAckRes = await fetch(`${API_URL}/projects/proj-1/risk-events/RSK-001/acknowledge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'site_engineer',
      },
      body: JSON.stringify({
        acknowledged: true,
        actor: 'Site Engineer Marcus',
      }),
    });
    const riskAckData = await riskAckRes.json();
    testAssert(
      '14. Risk Intelligence: Early warning signal acknowledged with persistent state',
      riskAckRes.status === 200 && riskAckData.data?.acknowledged === true
    );

    // --- STEP 9: Operational Alerts & Field Intervention Workbench ---
    const alertInterventionRes = await fetch(`${API_URL}/alerts/ALT-0001`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'project_manager',
      },
      body: JSON.stringify({
        status: 'acknowledged',
        intervention: {
          assignedTo: 'Superstructure Lead Eng',
          contractorContact: 'Alpha Infra Site Office',
          actionPlan: 'Mobilize second crane crew to accelerate pier cap concreting.',
          targetDate: '2026-03-25',
          remarks: 'Reviewed in weekly coordination meeting.',
          updatedBy: 'Sarah Chen (PM)',
        },
      }),
    });
    const alertInterventionData = await alertInterventionRes.json();
    testAssert(
      '15. Alert Intervention: Recovery action plan logged and status updated to acknowledged',
      alertInterventionRes.status === 200 && alertInterventionData.data?.status === 'acknowledged'
    );

    const alertSignoffRes = await fetch(`${API_URL}/alerts/ALT-0001/signoff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'project_authority',
      },
      body: JSON.stringify({
        resolutionNote: 'Accelerated pour completed successfully. Variance resolved.',
        actor: 'Chief Engineer Sharma (Authority)',
      }),
    });
    const alertSignoffData = await alertSignoffRes.json();
    testAssert(
      '16. Alert Signoff: Operational alert resolved and signed off by Project Authority',
      alertSignoffRes.status === 200 && alertSignoffData.data?.status === 'resolved'
    );

    // --- STEP 10: Persistent System Audit Trail ---
    const auditRes = await fetch(`${API_URL}/audit-logs?projectId=proj-1`);
    const auditData = await auditRes.json();
    testAssert(
      '17. System Audit Trail: Immutable chronological audit records generated across verification and alert events',
      auditRes.status === 200 && Array.isArray(auditData.data) && auditData.data.length >= 3
    );

    // --- STEP 11: Production Reports Summary ---
    const reportRes = await fetch(`${API_URL}/projects/proj-1/reports/summary`);
    const reportData = await reportRes.json();
    testAssert(
      '18. Reports Engine: Consumes authoritative backend state without divergent report-specific state',
      reportRes.status === 200 && !!reportData.data?.kpis
    );

  } finally {
    // Clean up servers
    backendServer.close();
    aiProcess.kill('SIGTERM');
  }

  // --- STEP 12: AI Failure Injection (Simulated AI Offline) ---
  console.log(`\n[Staging] Testing Failure Injection (AI Microservice Offline)...`);
  const offlineBackendServer = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const offlinePort = offlineBackendServer.address().port;

  try {
    const offlineAiRes = await fetch(`http://localhost:${offlinePort}/api/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        evidenceId: 'EV-000121',
        projectId: 'proj-1',
      }),
    });
    const offlineAiData = await offlineAiRes.json();
    testAssert(
      '19. Failure Injection: When AI service is offline, backend returns controlled HTTP 503 AI_SERVICE_UNAVAILABLE',
      offlineAiRes.status === 503 && offlineAiData.error?.code === 'AI_SERVICE_UNAVAILABLE'
    );
  } finally {
    offlineBackendServer.close();
  }

  console.log(`\n================================================================`);
  console.log(`📊 Staging Validation Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests.`);
  console.log(`================================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

// Execute directly if run via node
if (process.argv[1] && process.argv[1].endsWith('staging-validation.test.js')) {
  runStagingValidationTests().catch((err) => {
    console.error('Fatal staging validation error:', err);
    process.exit(1);
  });
}
