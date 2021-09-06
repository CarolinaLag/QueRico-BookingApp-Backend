const express = require("express");
router = express.Router();
require("dotenv").config();
const nodemailer = require("nodemailer");
const Booking = require("../models/Booking");
const { removeBooking } = require("../controller/adminController");

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
    //console.log(savedBooking);

    let data = req.body;
    let smtpTransport = nodemailer.createTransport({
      service: "Gmail",
      port: 465,
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.PASS,
      },
    });

    let mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: data.email,
      subject: "Bokningsbekräftelse",
      html: `
    <p>Tack för din bokning!</p>
    <h2>Din bokning:</h2>
    <p>Förnamn: ${data.firstname}</p>
    <p>Efternamn: ${data.lastname}</p>
    <p>Email: ${data.email}</p>
    <p>Telefonnummer: ${data.phonenumber}</p>
    <p>Datum: ${data.date} </p>
    <p>Tid: ${data.timeslot}</p>
    <h3> Klicka <a href="http://localhost:3000/cancelConfirmation/${savedBooking._id}">här</a> för att avboka</h3>`,
    };

    await smtpTransport.sendMail(mailOptions, (error, response) => {
      if (error) {
        return res.send(error);
      } else {
        return res.send("Success");
      }
    });
    return smtpTransport.close();
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

exports.guestRemoveBooking = async (req, res, error) => {
  const id = req.params.id;

  let response = await removeBooking(id);

  if (response === 404) {
    return res.send("Oj något gick fel, försök igen");
  } else {
    return res.send("Din bokning är borttagen");
  }
};
