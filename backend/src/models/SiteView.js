import mongoose from 'mongoose';

const SiteZoneSchema = new mongoose.Schema({
  id: { type: String, required: true },
  zoneCode: { type: String, required: true },
  name: { type: String, required: true },
  stationing: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  status: { type: String, default: 'onTrack' },
  activityCount: { type: Number, default: 0 },
  capturePointCount: { type: Number, default: 0 },
}, { _id: false });

const CapturePointSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: String, default: 'online' },
  zoneId: { type: String },
  lastPing: { type: String },
  resolution: { type: String },
}, { _id: false });

const SiteViewSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true, index: true },
  projectName: { type: String },
  coordinateSystem: { type: String, default: 'Prototype Spatial Coordinates' },
  zones: [SiteZoneSchema],
  capturePoints: [CapturePointSchema],
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

export const SiteView = mongoose.models.SiteView || mongoose.model('SiteView', SiteViewSchema);
export default SiteView;
