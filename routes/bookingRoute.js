const express = require("express");
router = express.Router();
const Booking = require("../models/Booking");

router.route("/create").post((req, res) => {
  const firstname = req.body.Booking.ContactInfo.firstname;
  const lastname = req.body.Booking.ContactInfo.lastname;
  const email = req.body.Booking.ContactInfo.email;
  const phoneNumber = req.body.Booking.ContactInfo.phoneNumber;
  const newBooking = new Booking({
    Booking: {
      ContactInfo: {
        firstname,
        lastname,
        email,
        phoneNumber,
      },
    },
  });

  newBooking.save();
});

router.route("/bookings").get((req, res) => {
  Booking.find().then((foundBookings) => res.json(foundBookings));
});

module.exports = router;
