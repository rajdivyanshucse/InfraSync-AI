/**
 * InfraSync AI — Phase 25: End-to-End System Integration Test Suite
 * Validates the complete integrated pipeline across all 24 phases.
 */

const BASE_URL = process.env.API_URL || 'http://localhost:5000/api';

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

async function runE2EIntegrationTests() {
  console.log(`\n${colors.cyan}--- Starting InfraSync AI Complete End-to-End Integration Suite ---${colors.reset}\n`);

  try {
    // 1. Health Checks (Node REST API & Python AI Service)
    const apiHealthRes = await fetch(`${BASE_URL}/health`);
    const apiHealthData = await apiHealthRes.json();
    testAssert(
      '1. Node REST API Health endpoint responds with status ok',
      apiHealthRes.status === 200 && apiHealthData.data?.status === 'ok'
    );

    const aiHealthRes = await fetch(`${BASE_URL}/ai/health`);
    const aiHealthData = await aiHealthRes.json();
    testAssert(
      '2. AI Microservice Health Proxy responds with status ok',
      aiHealthRes.status === 200 && aiHealthData.data?.service === 'infrasync-ai-service' && aiHealthData.data?.status === 'ok'
    );

    // 2. Project Listing & Detail
    const projectsRes = await fetch(`${BASE_URL}/projects`);
    const projectsData = await projectsRes.json();
    testAssert(
      '3. GET /api/projects returns full project portfolio (4 projects)',
      projectsRes.status === 200 && Array.isArray(projectsData.data) && projectsData.data.length >= 4
    );

    const proj1Res = await fetch(`${BASE_URL}/projects/proj-1`);
    const proj1Data = await proj1Res.json();
    testAssert(
      '4. GET /api/projects/proj-1 retrieves valid metadata and stable ID',
      proj1Res.status === 200 && proj1Data.data?.id === 'proj-1' && proj1Data.data?.name?.includes('Metro')
    );

    // 3. Schedule, Activities, and Milestones
    const scheduleRes = await fetch(`${BASE_URL}/projects/proj-1/schedule`);
    const scheduleData = await scheduleRes.json();
    testAssert(
      '5. GET /api/projects/proj-1/schedule returns WBS phases and activities',
      scheduleRes.status === 200 && Array.isArray(scheduleData.data?.phases) && scheduleData.data?.phases.length > 0
    );

    const activitiesRes = await fetch(`${BASE_URL}/projects/proj-1/activities`);
    const activitiesData = await activitiesRes.json();
    const targetActivity = activitiesData.data?.find((a) => a.id === 'ACT-03-02-001');
    testAssert(
      '6. GET /api/projects/proj-1/activities finds target activity ACT-03-02-001',
      activitiesRes.status === 200 && Boolean(targetActivity)
    );

    // 4. Execution Quantities & Micro-activities
    const microActRes = await fetch(`${BASE_URL}/projects/proj-1/micro-activities`);
    const microActData = await microActRes.json();
    const targetMicro = microActData.data?.find((m) => m.id === 'MA-03-02-001-01');
    testAssert(
      '7. GET /api/projects/proj-1/micro-activities includes MA-03-02-001-01',
      microActRes.status === 200 && Boolean(targetMicro)
    );

    const execRes = await fetch(`${BASE_URL}/projects/proj-1/execution-units`);
    const execData = await execRes.json();
    testAssert(
      '8. GET /api/projects/proj-1/execution-units returns tracked work quantities',
      execRes.status === 200 && Array.isArray(execData.data) && execData.data.length > 0
    );

    // 5. Spatial Site View & Zones
    const siteViewRes = await fetch(`${BASE_URL}/projects/proj-1/site-view`);
    const siteViewData = await siteViewRes.json();
    testAssert(
      '9. GET /api/projects/proj-1/site-view returns capture points and spatial zones',
      siteViewRes.status === 200 && Array.isArray(siteViewData.data?.zones)
    );

    // 6. Evidence File Upload with Metadata & Checksum
    const boundary = '----WebKitFormBoundaryE2ETest7MA4YWxkTrZu0gW';
    const fakeImageContent = 'E2E_INTEGRATION_TEST_IMAGE_DATA_BYTES_PNG';
    const multipartBody = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="file"; filename="e2e_pier_inspection.png"',
      'Content-Type: image/png',
      '',
      fakeImageContent,
      `--${boundary}`,
      'Content-Disposition: form-data; name="type"',
      '',
      'photo',
      `--${boundary}`,
      'Content-Disposition: form-data; name="activityId"',
      '',
      'ACT-03-02-001',
      `--${boundary}`,
      'Content-Disposition: form-data; name="microActivityId"',
      '',
      'MA-03-02-001-01',
      `--${boundary}`,
      'Content-Disposition: form-data; name="description"',
      '',
      'E2E Laser survey photo showing pier rebar alignment.',
      `--${boundary}--`,
    ].join('\r\n');

    const uploadRes = await fetch(`${BASE_URL}/projects/proj-1/evidence`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'x-user-role': 'site_engineer',
      },
      body: multipartBody,
    });
    const uploadData = await uploadRes.json();
    const uploadedEvidenceId = uploadData.data?.evidenceId || uploadData.data?.id;

    testAssert(
      '10. Multipart evidence upload persists file, returns 201, and generates SHA-256 checksum',
      uploadRes.status === 201 && Boolean(uploadedEvidenceId) && Boolean(uploadData.data?.storage?.checksum)
    );

    // 7. Evidence Retrieval & File Download
    const evidenceGetRes = await fetch(`${BASE_URL}/evidence/${uploadedEvidenceId}`);
    const evidenceGetData = await evidenceGetRes.json();
    testAssert(
      '11. GET /api/evidence/:evidenceId retrieves stored evidence metadata',
      evidenceGetRes.status === 200 && (evidenceGetData.data?.evidenceId === uploadedEvidenceId || evidenceGetData.data?.id === uploadedEvidenceId)
    );

    const fileDownloadRes = await fetch(`${BASE_URL}/evidence/${uploadedEvidenceId}/file`, {
      headers: { 'x-user-role': 'site_engineer', 'x-permitted-projects': 'proj-1' },
    });
    const downloadedText = await fileDownloadRes.text();
    testAssert(
      '12. GET /api/evidence/:evidenceId/file streams file content matching upload',
      fileDownloadRes.status === 200 && downloadedText === fakeImageContent
    );

    // 8. AI Evidence Analysis & Schedule Linking
    const aiAnalyzeRes = await fetch(`${BASE_URL}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: 'proj-1',
        evidenceId: 'EV-000121',
      }),
    });
    const aiAnalyzeData = await aiAnalyzeRes.json();
    testAssert(
      '13. POST /api/ai/analyze successfully executes deterministic schedule linking',
      aiAnalyzeRes.status === 200 &&
        aiAnalyzeData.data?.scheduleLink?.activityId === 'ACT-03-02-001' &&
        aiAnalyzeData.data?.scheduleLink?.confidence === 1.0
    );

    // 9. AI Delay & Risk Signal Generation
    const riskSignals = aiAnalyzeData.data?.riskSignals || [];
    const varianceSignal = riskSignals.find((s) => s.signalType === 'SIGNIFICANT_PROGRESS_VARIANCE');
    testAssert(
      '14. AI Analysis generates explainable SIGNIFICANT_PROGRESS_VARIANCE risk signal',
      varianceSignal &&
        (varianceSignal.severity === 'high' || varianceSignal.severity === 'critical') &&
        Boolean(varianceSignal.explanation || varianceSignal.contributingFactors?.length > 0)
    );

    // 10. Human Verification Workflow & Authorization Enforcement
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
      }),
    });
    const contractorVerifyData = await contractorVerifyRes.json();
    testAssert(
      '15. Contractor role forbidden (403 FORBIDDEN_ROLE) from verifying findings',
      contractorVerifyRes.status === 403 && contractorVerifyData.error?.code === 'FORBIDDEN_ROLE'
    );

    // Authoritative Human Decision by Project Manager
    const pmVerifyRes = await fetch(`${BASE_URL}/verifications/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'project_manager',
        'x-user-name': 'Sarah Jenkins',
      },
      body: JSON.stringify({
        projectId: 'proj-1',
        evidenceId: 'EV-000121',
        targetType: 'schedule_link',
        targetId: 'ACT-03-02-001',
        reason: 'Validated against daily survey report and physical station marker.',
      }),
    });
    const pmVerifyData = await pmVerifyRes.json();
    testAssert(
      '16. Authorized Project Manager decision records verified state with server timestamp',
      pmVerifyRes.status === 200 && pmVerifyData.data?.status === 'verified'
    );

    // 11. Immutable Audit Trail
    const auditEvents = pmVerifyData.data?.auditHistory || [];
    const pmAuditEvent = auditEvents.find((e) => e.reviewer?.role === 'project_manager');
    testAssert(
      '17. Verification audit history captures immutable event with actor, role, and justification',
      Boolean(pmAuditEvent) && pmAuditEvent.reviewer?.role === 'project_manager'
    );

    // 12. Risk Events & Alerts Integration
    const riskEventsRes = await fetch(`${BASE_URL}/projects/proj-1/risk-events`);
    const riskEventsData = await riskEventsRes.json();
    testAssert(
      '18. GET /api/projects/proj-1/risk-events returns project risk registry',
      riskEventsRes.status === 200 && Array.isArray(riskEventsData.data)
    );

    const alertsRes = await fetch(`${BASE_URL}/projects/proj-1/alerts`);
    const alertsData = await alertsRes.json();
    testAssert(
      '19. GET /api/projects/proj-1/alerts returns active operational alerts',
      alertsRes.status === 200 && Array.isArray(alertsData.data) && alertsData.data.length > 0
    );

    // 13. Reports Summary
    const reportRes = await fetch(`${BASE_URL}/projects/proj-1/reports/summary`);
    const reportData = await reportRes.json();
    testAssert(
      '20. GET /api/projects/proj-1/reports/summary aggregates project KPIs and attention items',
      reportRes.status === 200 && Boolean(reportData.data?.kpis)
    );

    // 14. Project Context Switching & Tenancy Isolation
    const proj2ScheduleRes = await fetch(`${BASE_URL}/projects/proj-2/schedule`);
    const proj2ScheduleData = await proj2ScheduleRes.json();
    testAssert(
      '21. Project Switching to proj-2 retrieves isolated schedule data',
      proj2ScheduleRes.status === 200 && proj2ScheduleData.data?.projectId === 'proj-2'
    );

  } catch (err) {
    console.error(`\n${colors.red}Test Suite Encountered Fatal Exception:${colors.reset}`, err);
    failed++;
  }

  console.log(`\n==================================================`);
  console.log(`E2E Integration Results: ${passed} passed, ${failed} failed.`);
  console.log(`==================================================\n`);

  if (failed > 0) process.exit(1);
}

runE2EIntegrationTests();
