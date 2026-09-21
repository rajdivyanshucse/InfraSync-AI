import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { Schedule } from '../models/Schedule.js';
import { schedulesData } from '../data/schedules.data.js';

export class ScheduleRepository {
  async getScheduleByProjectId(projectId) {
    if (config.dataSource === 'mongodb' && mongoose.connection.readyState === 1) {
      const doc = await Schedule.findOne({ projectId }).lean();
      return doc ? this._cleanDoc(doc) : null;
    }
    return schedulesData[projectId] || null;
  }

  async getMilestonesByProjectId(projectId) {
    const schedule = await this.getScheduleByProjectId(projectId);
    return schedule ? schedule.milestones || [] : [];
  }

  async getActivitiesByProjectId(projectId) {
    const schedule = await this.getScheduleByProjectId(projectId);
    return schedule ? schedule.activities || [] : [];
  }

  _cleanDoc(doc) {
    if (!doc) return null;
    const { _id, __v, ...rest } = doc;
    return rest;
  }
}

export const scheduleRepository = new ScheduleRepository();
