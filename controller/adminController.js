const express = require("express");
router = express.Router();
const Booking = require("../models/Booking");

//Find all existing bookings
exports.getAllBookings = async (req, res) => {
  Booking.find().then((foundBookings) => res.json(foundBookings));
};

exports.removeBooking = async (req, res) => {
  const id = req.params.id;

  try {
    await Booking.deleteOne({ _id: id });
  } catch (error) {
    console.log(error);
  }
  return res.send("Bokningen är borttagen");
};
