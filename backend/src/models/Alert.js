import mongoose from 'mongoose';

const AlertImpactedScopeSchema = new mongoose.Schema({
  phaseId: { type: String },
  phaseName: { type: String },
  wbsId: { type: String },
  wbsName: { type: String },
  activityId: { type: String },
  activityName: { type: String },
  microActivityId: { type: String },
  microActivityName: { type: String },
  zoneId: { type: String },
  zoneName: { type: String },
}, { _id: false });

const AlertSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  projectId: { type: String, required: true, index: true },
  riskEventId: { type: String },
  alertType: { type: String, required: true },
  severity: { type: String, required: true, default: 'medium' },
  status: { type: String, required: true, default: 'new' },
  title: { type: String, required: true },
  summary: { type: String },
  detectedAt: { type: String },
  impactedScope: AlertImpactedScopeSchema,
  discipline: { type: String },
  contractor: { type: String },
  triggerCondition: { type: String },
  scheduleImpact: { type: String },
  escalationLevel: { type: String, default: 'normal' },
}, {
  timestamps: true,
  toJSON: {
    transform: (_doc, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const Alert = mongoose.models.Alert || mongoose.model('Alert', AlertSchema);
export default Alert;
