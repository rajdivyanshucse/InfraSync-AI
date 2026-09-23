import mongoose from 'mongoose';

const SystemAuditSchema = new mongoose.Schema({
  auditId: { type: String, required: true, unique: true, index: true },
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN',
      'LOGOUT',
      'VERIFICATION',
      'REJECTION',
      'FILE_UPLOAD',
      'FILE_DOWNLOAD',
      'AI_ANALYSIS',
      'PROJECT_ACCESS',
      'SECURITY_BREACH_ATTEMPT',
      'ADMIN_CONFIG_CHANGE',
      'ALERT_ACKNOWLEDGED',
      'ALERT_ESCALATED',
      'INTERVENTION_STARTED',
      'INTERVENTION_RESOLVED',
      'RISK_ACKNOWLEDGED',
      'EVIDENCE_VERIFIED',
      'EVIDENCE_REJECTED',
      'EVIDENCE_STATUS_UPDATED',
      'REPORT_EXPORTED',
    ],
    index: true,
  },
  actor: {
    userId: { type: String, required: true },
    name: { type: String },
    role: { type: String, required: true },
  },
  target: {
    type: { type: String },
    id: { type: String },
    projectId: { type: String, index: true },
  },
  ipAddress: { type: String },
  userAgent: { type: String },
  status: { type: String, enum: ['SUCCESS', 'FAILURE'], default: 'SUCCESS' },
  message: { type: String },
  timestamp: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, {
  timestamps: true,
  toJSON: {
    transform: (_doc, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
});

export const SystemAudit = mongoose.models.SystemAudit || mongoose.model('SystemAudit', SystemAuditSchema);
export default SystemAudit;
