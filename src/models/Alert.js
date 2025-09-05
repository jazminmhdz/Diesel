const { Schema, model, Types } = require('mongoose');

const AlertSchema = new Schema({
  truck: { type: Types.ObjectId, ref: 'Truck', required: true },
  ticket: { type: Types.ObjectId, ref: 'Ticket', required: true },
  type: { type: String, enum: ['LOW_MPG','HIGH_MPG'], required: true },
  value: { type: Number, required: true },
  min: { type: Number }, max: { type: Number },
  resolved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = model('Alert', AlertSchema);
