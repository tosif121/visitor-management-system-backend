const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phoneNumber: String,
  company: String,
  purpose: String,
  visitDate: Date,
  needsCab: Boolean,
  pickupLocation: String,
  pickupTime: String,
});

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor;
