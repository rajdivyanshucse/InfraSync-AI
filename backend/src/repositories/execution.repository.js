import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { Execution } from '../models/Execution.js';
import { executionsData } from '../data/executions.data.js';

export class ExecutionRepository {
  async getExecutionByProjectId(projectId) {
    if (config.dataSource === 'mongodb' && mongoose.connection.readyState === 1) {
      const doc = await Execution.findOne({ projectId }).lean();
      return doc ? this._cleanDoc(doc) : null;
    }
    return executionsData[projectId] || null;
  }

  async getMicroActivitiesByProjectId(projectId) {
    const execution = await this.getExecutionByProjectId(projectId);
    return execution ? execution.microActivities || [] : [];
  }

  async getExecutionUnitsByProjectId(projectId) {
    const execution = await this.getExecutionByProjectId(projectId);
    return execution ? execution.executionUnits || [] : [];
  }

  _cleanDoc(doc) {
    if (!doc) return null;
    const { _id, __v, ...rest } = doc;
    return rest;
  }
}

export const executionRepository = new ExecutionRepository();
