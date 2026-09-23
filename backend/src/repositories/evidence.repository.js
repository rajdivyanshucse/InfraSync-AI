import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { Evidence } from '../models/Evidence.js';
import { evidencesData } from '../data/evidences.data.js';

export class EvidenceRepository {
  async findByProjectId(projectId) {
    if (config.dataSource === 'mongodb' && mongoose.connection.readyState === 1) {
      const docs = await Evidence.find({ projectId }).lean();
      return docs.map(this._cleanDoc);
    }
    return evidencesData.filter((e) => e.projectId === projectId);
  }

  async findById(evidenceId) {
    if (config.dataSource === 'mongodb' && mongoose.connection.readyState === 1) {
      const doc = await Evidence.findOne({ id: evidenceId }).lean();
      return doc ? this._cleanDoc(doc) : null;
    }
    return evidencesData.find((e) => e.id === evidenceId) || null;
  }

  async create(evidencePayload) {
    if (config.dataSource === 'mongodb' && mongoose.connection.readyState === 1) {
      const doc = await Evidence.create(evidencePayload);
      return this._cleanDoc(doc.toObject ? doc.toObject() : doc);
    }
    evidencesData.push(evidencePayload);
    return evidencePayload;
  }

  async update(evidenceId, updates) {
    if (config.dataSource === 'mongodb' && mongoose.connection.readyState === 1) {
      const doc = await Evidence.findOneAndUpdate(
        { id: evidenceId },
        { $set: updates },
        { new: true, runValidators: true }
      ).lean();
      return doc ? this._cleanDoc(doc) : null;
    }

    const index = evidencesData.findIndex((e) => e.id === evidenceId);
    if (index === -1) return null;
    evidencesData[index] = {
      ...evidencesData[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return evidencesData[index];
  }

  _cleanDoc(doc) {
    if (!doc) return null;
    const { _id, __v, ...rest } = doc;
    return rest;
  }
}

export const evidenceRepository = new EvidenceRepository();
