
import mongoose from 'mongoose';
const MetricSchema = new mongoose.Schema({
  path: { type: String, index: true },
  method: String,
  ms: Number,
  createdAt: { type: Date, index: true },
  userId: String,            // optional
});


export default mongoose.model('Metric', MetricSchema);
