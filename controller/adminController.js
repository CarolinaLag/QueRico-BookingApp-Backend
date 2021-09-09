const express = require("express");
router = express.Router();
const Booking = require("../models/Booking");
const nodemailer = require("nodemailer");

//Tar emot ID och raderar bokningen som hör ihop med detta
//Skickar bekräftelsemail till den adress som är angiven i borttagen bokning
exports.removeBooking = async (id) => {
  let guestEmail = "";
  let dateForReservation = "";
  try {
    await Booking.findByIdAndDelete({ _id: id }).then((reservation) => {
      guestEmail = reservation.ContactInfo.email;
      dateForReservation = reservation.date;
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

  /* await smtpTransport.sendMail(mailOptions, (error) => {
    if (error) {
      return 404;
    } else {
      smtpTransport.close();
      return dateForReservation;
    }
  }); */

  try {
    await smtpTransport.sendMail(mailOptions);
  } catch (error) {
    return 404;
  }
  smtpTransport.close();
  return dateForReservation;
};

//Skickar tillbaka en lista med bokningar för det valda datumet
checkTablesOnDate = async (chosenDateForBooking) => {
  const bookingsOnDate = await Booking.find({
    date: chosenDateForBooking,
  });
  return bookingsOnDate;
};

//Skickar tillbaka en boolean baserat på ifall det finns bord den valda tiden och datumet
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

//Hämtar ut bokningar till Adminsidan enligt inskickat datum
exports.getReservationsOnDate = async (req, res) => {
  let date = req.params.date;
  let reservations = await checkTablesOnDate(date);
  return res.send(reservations);
};

//Skickar ID till removeBooking för att ta bort reservation
//Returnerar uppdaterad lista med bokningar för att visa upp på Adminsidan
exports.adminRemoveBooking = async (req, res, error) => {
  const id = req.params.id;

  let dateForRemovedReservation = await this.removeBooking(id);

  if (dateForRemovedReservation === error) {
    return res.send("Oj något gick, försök igen");
  } else {
    let bookings = await checkTablesOnDate(dateForRemovedReservation);
    return res.send(bookings);
  }
};

//Skickar in ändrad bokning till databasen
exports.editReservation = async (req, res) => {
  const { _id, amountOfGuests, amountOfTables, timeSlot, date, ContactInfo } =
    req.body;
  const updatedReservation = {
    _id: _id,
    amountOfGuests: amountOfGuests,
    amountOfTables: Math.ceil(amountOfGuests / 6),
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

  let tablesNeeded = updatedReservation.amountOfTables;

  let tableAvailable = true;

  //Om antal bort i tidigare bokning är större än i den uppdaterade,
  //jämför den tidigare bokningens bord mot den uppdaterades så det inte ser fullt ut när det inte är det

  if (updatedReservation.amountOfTables > currentReservation.amountOfTables) {
    tablesNeeded =
      updatedReservation.amountOfTables - currentReservation.amountOfTables;
  }

  //OM antal bord som behövs är mer än det antal bord man redan har bokat sedan tidigare,
  //OM det är ett nytt datum,
  //OM timeslot är ändrat:  ska man kolla om det är ledigt, annars uppdatera bara
  if (
    updatedReservation.date !== currentReservation.date ||
    updatedReservation.timeSlot !== currentReservation.timeSlot ||
    updatedReservation.amountOfTables > currentReservation.amountOfTables
  ) {
    let reservationsByDate = await checkTablesOnDate(updatedReservation.date);

    tableAvailable = await checkTablesByTimeslot(
      reservationsByDate,
      tablesNeeded,
      updatedReservation.timeSlot
    );

    if (tableAvailable === false)
      return res.send({ reservations, tableAvailable });
  }

  await Booking.updateOne({ _id: _id }, updatedReservation);
  reservations = await checkTablesOnDate(updatedReservation.date);

  res.send({ reservations, tableAvailable });
};
