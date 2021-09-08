const express = require("express");
router = express.Router();
const adminController = require("../controller/adminController");

router.get("/bookings", adminController.getAllBookings);

router.get("/bookingsByDate/:date", adminController.getReservationsOnDate);

router.delete("/deleteAdmin/:id", adminController.adminRemoveBooking);

router.put("/edit/", adminController.editReservation);
