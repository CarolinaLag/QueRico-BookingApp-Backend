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

exports.removeBooking = async (req, res, next) => {
  const id = req.params.id;

  let guestEmail = "";
  try {
    await Booking.findByIdAndDelete({ _id: id }).then((res) => {
      guestEmail = res.ContactInfo.email;
    });
  } catch (error) {
    console.log(error);
  }

  let bookings = await getReservations();

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

  await smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      return res.send(error);
    } else {
      smtpTransport.close();
      return res.send(bookings);
    }
  });
};
