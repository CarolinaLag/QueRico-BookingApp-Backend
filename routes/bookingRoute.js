const express = require("express");
router = express.Router();
const Booking = require("../models/Booking");
const bookingController = require("../controller/bookingController");
const adminController = require("../controller/adminController");

router.post("/create", bookingController.makeNewReservation);

router.get(
  "/checktables/:date/:guests",
  bookingController.checkTableAvailability
);

router.delete("/delete/:id", bookingController.guestRemoveBooking);

module.exports = router;
