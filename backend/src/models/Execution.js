import mongoose from 'mongoose';

const MicroActivitySchema = new mongoose.Schema({
  id: { type: String, required: true },
  activityId: { type: String, required: true },
  name: { type: String, required: true },
  wbsId: { type: String },
  phaseId: { type: String },
  discipline: { type: String },
  contractor: { type: String },
  unitOfMeasure: { type: String },
  plannedQuantity: { type: Number, default: 0 },
  completedQuantity: { type: Number, default: 0 },
  plannedProgress: { type: Number, default: 0 },
  actualProgress: { type: Number, default: 0 },
  variance: { type: Number, default: 0 },
  status: { type: String, default: 'onTrack' },
  evidenceStatus: { type: String, default: 'unverified' },
  evidenceCount: { type: Number, default: 0 },
}, { _id: false });

const ExecutionUnitSchema = new mongoose.Schema({
  id: { type: String, required: true },
  microActivityId: { type: String },
  location: { type: String },
  status: { type: String, default: 'onTrack' },
  plannedPct: { type: Number, default: 0 },
  actualPct: { type: Number, default: 0 },
  unit: { type: String },
}, { _id: false });

const ExecutionSummarySchema = new mongoose.Schema({
  totalMicroActivities: { type: Number, default: 0 },
  totalExecutionUnits: { type: Number, default: 0 },
  plannedQuantity: { type: Number, default: 0 },
  completedQuantity: { type: Number, default: 0 },
  remainingQuantity: { type: Number, default: 0 },
  plannedProgress: { type: Number, default: 0 },
  actualProgress: { type: Number, default: 0 },
  variance: { type: Number, default: 0 },
  blockedUnits: { type: Number, default: 0 },
  delayedUnits: { type: Number, default: 0 },
  awaitingInspection: { type: Number, default: 0 },
}, { _id: false });

const ExecutionSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true, index: true },
  summary: ExecutionSummarySchema,
  microActivities: [MicroActivitySchema],
  executionUnits: [ExecutionUnitSchema],
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

export const Execution = mongoose.models.Execution || mongoose.model('Execution', ExecutionSchema);
export default Execution;
