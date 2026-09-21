import crypto from 'crypto';
import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { SystemAudit } from '../models/SystemAudit.js';

// In-memory audit log for mock mode / development
const inMemoryAuditLogs = [];

export class SystemAuditService {
  async logEvent({
    action,
    actor,
    target = {},
    ipAddress = '127.0.0.1',
    userAgent = 'InfraSync-Client',
    status = 'SUCCESS',
    message = '',
    metadata = {},
  }) {
    const auditId = `SYS-AUD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const timestamp = new Date().toISOString();

    const record = {
      auditId,
      action,
      actor: {
        userId: actor?.userId || 'SYSTEM',
        name: actor?.name || 'System',
        role: actor?.role || 'system',
      },
      target,
      ipAddress,
      userAgent,
      status,
      message,
      timestamp,
      metadata,
    };

    if (config.dataSource === 'mongodb' && mongoose.connection.readyState === 1) {
      try {
        await SystemAudit.create(record);
      } catch (err) {
        console.warn('[SystemAudit] Failed to persist audit event to MongoDB:', err.message);
      }
    }

    inMemoryAuditLogs.unshift(record);
    if (inMemoryAuditLogs.length > 500) inMemoryAuditLogs.pop(); // Cap in-memory list

    return record;
  }

  async getEvents(filters = {}) {
    if (config.dataSource === 'mongodb' && mongoose.connection.readyState === 1) {
      const query = {};
      if (filters.action) query.action = filters.action;
      if (filters.projectId) query['target.projectId'] = filters.projectId;
      const docs = await SystemAudit.find(query).sort({ timestamp: -1 }).limit(100).lean();
      return docs.map((d) => {
        const { _id, __v, ...rest } = d;
        return rest;
      });
    }

    let results = inMemoryAuditLogs;
    if (filters.action) {
      results = results.filter((e) => e.action === filters.action);
    }
    if (filters.projectId) {
      results = results.filter((e) => e.target?.projectId === filters.projectId);
    }
    return results.slice(0, 100);
  }
}

export const systemAuditService = new SystemAuditService();
export default systemAuditService;
