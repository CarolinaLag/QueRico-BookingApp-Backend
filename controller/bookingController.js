const express = require("express");
router = express.Router();
const Booking = require("../models/Booking");

//Make new booking
exports.makeBooking = async (req, res) => {
  const amountOfGuests = req.body.guests;
  const guestsPerTable = 6;
  const neededTables = amountOfGuests / guestsPerTable;
  const amountOfTables = Math.ceil(neededTables);
  const timeSlot = req.body.timeslot;
  const date = req.body.date;

  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const phoneNumber = req.body.phonenumber;
  const newBooking = new Booking({
    amountOfGuests,
    amountOfTables,
    timeSlot,
    date,
    ContactInfo: {
      firstname,
      lastname,
      email,
      phoneNumber,
    },
  });

  const savedBooking = await newBooking.save();
  res.send(savedBooking);
};

//Check if there are enough tables for the requested booking
exports.checkTables = async (req, res) => {
  const guestsPerTable = 6;
  const tablesInRestaurant = 15;
  const numberOfGuestsInBooking = req.params.guests;
  const chosenDateForBooking = req.params.date;

  const firstTimeSlot = "17";
  const secondTimeSlot = "19";

  const tablesNeededForBooking = numberOfGuestsInBooking / guestsPerTable;

  const bookingsAtFive = await Booking.find({
    date: chosenDateForBooking,
    timeSlot: firstTimeSlot,
  });
  let bookedTablesAtFive = 0;

  bookingsAtFive.forEach((booking) => {
    bookedTablesAtFive += booking.amountOfTables;
  });

  let availableTablesAtFive = tablesInRestaurant - bookedTablesAtFive;

  const bookingsAtSeven = await Booking.find({
    date: chosenDateForBooking,
    timeSlot: secondTimeSlot,
  });

  let bookedTablesAtSeven = 0;
  bookingsAtSeven.forEach((booking) => {
    bookedTablesAtSeven += booking.amountOfTables;
  });

  let availableTablesAtSeven = tablesInRestaurant - bookedTablesAtSeven;

  let tablesAtFive = false;
  let tablesAtSeven = false;

  if (
    availableTablesAtFive > tablesNeededForBooking &&
    availableTablesAtSeven > tablesNeededForBooking
  ) {
    res.send({ tablesAtFive: true, tablesAtSeven: true });
  }

  if (availableTablesAtFive > tablesNeededForBooking) {
    res.send({ tablesAtFive: true, tablesAtSeven });
  }
  if (availableTablesAtSeven > tablesNeededForBooking) {
    res.send({ tablesAtFive, tablesAtSeven: true });
  }

  res.send({ tablesAtFive, tablesAtSeven });
};
