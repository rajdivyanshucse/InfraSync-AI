/**
 * InfraSync AI — Idempotent Database Seeder
 * Populates MongoDB from existing prototype datasets.
 */

import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { Project, Schedule, Execution, Evidence, SiteView, RiskEvent, Alert } from '../models/index.js';
import { projectsData } from '../data/projects.data.js';
import { schedulesData } from '../data/schedules.data.js';
import { executionsData } from '../data/executions.data.js';
import { evidencesData } from '../data/evidences.data.js';
import { siteViewsData } from '../data/siteViews.data.js';
import { risksData } from '../data/risks.data.js';
import { alertsData } from '../data/alerts.data.js';

export async function seedDatabase(customUri = null) {
  const uri = customUri || config.mongodbUri;
  console.log(`[Seed] Connecting to MongoDB for seeding: ${config.mongodbDbName}...`);

  try {
    await mongoose.connect(uri, {
      dbName: config.mongodbDbName,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('[Seed] Database connected.');

    // 1. Seed Projects
    console.log('[Seed] Seeding projects...');
    for (const p of projectsData) {
      await Project.findOneAndUpdate({ id: p.id }, p, { upsert: true, new: true });
    }
    console.log(`[Seed] Seeded ${projectsData.length} projects.`);

    // 2. Seed Schedules
    console.log('[Seed] Seeding schedules...');
    const scheduleEntries = Object.values(schedulesData);
    for (const s of scheduleEntries) {
      await Schedule.findOneAndUpdate({ projectId: s.projectId }, s, { upsert: true, new: true });
    }
    console.log(`[Seed] Seeded ${scheduleEntries.length} schedules.`);

    // 3. Seed Executions
    console.log('[Seed] Seeding executions...');
    const executionEntries = Object.values(executionsData);
    for (const e of executionEntries) {
      await Execution.findOneAndUpdate({ projectId: e.projectId }, e, { upsert: true, new: true });
    }
    console.log(`[Seed] Seeded ${executionEntries.length} executions.`);

    // 4. Seed Evidences
    console.log('[Seed] Seeding evidences...');
    for (const ev of evidencesData) {
      await Evidence.findOneAndUpdate({ id: ev.id }, ev, { upsert: true, new: true });
    }
    console.log(`[Seed] Seeded ${evidencesData.length} evidence records.`);

    // 5. Seed Site Views
    console.log('[Seed] Seeding site views...');
    const siteViewEntries = Object.values(siteViewsData);
    for (const sv of siteViewEntries) {
      await SiteView.findOneAndUpdate({ projectId: sv.projectId }, sv, { upsert: true, new: true });
    }
    console.log(`[Seed] Seeded ${siteViewEntries.length} site view records.`);

    // 6. Seed Risk Events
    console.log('[Seed] Seeding risk events...');
    let riskCount = 0;
    for (const projId of Object.keys(risksData)) {
      const risks = risksData[projId] || [];
      for (const r of risks) {
        await RiskEvent.findOneAndUpdate({ id: r.id }, r, { upsert: true, new: true });
        riskCount++;
      }
    }
    console.log(`[Seed] Seeded ${riskCount} risk events.`);

    // 7. Seed Alerts
    console.log('[Seed] Seeding alerts...');
    for (const alt of alertsData) {
      await Alert.findOneAndUpdate({ id: alt.id }, alt, { upsert: true, new: true });
    }
    console.log(`[Seed] Seeded ${alertsData.length} alerts.`);

    console.log('✅ [Seed] Database seeding completed successfully.');
  } catch (err) {
    console.error('❌ [Seed] Error seeding database:', err.message);
    throw err;
  } finally {
    if (!customUri) {
      await mongoose.disconnect();
      console.log('[Seed] Disconnected from MongoDB.');
    }
  }
}

// Run directly if invoked from CLI
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
