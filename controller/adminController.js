const express = require("express");
router = express.Router();
const Booking = require("../models/Booking");
const nodemailer = require("nodemailer");

//Find all existing bookings
exports.getAllBookings = async (req, res) => {
  Booking.find().then((foundBookings) => res.json(foundBookings));
};

getReservations = async () => {
  let reservations = Booking.find();
  return reservations;
};

exports.removeBooking = async (id) => {
  let guestEmail = "";
  try {
    await Booking.findByIdAndDelete({ _id: id }).then((reservation) => {
      guestEmail = reservation.ContactInfo.email;
    });
  } catch (error) {
    return 404;
  }

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
    to: guestEmail,
    subject: "Avbokningsbekräftelse",
    html: `
  <p>Din reservation är nu avbokad!</p>`,
  };

  await smtpTransport.sendMail(mailOptions, (error) => {
    if (error) {
      return 404;
    } else {
      smtpTransport.close();
      return 200;
    }
  });
};

checkTablesOnDate = async (chosenDateForBooking) => {
  const bookingsOnDate = await Booking.find({
    date: chosenDateForBooking,
  });

  return bookingsOnDate;
};

exports.getReservationsOnDate = async (req, res) => {
  let date = req.params.date;
  let reservations = await checkTablesOnDate(date);
  return res.send(reservations);
};
exports.adminRemoveBooking = async (req, res, error) => {
  const id = req.params.id;

  let response = await this.removeBooking(id);

  let bookings = await getReservations();
  if (response === error) {
    return res.send("Oj något gick, försök igen");
  } else {
    return res.send(bookings);
  }
};

exports.editReservation = async (req, res) => {
  const { _id, amountOfGuests, amountOfTables, timeSlot, date, ContactInfo } =
    req.body;
  const updatedReservation = {
    _id: _id,
    amountOfGuests: amountOfGuests,
    amountOfTables: amountOfTables,
    timeSlot: timeSlot,
    date: date,
    ContactInfo: {
      firstname: ContactInfo.firstname,
      lastname: ContactInfo.lastname,
      email: ContactInfo.email,
      phoneNumber: ContactInfo.phoneNumber,
    },
  };
  let reservations = [];
  const currentReservation = await Booking.findOne({ _id: _id });
  const guestsPerTable = 6;
  const tablesNeeded = Math.ceil(amountOfGuests / guestsPerTable);
  let tableAvailable = true;

  //OM antal bord som behövs är mer än det antal bord man redan har bokat sedan tidigare,
  //OM det är ett nytt datum,
  //OM timeslot är ändrat:  ska man kolla om det är ledigt, annars uppdatera bara

  if (
    updatedReservation.date !== currentReservation.date ||
    updatedReservation.timeSlot !== currentReservation.timeSlot ||
    updatedReservation.tablesNeeded > currentReservation.amountOfTables
  ) {
    let reservationsByDate = await checkTablesOnDate(updatedReservation.date);

    tableAvailable = await checkTablesByTimeslot(
      reservationsByDate,
      tablesNeeded,
      updatedReservation.timeSlot
    );

    if (tableAvailable === false) return res.send(reservations, tableAvailable);
  }

  await Booking.updateOne({ _id: _id }, updatedReservation);
  reservations = await checkTablesOnDate(updatedReservation.date);

  res.send({ reservations, tableAvailable });
};
