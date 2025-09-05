const { Schema, model, Types } = require('mongoose');

const TicketSchema = new Schema({
  driver: { type: Types.ObjectId, ref: 'Driver', required: true },
  truck: { type: Types.ObjectId, ref: 'Truck', required: true },
  photoUrl: { type: String, required: true },
  date: { type: Date, required: true },
  state: { type: String, required: true, uppercase: true, match: /^[A-Z]{2}$/ },
  gallons: { type: Number, required: true, min: 0.01 },
  miles: { type: Number, required: true, min: 0 },
  pricePerGallon: { type: Number, min: 0 },
  mpg: { type: Number, required: true }
}, { timestamps: true });

TicketSchema.pre('validate', function(next) {
  if (this.gallons > 0 && this.miles >= 0) {
    this.mpg = Number((this.miles / this.gallons).toFixed(2));
  }
  next();
});

TicketSchema.index({ truck: 1, date: -1 });
module.exports = model('Ticket', TicketSchema);
