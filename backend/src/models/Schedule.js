import mongoose from 'mongoose';

const MilestoneSchema = new mongoose.Schema({
  id: { type: String, required: true },
  code: { type: String },
  name: { type: String, required: true },
  targetDate: { type: String },
  status: { type: String, default: 'onTrack' },
  wbsId: { type: String },
}, { _id: false });

const ActivitySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  wbsId: { type: String },
  phaseId: { type: String },
  status: { type: String, default: 'onTrack' },
  plannedProgress: { type: Number, default: 0 },
  actualProgress: { type: Number, default: 0 },
  criticalPath: { type: Boolean, default: false },
  totalFloat: { type: Number, default: 0 },
  contractor: { type: String },
}, { _id: false });

const WbsNodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  activities: [ActivitySchema],
}, { _id: false });

const SchedulePhaseSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  wbsNodes: [WbsNodeSchema],
}, { _id: false });

const ScheduleSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true, index: true },
  projectName: { type: String },
  baselineId: { type: String, default: 'BL-P6-DEFAULT' },
  baselineDate: { type: String },
  dataDate: { type: String },
  totalActivities: { type: Number, default: 0 },
  criticalPathActivities: { type: Number, default: 0 },
  milestones: [MilestoneSchema],
  phases: [SchedulePhaseSchema],
  activities: [ActivitySchema],
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

export const Schedule = mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema);
export default Schedule;
