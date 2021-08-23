const express = require("express");
router = express.Router();
const Booking = require("../models/Booking");

router.route("/create").post((req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const newBooking = new Booking({
    firstname,
    lastname,
  });
  newBooking.save();
});

router.route("/bookings").get((req, res) => {
  Booking.find().then((foundBookings) => res.json(foundBookings));
});

module.exports = router;
