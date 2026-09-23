import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { Alert } from '../models/Alert.js';
import { alertsData } from '../data/alerts.data.js';

export class AlertRepository {
  async findByProjectId(projectId) {
    if (config.dataSource === 'mongodb' && mongoose.connection.readyState === 1) {
      const docs = await Alert.find({ projectId }).lean();
      return docs.map(this._cleanDoc);
    }
    return alertsData.filter((a) => a.projectId === projectId);
  }

  async findById(alertId) {
    if (config.dataSource === 'mongodb' && mongoose.connection.readyState === 1) {
      const doc = await Alert.findOne({ id: alertId }).lean();
      return doc ? this._cleanDoc(doc) : null;
    }
    return alertsData.find((a) => a.id === alertId) || null;
  }

  async create(alertPayload) {
    if (config.dataSource === 'mongodb' && mongoose.connection.readyState === 1) {
      const doc = await Alert.create(alertPayload);
      return this._cleanDoc(doc.toObject ? doc.toObject() : doc);
    }
    alertsData.unshift(alertPayload);
    return alertPayload;
  }

  async update(alertId, updates) {
    if (config.dataSource === 'mongodb' && mongoose.connection.readyState === 1) {
      const doc = await Alert.findOneAndUpdate(
        { id: alertId },
        { $set: updates },
        { new: true, runValidators: true }
      ).lean();
      return doc ? this._cleanDoc(doc) : null;
    }

    const index = alertsData.findIndex((a) => a.id === alertId);
    if (index === -1) return null;
    alertsData[index] = {
      ...alertsData[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return alertsData[index];
  }

  _cleanDoc(doc) {
    if (!doc) return null;
    const { _id, __v, ...rest } = doc;
    return rest;
  }
}

export const alertRepository = new AlertRepository();
