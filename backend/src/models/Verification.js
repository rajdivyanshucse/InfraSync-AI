import mongoose from 'mongoose';

const AuditEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true },
  action: { type: String, required: true }, // INITIALIZE_CANDIDATE | VERIFY | REJECT | OVERRIDE
  previousStatus: { type: String },
  newStatus: { type: String, required: true },
  reviewer: {
    userId: { type: String },
    name: { type: String },
    role: { type: String, required: true },
  },
  reason: { type: String },
  timestamp: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { _id: false });

const VerificationSchema = new mongoose.Schema({
  verificationId: { type: String, required: true, unique: true, index: true },
  projectId: { type: String, required: true, index: true },
  evidenceId: { type: String, required: true, index: true },
  sourceAnalysisId: { type: String, index: true },

  targetType: {
    type: String,
    required: true,
    enum: ['schedule_link', 'risk_signal'],
    index: true,
  },
  targetId: { type: String, required: true, index: true },

  status: {
    type: String,
    required: true,
    enum: ['candidate', 'needs_review', 'verified', 'rejected'],
    default: 'candidate',
    index: true,
  },
  decision: {
    type: String,
    enum: ['verified', 'rejected', null],
    default: null,
  },

  reviewer: {
    userId: { type: String },
    name: { type: String },
    role: { type: String },
  },
  reason: { type: String },
  decidedAt: { type: String },

  candidateContext: {
    activityId: { type: String },
    activityName: { type: String },
    microActivityId: { type: String },
    microActivityName: { type: String },
    signalType: { type: String },
    severity: { type: String },
    confidence: { type: Number },
    confidenceBand: { type: String },
    reasons: [{ type: String }],
    triggerCondition: { type: String },
    linkType: { type: String },
  },

  auditHistory: [AuditEventSchema],
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

export const Verification = mongoose.models.Verification || mongoose.model('Verification', VerificationSchema);
export default Verification;
