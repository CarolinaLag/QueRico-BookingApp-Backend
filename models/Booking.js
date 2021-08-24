const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  Booking: {
    bookingId: Number,
    amountOfGuests: Number,
    amountOfTables: Number,
    timeSlot: Number,
    date: Date,
    ContactInfo: {
      firstname: String,
      lastname: String,
      email: String,
      phoneNumber: String,
    },
  },
});

const Booking = mongoose.model("booking", bookingSchema);

module.exports = Booking;
