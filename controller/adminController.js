const express = require("express");
router = express.Router();
const Booking = require("../models/Booking");

//Find all existing bookings
exports.getAllBookings = async (req, res) => {
  Booking.find().then((foundBookings) => res.json(foundBookings));
};
