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
