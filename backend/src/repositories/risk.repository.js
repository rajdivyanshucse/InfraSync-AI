import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { RiskEvent } from '../models/RiskEvent.js';
import { risksData } from '../data/risks.data.js';

export class RiskRepository {
  async getRiskEventsByProjectId(projectId) {
    if (config.dataSource === 'mongodb' && mongoose.connection.readyState === 1) {
      const docs = await RiskEvent.find({ projectId }).lean();
      return docs.map(this._cleanDoc);
    }
    return risksData[projectId] || [];
  }

  _cleanDoc(doc) {
    if (!doc) return null;
    const { _id, __v, ...rest } = doc;
    return rest;
  }
}

export const riskRepository = new RiskRepository();
