import mongoose from 'mongoose';

const RiskScopeSchema = new mongoose.Schema({
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

const RiskMetricsSchema = new mongoose.Schema({
  variance: { type: Number, default: 0 },
  totalFloat: { type: Number, default: 0 },
  criticalPath: { type: Boolean, default: false },
}, { _id: false });

const RiskEventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  projectId: { type: String, required: true, index: true },
  severity: { type: String, required: true, default: 'medium' },
  riskType: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: 'general' },
  sourceType: { type: String },
  sourceId: { type: String },
  sourceName: { type: String },
  scope: RiskScopeSchema,
  metrics: RiskMetricsSchema,
  contractor: { type: String },
  discipline: { type: String },
  timestamp: { type: String },
  acknowledged: { type: Boolean, default: false },
  acknowledgedBy: { type: String },
  acknowledgedAt: { type: String },
  resolutionNote: { type: String },
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

export const RiskEvent = mongoose.models.RiskEvent || mongoose.model('RiskEvent', RiskEventSchema);
export default RiskEvent;
