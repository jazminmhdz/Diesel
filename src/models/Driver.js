const { Schema, model, Types } = require('mongoose');

const DriverSchema = new Schema({
  name: { type: String, required: true, trim: true },
  licenseNumber: { type: String, required: true, trim: true, match: /^[A-Z0-9-]{5,20}$/i },
  type: { type: String, enum: ['local','cruce'], required: true },
  badge: { type: String, trim: true },
  assignedTruck: { type: Types.ObjectId, ref: 'Truck' }
}, { timestamps: true });

DriverSchema.index({ licenseNumber: 1 }, { unique: true });
module.exports = model('Driver', DriverSchema);
