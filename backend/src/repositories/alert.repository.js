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

  _cleanDoc(doc) {
    if (!doc) return null;
    const { _id, __v, ...rest } = doc;
    return rest;
  }
}

export const alertRepository = new AlertRepository();
