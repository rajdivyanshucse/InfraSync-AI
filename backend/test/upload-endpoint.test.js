/**
 * InfraSync AI HTTP File Upload & Download End-to-End Test Suite
 */

const BASE_URL = 'http://localhost:5000/api';

async function runUploadEndpointTests() {
  console.log('--- Starting HTTP Upload & Download End-to-End Tests ---');

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
    // 1. Upload a PNG evidence photo via multipart/form-data
    const testFileBlob = new Blob([Buffer.from('sample-png-image-binary-payload-data')], { type: 'image/png' });
    const formData = new FormData();
    formData.append('file', testFileBlob, 'test_pier_inspection.png');
    formData.append('title', 'Pier P4 Cage Ground Capture');
    formData.append('description', 'High resolution test capture');
    formData.append('evidenceType', 'PHOTO');
    formData.append('microActivityId', 'MA-03-02-001-01');

    const uploadRes = await fetch(`${BASE_URL}/projects/proj-1/evidence`, {
      method: 'POST',
      body: formData,
    });

    const uploadData = await uploadRes.json();
    testAssert('1. POST /api/projects/proj-1/evidence returns 201 Created', uploadRes.status === 201, `Got: ${uploadRes.status}`);
    testAssert('2. Upload response contains evidence ID and storage metadata', !!uploadData.data?.id && !!uploadData.data?.storage?.checksum);

    const createdEvidenceId = uploadData.data?.id;

    // 3. Retrieve metadata via GET /api/evidence/:evidenceId
    const metaRes = await fetch(`${BASE_URL}/evidence/${createdEvidenceId}`);
    const metaData = await metaRes.json();
    testAssert('3. GET /api/evidence/:evidenceId retrieves persisted metadata', metaRes.status === 200 && metaData.data?.id === createdEvidenceId);

    // 4. Download / Stream physical file via GET /api/evidence/:evidenceId/file
    const fileRes = await fetch(`${BASE_URL}/evidence/${createdEvidenceId}/file`);
    const fileContent = await fileRes.text();
    testAssert('4. GET /api/evidence/:evidenceId/file streams file with correct content', fileRes.status === 200 && fileContent === 'sample-png-image-binary-payload-data');
    testAssert('5. File headers include correct Content-Type and ETag checksum', fileRes.headers.get('content-type') === 'image/png' && !!fileRes.headers.get('etag'));

    // 6. Test retrieving prototype evidence without file (EV-000121)
    const protoFileRes = await fetch(`${BASE_URL}/evidence/EV-000121/file`);
    const protoFileData = await protoFileRes.json();
    testAssert('6. Prototype evidence without file returns EVIDENCE_FILE_NOT_AVAILABLE', protoFileRes.status === 404 && protoFileData.error?.code === 'EVIDENCE_FILE_NOT_AVAILABLE');

    // 7. Test invalid project ID upload
    const badProjectRes = await fetch(`${BASE_URL}/projects/non-existent-proj/evidence`, {
      method: 'POST',
      body: formData,
    });
    const badProjectData = await badProjectRes.json();
    testAssert('7. Upload to invalid project returns PROJECT_NOT_FOUND', badProjectRes.status === 404 && badProjectData.error?.code === 'PROJECT_NOT_FOUND');

  } catch (err) {
    console.error('❌ [FAIL] Error running upload endpoint tests:', err);
    failed++;
  }

  console.log(`\nUpload Endpoint Results: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runUploadEndpointTests();
