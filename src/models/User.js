const { Schema, model, Types } = require('mongoose');

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin','driver'], required: true },
  driverRef: { type: Types.ObjectId, ref: 'Driver' },
  expoPushToken: { type: String }
}, { timestamps: true });

module.exports = model('User', UserSchema);
