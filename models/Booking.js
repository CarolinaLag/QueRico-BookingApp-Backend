const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
});

const Booking = mongoose.model("booking", bookingSchema);

module.exports = Booking;
