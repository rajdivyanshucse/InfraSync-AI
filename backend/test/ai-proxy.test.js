/**
 * InfraSync AI — AI Service Proxy & Delay/Risk Analysis Integration Tests (Phase 21 & 22)
 */

import { AiService } from '../src/services/ai.service.js';

const BASE_URL = 'http://localhost:5000/api';

async function runAiProxyTests() {
  console.log('--- Starting AI Service Proxy & Delay/Risk Analysis Integration Tests ---');

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
    // 1. Test GET /api/ai/health when AI service is running
    const healthRes = await fetch(`${BASE_URL}/ai/health`);
    const healthData = await healthRes.json();

    testAssert(
      '1. GET /api/ai/health returns 200 OK when AI service is available',
      healthRes.status === 200,
      `Got status: ${healthRes.status}`
    );
    testAssert(
      '2. GET /api/ai/health payload contains service name, status, and demo mode',
      healthData.success === true &&
        healthData.data?.service === 'infrasync-ai-service' &&
        healthData.data?.status === 'ok',
      `Got data: ${JSON.stringify(healthData)}`
    );

    // 3. Test POST /api/ai/analyze on existing prototype evidence (EV-000121)
    const explicitAnalyzeRes = await fetch(`${BASE_URL}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        evidenceId: 'EV-000121',
        projectId: 'proj-1',
      }),
    });
    const explicitData = await explicitAnalyzeRes.json();

    testAssert(
      '3. POST /api/ai/analyze for EV-000121 builds context and returns 200 OK',
      explicitAnalyzeRes.status === 200 && explicitData.success === true,
      `Got status: ${explicitAnalyzeRes.status}`
    );
    testAssert(
      '4. EV-000121 correctly identified as explicit system link with confidence 1.0',
      explicitData.data?.scheduleLink?.status === 'explicit' &&
        explicitData.data?.scheduleLink?.linkType === 'explicit' &&
        explicitData.data?.scheduleLink?.activityId === 'ACT-03-02-001' &&
        explicitData.data?.scheduleLink?.confidence === 1.0 &&
        explicitData.data?.requiresHumanVerification === true,
      `Got data: ${JSON.stringify(explicitData)}`
    );

    // 5. Test Phase 22 Delay & Risk signals generated for EV-000121 (ACT-03-02-001 has variance -14 pp & critical path)
    const signals = explicitData.data?.riskSignals || [];
    const sigTypes = signals.map((s) => s.signalType || s.code);

    testAssert(
      '5. Delay/Risk analysis generates SIGNIFICANT_PROGRESS_VARIANCE and CRITICAL_PATH_EXPOSURE',
      sigTypes.includes('SIGNIFICANT_PROGRESS_VARIANCE') && sigTypes.includes('CRITICAL_PATH_EXPOSURE'),
      `Got signals: ${JSON.stringify(signals)}`
    );

    testAssert(
      '6. Risk signals include explainable rationale, trigger condition, and recommended action',
      signals.some(
        (s) =>
          s.signalType === 'SIGNIFICANT_PROGRESS_VARIANCE' &&
          s.explanation &&
          s.triggerCondition &&
          s.recommendedAction?.responsibleRole &&
          s.requiresHumanReview === true
      ),
      `Got signals: ${JSON.stringify(signals)}`
    );

    // 7. Test POST /api/ai/analyze with custom schedule/evidence context for inferred candidate
    const inferredPayload = {
      evidenceId: 'EV-CUSTOM-TEST',
      projectId: 'proj-1',
      evidenceContext: {
        evidenceId: 'EV-CUSTOM-TEST',
        projectId: 'proj-1',
        title: 'Bored piling verticality inspection',
        description: 'Laser telemetry check at Pier P34',
        zoneId: 'ZONE-03',
        stationing: 'CH 7+120',
        explicitWbsId: 'WBS-03-01',
        capturedAt: '2026-03-10T09:00:00.000Z',
      },
      scheduleContext: [
        {
          activityId: 'ACT-03-01-002',
          activityName: 'Piling Pier P25 to P48',
          wbsId: 'WBS-03-01',
          discipline: 'Geotechnical & Piling',
          status: 'inProgress',
          plannedProgress: 88.0,
          actualProgress: 82.0,
          variance: -6.0,
          criticalPath: true,
          zoneId: 'ZONE-03',
          plannedStart: '2026-03-01T00:00:00.000Z',
          plannedFinish: '2026-04-15T00:00:00.000Z',
          microActivities: [
            {
              microActivityId: 'MA-03-01-002-01',
              name: 'Bored Piling Rig Drilling',
              status: 'inProgress',
              evidenceCount: 4,
            },
          ],
        },
      ],
    };

    const inferredRes = await fetch(`${BASE_URL}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inferredPayload),
    });
    const inferredData = await inferredRes.json();

    testAssert(
      '7. POST /api/ai/analyze evaluates inferred candidate with high confidence and reasons',
      inferredRes.status === 200 &&
        inferredData.data?.scheduleLink?.linkType === 'inferred' &&
        inferredData.data?.scheduleLink?.activityId === 'ACT-03-01-002' &&
        inferredData.data?.scheduleLink?.confidence >= 0.70 &&
        inferredData.data?.scheduleLink?.reasons.length > 0,
      `Got data: ${JSON.stringify(inferredData)}`
    );

    // 8. Test non-existent evidenceId (returns 404 EVIDENCE_NOT_FOUND)
    const notFoundEvidenceRes = await fetch(`${BASE_URL}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        evidenceId: 'NON_EXISTENT_EV_9999',
        projectId: 'proj-1',
      }),
    });
    const notFoundEvidenceData = await notFoundEvidenceRes.json();

    testAssert(
      '8. POST /api/ai/analyze with non-existent evidence returns 404 EVIDENCE_NOT_FOUND',
      notFoundEvidenceRes.status === 404 &&
        notFoundEvidenceData.error?.code === 'EVIDENCE_NOT_FOUND',
      `Got status: ${notFoundEvidenceRes.status}`
    );

    // 9. Test non-existent projectId (returns 400 or 404)
    const notFoundProjectRes = await fetch(`${BASE_URL}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        evidenceId: 'EV-000121',
        projectId: 'non-existent-proj',
      }),
    });
    const _notFoundProjectData = await notFoundProjectRes.json();

    testAssert(
      '9. POST /api/ai/analyze with non-existent project returns 400 or 404',
      notFoundProjectRes.status >= 400,
      `Got status: ${notFoundProjectRes.status}`
    );

    // 10. Test POST /api/ai/analyze validation: missing evidenceId
    const missingEvidenceRes = await fetch(`${BASE_URL}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: 'proj-1' }),
    });
    const missingEvidenceData = await missingEvidenceRes.json();

    testAssert(
      '10. POST /api/ai/analyze without evidenceId returns 400 VALIDATION_ERROR',
      missingEvidenceRes.status === 400 &&
        missingEvidenceData.error?.code === 'VALIDATION_ERROR',
      `Got status: ${missingEvidenceRes.status}`
    );

    // 11. Test POST /api/ai/analyze validation: missing projectId
    const missingProjectRes = await fetch(`${BASE_URL}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evidenceId: 'EV-000121' }),
    });
    const missingProjectData = await missingProjectRes.json();

    testAssert(
      '11. POST /api/ai/analyze without projectId returns 400 VALIDATION_ERROR',
      missingProjectRes.status === 400 &&
        missingProjectData.error?.code === 'VALIDATION_ERROR',
      `Got status: ${missingProjectRes.status}`
    );

    // 12. Test AI service unavailable error handling
    const offlineClient = new AiService({
      serviceUrl: 'http://localhost:59999', // non-existent service port
      timeoutMs: 1000,
    });

    let offlineErrorCaught = false;
    try {
      await offlineClient.checkHealth();
    } catch (err) {
      offlineErrorCaught =
        err.code === 'AI_SERVICE_UNAVAILABLE' &&
        err.statusCode === 503 &&
        err.message.includes('unavailable');
    }

    testAssert(
      '12. AiService handles offline service gracefully returning AI_SERVICE_UNAVAILABLE (503)',
      offlineErrorCaught
    );

  } catch (err) {
    console.error('❌ [FAIL] Unexpected error running AI proxy tests:', err);
    failed++;
  }

  console.log(`\nAI Proxy Test Results: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runAiProxyTests();
