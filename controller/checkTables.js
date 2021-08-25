const express = require("express");
router = express.Router();
const Booking = require("../models/Booking");

exports.checkTables = async (req, res) => {
  const guestsPerTable = 6;
  const tablesInRestaurant = 15;
  const numberOfGuestsInBooking = 18;
  const chosenDateForBooking = Date.now();

  const firstTimeSlot = "17";
  const secondTimeSlot = "19";

  const tablesNeededForBooking = numberOfGuests / guestsPerTable;

  const bookingsAtFive = await Booking.find({
    // date: chosenDate,
    timeSlot: firstTimeSlot,
  });
  let bookedTablesAtFive = 0;

  bookingsAtFive.forEach((booking) => {
    bookedTablesAtFive += booking.amountOfTables;
  });

  let availableTablesAtFive = tablesInRestaurant - bookedTablesAtFive;

  const bookingsAtSeven = await Booking.find({
    //date: req.body.date,
    timeSlot: secondTimeSlot,
  });

  let bookedTablesAtSeven = 0;
  bookingsAtSeven.forEach((booking) => {
    bookedTablesAtSeven += booking.amountOfTables;
  });

  let availableTablesAtSeven = tablesInRestaurant - bookedTablesAtSeven;

  if (availableTablesAtFive > tablesNeededForBooking) {
    console.log("Bord finns klockan 17");
  } else {
    console.log("Bord finns inte");
  }
  if (availableTablesAtSeven > tablesNeededForBooking) {
    console.log("Bord finns klockan 19");
  } else {
    console.log("Bord finns inte");
  }
};
