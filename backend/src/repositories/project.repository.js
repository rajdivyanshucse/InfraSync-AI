import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { Project } from '../models/Project.js';
import { projectsData } from '../data/projects.data.js';

/**
 * Project Repository
 * Supports MongoDB when DATA_SOURCE=mongodb, with seamless fallback to prototype data.
 */
export class ProjectRepository {
  async findAll() {
    if (config.dataSource === 'mongodb' && mongoose.connection.readyState === 1) {
      const docs = await Project.find({}).lean();
      return docs.map(this._cleanDoc);
    }
    return projectsData;
  }

  async findById(projectId) {
    if (config.dataSource === 'mongodb' && mongoose.connection.readyState === 1) {
      const doc = await Project.findOne({ id: projectId }).lean();
      return doc ? this._cleanDoc(doc) : null;
    }
    return projectsData.find((p) => p.id === projectId) || null;
  }

  _cleanDoc(doc) {
    if (!doc) return null;
    const { _id, __v, ...rest } = doc;
    return rest;
  }
}

export const projectRepository = new ProjectRepository();
