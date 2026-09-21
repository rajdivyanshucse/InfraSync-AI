/**
 * InfraSync AI — Human Verification & Audit Workflow Integration Tests (Phase 23)
 */

const BASE_URL = 'http://localhost:5000/api';

async function runVerificationTests() {
  console.log('--- Starting Human Verification & Audit Workflow Integration Tests ---');

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
    // 1. GET /api/projects/proj-1/verifications returns 200 and array of verifications
    const listRes = await fetch(`${BASE_URL}/projects/proj-1/verifications`);
    const listData = await listRes.json();

    testAssert(
      '1. GET /api/projects/proj-1/verifications returns 200 OK and list of verifications',
      listRes.status === 200 && Array.isArray(listData.data) && listData.data.length >= 2,
      `Got data: ${JSON.stringify(listData)}`
    );

    // 2. GET /api/verifications/VER-001 retrieves single record with audit trail
    const singleRes = await fetch(`${BASE_URL}/verifications/VER-001`);
    const singleData = await singleRes.json();

    testAssert(
      '2. GET /api/verifications/VER-001 retrieves record with populated audit history',
      singleRes.status === 200 &&
        singleData.data?.verificationId === 'VER-001' &&
        singleData.data?.status === 'verified' &&
        Array.isArray(singleData.data?.auditHistory) &&
        singleData.data?.auditHistory.length >= 2,
      `Got data: ${JSON.stringify(singleData)}`
    );

    // 3. POST /api/verifications/verify allows Project Manager to verify schedule candidate
    const verifyPayload = {
      projectId: 'proj-1',
      evidenceId: 'EV-000122',
      targetType: 'schedule_link',
      targetId: 'ACT-03-01-002',
      reason: 'Confirmed laser telemetry and piling log on site with inspection team.',
      sourceAnalysisId: 'ANA-TEST-001',
      reviewer: {
        userId: 'USR-PM-01',
        name: 'Sarah Jenkins',
        role: 'project_manager',
      },
      candidateContext: {
        activityId: 'ACT-03-01-002',
        confidence: 0.86,
        linkType: 'inferred',
      },
    };

    const verifyRes = await fetch(`${BASE_URL}/verifications/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(verifyPayload),
    });
    const verifyData = await verifyRes.json();

    testAssert(
      '3. POST /api/verifications/verify allows authorized PM to verify schedule candidate',
      verifyRes.status === 200 &&
        verifyData.data?.status === 'verified' &&
        verifyData.data?.decision === 'verified' &&
        verifyData.data?.reviewer?.role === 'project_manager',
      `Got data: ${JSON.stringify(verifyData)}`
    );

    // 4. Verify that the newly verified record contains immutable audit event
    const auditEvents = verifyData.data?.auditHistory || [];
    const verifyEvent = auditEvents.find((e) => e.action === 'VERIFY');

    testAssert(
      '4. Verification record captures immutable audit event with actor, timestamp, and justification',
      verifyEvent &&
        verifyEvent.reviewer?.role === 'project_manager' &&
        verifyEvent.reason.includes('Confirmed laser telemetry') &&
        verifyEvent.newStatus === 'verified',
      `Got audit events: ${JSON.stringify(auditEvents)}`
    );

    // 5. POST /api/verifications/reject allows Site Engineer to reject a candidate
    const rejectPayload = {
      projectId: 'proj-1',
      evidenceId: 'EV-000121',
      targetType: 'risk_signal',
      targetId: 'SIGNIFICANT_PROGRESS_VARIANCE',
      reason: 'Progress recovered in today shift; re-survey indicates on-track status.',
      sourceAnalysisId: 'ANA-9366B5FA',
      reviewer: {
        userId: 'USR-SE-02',
        name: 'Carlos Mendez',
        role: 'site_engineer',
      },
    };

    const rejectRes = await fetch(`${BASE_URL}/verifications/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rejectPayload),
    });
    const rejectData = await rejectRes.json();

    testAssert(
      '5. POST /api/verifications/reject allows Site Engineer to reject a risk signal finding',
      rejectRes.status === 200 &&
        rejectData.data?.status === 'rejected' &&
        rejectData.data?.decision === 'rejected' &&
        rejectData.data?.reviewer?.role === 'site_engineer',
      `Got data: ${JSON.stringify(rejectData)}`
    );

    // 6. Test multiple decisions preserve complete append-only history (Override test)
    const overridePayload = {
      projectId: 'proj-1',
      evidenceId: 'EV-000121',
      targetType: 'risk_signal',
      targetId: 'SIGNIFICANT_PROGRESS_VARIANCE',
      reason: 'Re-opening risk: contractor failed concrete test specimen B4.',
      reviewer: {
        userId: 'USR-PM-01',
        name: 'Sarah Jenkins',
        role: 'project_manager',
      },
    };

    const overrideRes = await fetch(`${BASE_URL}/verifications/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(overridePayload),
    });
    const overrideData = await overrideRes.json();

    testAssert(
      '6. Multiple human decisions append new audit records without destroying previous history',
      overrideRes.status === 200 &&
        overrideData.data?.status === 'verified' &&
        overrideData.data?.auditHistory?.length >= 3,
      `Audit count: ${overrideData.data?.auditHistory?.length}, History: ${JSON.stringify(overrideData.data?.auditHistory)}`
    );

    // 7. Test unauthorized role (contractor) is forbidden from verifying
    const contractorPayload = {
      projectId: 'proj-1',
      evidenceId: 'EV-000121',
      targetType: 'schedule_link',
      targetId: 'ACT-03-02-001',
      reason: 'Contractor trying to verify own work.',
      reviewer: {
        userId: 'USR-CTR-01',
        name: 'Apex Structural',
        role: 'contractor',
      },
    };

    const contractorRes = await fetch(`${BASE_URL}/verifications/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contractorPayload),
    });
    const contractorData = await contractorRes.json();

    testAssert(
      '7. Contractor role is forbidden (403 FORBIDDEN_ROLE) from verifying authoritative findings',
      contractorRes.status === 403 && contractorData.error?.code === 'FORBIDDEN_ROLE',
      `Got status: ${contractorRes.status}, data: ${JSON.stringify(contractorData)}`
    );

    // 8. Test missing reason string returns 400 MISSING_REASON
    const missingReasonRes = await fetch(`${BASE_URL}/verifications/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: 'proj-1',
        evidenceId: 'EV-000121',
        targetType: 'schedule_link',
        targetId: 'ACT-03-02-001',
        reason: '   ', // blank
        reviewer: { role: 'project_manager' },
      }),
    });
    const missingReasonData = await missingReasonRes.json();

    testAssert(
      '8. Missing or whitespace-only reason returns 400 MISSING_REASON',
      missingReasonRes.status === 400 && missingReasonData.error?.code === 'MISSING_REASON',
      `Got status: ${missingReasonRes.status}, data: ${JSON.stringify(missingReasonData)}`
    );

    // 9. Test missing required fields returns 400 VALIDATION_ERROR
    const missingFieldsRes = await fetch(`${BASE_URL}/verifications/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: 'proj-1',
        reason: 'Missing evidence and target',
      }),
    });
    const missingFieldsData = await missingFieldsRes.json();

    testAssert(
      '9. Missing required fields returns 400 VALIDATION_ERROR',
      missingFieldsRes.status === 400 && missingFieldsData.error?.code === 'VALIDATION_ERROR',
      `Got status: ${missingFieldsRes.status}, data: ${JSON.stringify(missingFieldsData)}`
    );

    // 10. Test invalid targetType returns 400 INVALID_TARGET_TYPE
    const invalidTargetTypeRes = await fetch(`${BASE_URL}/verifications/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: 'proj-1',
        evidenceId: 'EV-000121',
        targetType: 'unsupported_type',
        targetId: 'XYZ',
        reason: 'Valid reason here',
        reviewer: { role: 'project_manager' },
      }),
    });
    const invalidTargetTypeData = await invalidTargetTypeRes.json();

    testAssert(
      '10. Invalid targetType returns 400 INVALID_TARGET_TYPE',
      invalidTargetTypeRes.status === 400 && invalidTargetTypeData.error?.code === 'INVALID_TARGET_TYPE',
      `Got status: ${invalidTargetTypeRes.status}`
    );

    // 11. Test non-existent project returns 404 PROJECT_NOT_FOUND
    const notFoundProjRes = await fetch(`${BASE_URL}/verifications/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: 'non-existent-proj',
        evidenceId: 'EV-000121',
        targetType: 'schedule_link',
        targetId: 'ACT-03-02-001',
        reason: 'Valid reason',
        reviewer: { role: 'project_manager' },
      }),
    });
    const notFoundProjData = await notFoundProjRes.json();

    testAssert(
      '11. Non-existent project returns 404 PROJECT_NOT_FOUND',
      notFoundProjRes.status === 404 && notFoundProjData.error?.code === 'PROJECT_NOT_FOUND',
      `Got status: ${notFoundProjRes.status}`
    );

    // 12. Test non-existent verificationId returns 404 VERIFICATION_NOT_FOUND
    const notFoundVerRes = await fetch(`${BASE_URL}/verifications/NON-EXISTENT-ID`);
    const notFoundVerData = await notFoundVerRes.json();

    testAssert(
      '12. Non-existent verificationId returns 404 VERIFICATION_NOT_FOUND',
      notFoundVerRes.status === 404 && notFoundVerData.error?.code === 'VERIFICATION_NOT_FOUND',
      `Got status: ${notFoundVerRes.status}`
    );

    // 13. Test parameterized route POST /api/verifications/:targetType/:targetId/verify
    const paramVerifyRes = await fetch(`${BASE_URL}/verifications/schedule_link/ACT-03-01-002/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: 'proj-1',
        evidenceId: 'EV-000122',
        reason: 'Verified through parameterized route endpoint.',
        reviewer: { role: 'project_authority', name: 'Director General' },
      }),
    });
    const paramVerifyData = await paramVerifyRes.json();

    testAssert(
      '13. Parameterized endpoint /verifications/:targetType/:targetId/verify executes successfully',
      paramVerifyRes.status === 200 && paramVerifyData.data?.status === 'verified',
      `Got status: ${paramVerifyRes.status}`
    );
  } catch (err) {
    console.error('❌ [FAIL] Unexpected error running verification tests:', err);
    failed++;
  }

  console.log(`\nVerification Test Results: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runVerificationTests();
