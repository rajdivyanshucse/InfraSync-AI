import mongoose from 'mongoose';

const StorageMetaSchema = new mongoose.Schema({
  provider: { type: String, default: 'local' },
  key: { type: String },
  originalName: { type: String },
  storedName: { type: String },
  mimeType: { type: String },
  sizeBytes: { type: Number },
  checksum: { type: String },
  uploadedAt: { type: String },
}, { _id: false });

const EvidenceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  projectId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  microActivityId: { type: String, index: true },
  activityId: { type: String },
  zoneId: { type: String },
  evidenceType: { type: String, default: 'PHOTO' },
  captureSource: { type: String },
  verificationStatus: { type: String, default: 'pendingReview' },
  capturedAt: { type: String },
  capturedBy: { type: String },
  metadata: {
    stationing: { type: String },
    gpsCoords: { type: String },
    qualityScore: { type: Number, default: 0 },
  },
  storage: StorageMetaSchema,
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

export const Evidence = mongoose.models.Evidence || mongoose.model('Evidence', EvidenceSchema);
export default Evidence;
