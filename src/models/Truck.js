const { Schema, model } = require('mongoose');

const TruckSchema = new Schema({
  economicNumber: { type: String, required: true, unique: true, trim: true },
  vin: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  year: { type: Number, min: 1995, max: 2100, required: true },
  expectedMpgMin: { type: Number, default: 4 },
  expectedMpgMax: { type: Number, default: 10 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

TruckSchema.index({ economicNumber: 1 }, { unique: true });
module.exports = model('Truck', TruckSchema);
