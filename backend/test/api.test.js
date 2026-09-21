/**
 * InfraSync AI REST API & Repository Smoke Test Suite
 */

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5000/api';

export async function runTests() {
  console.log(`--- Starting API Smoke Tests against ${BASE_URL} ---`);

  const tests = [
    { name: 'GET /api/health', url: `${BASE_URL}/health`, expectStatus: 200, validate: (res) => res.data.status === 'ok' && !!res.data.database },
    { name: 'GET /api/projects', url: `${BASE_URL}/projects`, expectStatus: 200, validate: (res) => Array.isArray(res.data) && res.data.length > 0 },
    { name: 'GET /api/projects/proj-1', url: `${BASE_URL}/projects/proj-1`, expectStatus: 200, validate: (res) => res.data.id === 'proj-1' },
    { name: 'GET /api/projects/proj-1/schedule', url: `${BASE_URL}/projects/proj-1/schedule`, expectStatus: 200, validate: (res) => res.data.projectId === 'proj-1' },
    { name: 'GET /api/projects/proj-1/activities', url: `${BASE_URL}/projects/proj-1/activities`, expectStatus: 200, validate: (res) => Array.isArray(res.data) },
    { name: 'GET /api/projects/proj-1/milestones', url: `${BASE_URL}/projects/proj-1/milestones`, expectStatus: 200, validate: (res) => Array.isArray(res.data) },
    { name: 'GET /api/projects/proj-1/execution', url: `${BASE_URL}/projects/proj-1/execution`, expectStatus: 200, validate: (res) => !!res.data.summary },
    { name: 'GET /api/projects/proj-1/micro-activities', url: `${BASE_URL}/projects/proj-1/micro-activities`, expectStatus: 200, validate: (res) => Array.isArray(res.data) },
    { name: 'GET /api/projects/proj-1/execution-units', url: `${BASE_URL}/projects/proj-1/execution-units`, expectStatus: 200, validate: (res) => Array.isArray(res.data) },
    { name: 'GET /api/projects/proj-1/evidence', url: `${BASE_URL}/projects/proj-1/evidence`, expectStatus: 200, validate: (res) => Array.isArray(res.data) },
    { name: 'GET /api/evidence/EV-000121', url: `${BASE_URL}/evidence/EV-000121`, expectStatus: 200, validate: (res) => res.data.id === 'EV-000121' },
    { name: 'GET /api/projects/proj-1/site-view', url: `${BASE_URL}/projects/proj-1/site-view`, expectStatus: 200, validate: (res) => Array.isArray(res.data.zones) },
    { name: 'GET /api/projects/proj-1/zones', url: `${BASE_URL}/projects/proj-1/zones`, expectStatus: 200, validate: (res) => Array.isArray(res.data) },
    { name: 'GET /api/projects/proj-1/capture-points', url: `${BASE_URL}/projects/proj-1/capture-points`, expectStatus: 200, validate: (res) => Array.isArray(res.data) },
    { name: 'GET /api/projects/proj-1/risk-events', url: `${BASE_URL}/projects/proj-1/risk-events`, expectStatus: 200, validate: (res) => Array.isArray(res.data) },
    { name: 'GET /api/projects/proj-1/alerts', url: `${BASE_URL}/projects/proj-1/alerts`, expectStatus: 200, validate: (res) => Array.isArray(res.data) },
    { name: 'GET /api/alerts/ALT-0001', url: `${BASE_URL}/alerts/ALT-0001`, expectStatus: 200, validate: (res) => res.data.id === 'ALT-0001' },
    { name: 'GET /api/projects/proj-1/reports/summary', url: `${BASE_URL}/projects/proj-1/reports/summary`, expectStatus: 200, validate: (res) => !!res.data.kpis },
    { name: 'GET 404 on invalid project', url: `${BASE_URL}/projects/non-existent`, expectStatus: 404, validate: (res) => res.success === false && res.error.code === 'PROJECT_NOT_FOUND' },
  ];

  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    try {
      const response = await fetch(t.url);
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

  console.log(`\nResults: ${passed} passed, ${failed} failed out of ${tests.length} tests.`);
  if (failed > 0) process.exit(1);
  return { passed, failed, total: tests.length };
}

if (process.argv[1]?.endsWith('api.test.js')) {
  runTests();
}
