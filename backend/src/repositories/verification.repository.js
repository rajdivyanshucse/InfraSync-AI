import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { Verification } from '../models/Verification.js';
import { verificationsData } from '../data/verifications.data.js';

export class VerificationRepository {
  async findByProjectId(projectId, filters = {}) {
    if (config.dataSource === 'mongodb' && mongoose.connection.readyState === 1) {
      const query = { projectId };
      if (filters.status) query.status = filters.status;
      if (filters.targetType) query.targetType = filters.targetType;
      if (filters.evidenceId) query.evidenceId = filters.evidenceId;

      const docs = await Verification.find(query).sort({ updatedAt: -1 }).lean();
      return docs.map(this._cleanDoc);
    }

    let results = verificationsData.filter((v) => v.projectId === projectId);
    if (filters.status) {
      results = results.filter((v) => v.status === filters.status);
    }
    if (filters.targetType) {
      results = results.filter((v) => v.targetType === filters.targetType);
    }
    if (filters.evidenceId) {
      results = results.filter((v) => v.evidenceId === filters.evidenceId);
    }
    return results;
  }

  async findById(verificationId) {
    if (config.dataSource === 'mongodb' && mongoose.connection.readyState === 1) {
      const doc = await Verification.findOne({ verificationId }).lean();
      return doc ? this._cleanDoc(doc) : null;
    }
    return verificationsData.find((v) => v.verificationId === verificationId) || null;
  }

  async findByTarget(projectId, evidenceId, targetType, targetId) {
    if (config.dataSource === 'mongodb' && mongoose.connection.readyState === 1) {
      const doc = await Verification.findOne({
        projectId,
        evidenceId,
        targetType,
        targetId,
      }).lean();
      return doc ? this._cleanDoc(doc) : null;
    }
    return (
      verificationsData.find(
        (v) =>
          v.projectId === projectId &&
          v.evidenceId === evidenceId &&
          v.targetType === targetType &&
          v.targetId === targetId
      ) || null
    );
  }

  async create(payload) {
    if (config.dataSource === 'mongodb' && mongoose.connection.readyState === 1) {
      const doc = await Verification.create(payload);
      return this._cleanDoc(doc.toObject ? doc.toObject() : doc);
    }
    verificationsData.unshift(payload);
    return payload;
  }

  async update(verificationId, updates) {
    if (config.dataSource === 'mongodb' && mongoose.connection.readyState === 1) {
      const doc = await Verification.findOneAndUpdate(
        { verificationId },
        { $set: updates },
        { new: true, runValidators: true }
      ).lean();
      return doc ? this._cleanDoc(doc) : null;
    }

    const index = verificationsData.findIndex((v) => v.verificationId === verificationId);
    if (index === -1) return null;
    verificationsData[index] = {
      ...verificationsData[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return verificationsData[index];
  }

  _cleanDoc(doc) {
    if (!doc) return null;
    const { _id, __v, ...rest } = doc;
    return rest;
  }
}

export const verificationRepository = new VerificationRepository();
export default verificationRepository;
