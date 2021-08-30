const express = require("express");
router = express.Router();
const Booking = require("../models/Booking");

//Make new booking
exports.makeNewReservation = async (req, res) => {
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

  let reservations = await checkTablesOnDate(date);

  let reservationIsPossible = await checkTablesByTimeslot(
    reservations,
    amountOfTables,
    timeSlot
  );

  if (reservationIsPossible === false) {
    return res.send("nej");
  } else {
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
  }
};

checkTablesByTimeslot = async (bookings, numberOfTables, timeSlot) => {
  let bookedTables = 0;
  bookings.forEach((booking) => {
    if (booking.timeSlot === timeSlot) {
      bookedTables += booking.amountOfTables;
    }
  });

  let tablesAreAvailable = false;
  let availableTables = 15 - bookedTables;
  if (availableTables >= numberOfTables) {
    tablesAreAvailable = true;
    return tablesAreAvailable;
  } else {
    return tablesAreAvailable;
  }
};

checkTablesOnDate = async (chosenDateForBooking) => {
  const bookingsOnDate = await Booking.find({
    date: chosenDateForBooking,
  });

  return bookingsOnDate;
};

//Check if there are enough tables for the requested booking
exports.checkTableAvailability = async (req, res) => {
  const timeSlotFive = "17:00";
  const timeSlotSeven = "19:00";
  const guestsPerTable = 6;
  const numberOfGuestsInBooking = req.params.guests;
  const chosenDateForBooking = req.params.date;
  const tablesNeeded = Math.ceil(numberOfGuestsInBooking / guestsPerTable);

  let reservationsByDate = await checkTablesOnDate(chosenDateForBooking);
  let tablesAvailableAtFive = await checkTablesByTimeslot(
    reservationsByDate,
    tablesNeeded,
    timeSlotFive
  );
  let tablesAvailableAtSeven = await checkTablesByTimeslot(
    reservationsByDate,
    tablesNeeded,
    timeSlotSeven
  );

  return res.send({ tablesAvailableAtFive, tablesAvailableAtSeven });
};
