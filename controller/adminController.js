const express = require("express");
router = express.Router();
const Booking = require("../models/Booking");

//Find all existing bookings
exports.getAllBookings = async (req, res) => {
  Booking.find().then((foundBookings) => res.json(foundBookings));
};

getReservations = async () => {
  let reservations = Booking.find();
  return reservations;
};

exports.removeBooking = async (req, res) => {
  const id = req.params.id;

  try {
    await Booking.deleteOne({ _id: id });
  } catch (error) {
    console.log(error);
  }
  let bookings = await getReservations();

  return res.send(bookings);
};

exports.editReservation = async (req, res) => {
  const { amountOfGuests, amountOfTables, timeSlot, date, firstname, lastname, email, phoneNumber } = req.body;
  
  const updatedReservation = {
    amountOfGuests,
    amountOfTables,
    timeSlot,
    date,
    ContactInfo: {
      firstname,
      lastname,
      email,
      phoneNumber,
    }
  };

  await Booking.updateOne(
    { _id: req.params.id }, 
    {
      updatedReservation
    },
  );

  res.send(updatedReservation);
}