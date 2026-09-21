import mongoose from 'mongoose';

const PhaseSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: String, default: 'onTrack' },
  progress: { type: Number, default: 0 },
  targetDate: { type: String },
  stateText: { type: String },
}, { _id: false });

const StakeholderSchema = new mongoose.Schema({
  role: { type: String, required: true },
  name: { type: String, required: true },
  organization: { type: String },
  email: { type: String },
  phone: { type: String },
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  category: { type: String },
  location: { type: String },
  description: { type: String },
  status: { type: String, default: 'onTrack' },
  client: { type: String },
  authority: { type: String },
  primaryContractor: { type: String },
  contractorCount: { type: Number, default: 0 },
  disciplinesCount: { type: Number, default: 0 },
  startDate: { type: String },
  plannedCompletion: { type: String },
  contractValue: { type: String },
  lastUpdated: { type: String },
  kpis: {
    overallProgress: { type: Number, default: 0 },
    plannedProgress: { type: Number, default: 0 },
    actualProgress: { type: Number, default: 0 },
    variance: { type: Number, default: 0 },
    varianceDays: { type: Number, default: 0 },
    activitiesAtRisk: { type: Number, default: 0 },
    milestonesCompleted: { type: Number, default: 0 },
    totalMilestones: { type: Number, default: 0 },
  },
  phases: [PhaseSchema],
  stakeholders: [StakeholderSchema],
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

export const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export default Project;
