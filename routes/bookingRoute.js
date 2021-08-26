const express = require("express");
router = express.Router();
const Booking = require("../models/Booking");
const bookingController = require("../controller/bookingController");
const adminController = require("../controller/adminController");

router.post("/create", bookingController.makeBooking);

router.get("/bookings", adminController.getAllBookings);

router.get("/checktables/:date/:guests", bookingController.checkTables);

module.exports = router;