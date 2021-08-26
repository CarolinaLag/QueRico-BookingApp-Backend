const express = require("express");
router = express.Router();
const Booking = require("../models/Booking");
const checkTables = require("../controller/checkTables");

router.route("/create").post((req, res) => {
  const bookingId = 1;
  const amountOfGuests = 2;
  const amountOfTables = 1;
  const timeSlot = "17";
  const date = Date.now();

  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const newBooking = new Booking({
    bookingId,
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

  newBooking.save();
});

router.route("/bookings").get((req, res) => {
  Booking.find().then((foundBookings) => res.json(foundBookings));
});

router.get("/checktables/:date/:guests", checkTables.checkTables);

module.exports = router;
