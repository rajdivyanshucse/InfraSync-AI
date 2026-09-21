/**
 * InfraSync AI Mongoose Models Unit & Validation Test
 */

import { Project, Schedule, Execution, Evidence, SiteView, RiskEvent, Alert } from '../src/models/index.js';
import { projectsData } from '../src/data/projects.data.js';
import { schedulesData } from '../src/data/schedules.data.js';
import { executionsData } from '../src/data/executions.data.js';
import { evidencesData } from '../src/data/evidences.data.js';
import { siteViewsData } from '../src/data/siteViews.data.js';
import { risksData } from '../src/data/risks.data.js';
import { alertsData } from '../src/data/alerts.data.js';

async function testModels() {
  console.log('--- Testing Mongoose Schema Validations & Models ---');

  // Test Project Model Validation
  const sampleProject = new Project(projectsData[0]);
  const projectValidationErr = sampleProject.validateSync();
  if (projectValidationErr) {
    console.error('❌ Project model validation error:', projectValidationErr);
    process.exit(1);
  }
  console.log('✅ Project model validation passed.');

  // Test Schedule Model Validation
  const sampleSchedule = new Schedule(schedulesData['proj-1']);
  const scheduleValidationErr = sampleSchedule.validateSync();
  if (scheduleValidationErr) {
    console.error('❌ Schedule model validation error:', scheduleValidationErr);
    process.exit(1);
  }
  console.log('✅ Schedule model validation passed.');

  // Test Execution Model Validation
  const sampleExecution = new Execution(executionsData['proj-1']);
  const executionValidationErr = sampleExecution.validateSync();
  if (executionValidationErr) {
    console.error('❌ Execution model validation error:', executionValidationErr);
    process.exit(1);
  }
  console.log('✅ Execution model validation passed.');

  // Test Evidence Model Validation
  const sampleEvidence = new Evidence(evidencesData[0]);
  const evidenceValidationErr = sampleEvidence.validateSync();
  if (evidenceValidationErr) {
    console.error('❌ Evidence model validation error:', evidenceValidationErr);
    process.exit(1);
  }
  console.log('✅ Evidence model validation passed.');

  // Test SiteView Model Validation
  const sampleSiteView = new SiteView(siteViewsData['proj-1']);
  const siteViewValidationErr = sampleSiteView.validateSync();
  if (siteViewValidationErr) {
    console.error('❌ SiteView model validation error:', siteViewValidationErr);
    process.exit(1);
  }
  console.log('✅ SiteView model validation passed.');

  // Test RiskEvent Model Validation
  const sampleRiskEvent = new RiskEvent(risksData['proj-1'][0]);
  const riskValidationErr = sampleRiskEvent.validateSync();
  if (riskValidationErr) {
    console.error('❌ RiskEvent model validation error:', riskValidationErr);
    process.exit(1);
  }
  console.log('✅ RiskEvent model validation passed.');

  // Test Alert Model Validation
  const sampleAlert = new Alert(alertsData[0]);
  const alertValidationErr = sampleAlert.validateSync();
  if (alertValidationErr) {
    console.error('❌ Alert model validation error:', alertValidationErr);
    process.exit(1);
  }
  console.log('✅ Alert model validation passed.');

  // Test JSON transformation helper (removes _id, __v)
  const jsonOutput = sampleProject.toJSON();
  if (jsonOutput._id || jsonOutput.__v) {
    console.error('❌ toJSON transformation failed to omit _id/__v');
    process.exit(1);
  }
  console.log('✅ Model toJSON projection transform passed.');

  console.log('--- All Mongoose Model Unit Tests Passed! ---');
}

testModels();
