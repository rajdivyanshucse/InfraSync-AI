import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { SiteView } from '../models/SiteView.js';
import { siteViewsData } from '../data/siteViews.data.js';

export class SiteViewRepository {
  async getSiteViewByProjectId(projectId) {
    if (config.dataSource === 'mongodb' && mongoose.connection.readyState === 1) {
      const doc = await SiteView.findOne({ projectId }).lean();
      return doc ? this._cleanDoc(doc) : null;
    }
    return siteViewsData[projectId] || null;
  }

  async getZonesByProjectId(projectId) {
    const siteView = await this.getSiteViewByProjectId(projectId);
    return siteView ? siteView.zones || [] : [];
  }

  async getCapturePointsByProjectId(projectId) {
    const siteView = await this.getSiteViewByProjectId(projectId);
    return siteView ? siteView.capturePoints || [] : [];
  }

  _cleanDoc(doc) {
    if (!doc) return null;
    const { _id, __v, ...rest } = doc;
    return rest;
  }
}

export const siteViewRepository = new SiteViewRepository();
