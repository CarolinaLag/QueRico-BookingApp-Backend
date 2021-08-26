const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  amountOfGuests: { type: Number },
  amountOfTables: { type: Number },
  timeSlot: { type: String },
  date: { type: Date },
  ContactInfo: {
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String },
    phoneNumber: { type: Number },
  },
});

const Booking = mongoose.model("booking", bookingSchema);

module.exports = Booking;
