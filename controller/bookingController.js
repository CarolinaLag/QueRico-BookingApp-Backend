const express = require("express");
router = express.Router();
require("dotenv").config();
const nodemailer = require("nodemailer");
const Booking = require("../models/Booking");
const { removeBooking } = require("../controller/adminController");

//Lägger in en ny bokning och skickar bekräftelsemail med avbokningslänk till angiven adress i reservationen
//Returnerar en lista med uppdaterade bokningar enligt det datum som resrvationen gjordes på
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
    return res.send({ reservations, reservationIsPossible });
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
    const reservations = await this.checkTablesOnDate(date);
    res.send({ reservations, reservationIsPossible });

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
    <p>Antal: ${data.guests}</p>
    <h3> Klicka <a href="https://que-rico-client-app.herokuapp.com/cancelConfirmation/${savedBooking._id}">här</a> för att avboka</h3>`,
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

//Kollar bord enligt en given timeslot
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

//
exports.checkTablesOnDate = async (chosenDateForBooking) => {
  const bookingsOnDate = await Booking.find({
    date: chosenDateForBooking,
  });

  return bookingsOnDate;
};

//Kollar om det finns nog med bord för den valda datumet
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

//Tar emot ID för bokning som ska tas bort
//Kallar på removebooking som tar bort reservationen
//Returnerar string med svar som syns på skärmen
exports.guestRemoveBooking = async (req, res, error) => {
  const id = req.params.id;

  let response = await removeBooking(id);

  if (response === 404) {
    return res.send("Oj något gick fel, försök igen");
  } else {
    return res.send("Din bokning är borttagen");
  }
};
