const express = require("express");
router = express.Router();
const adminController = require("../controller/adminController");

router.get("/bookingsByDate/:date", adminController.getReservationsOnDate);

router.delete("/deleteAdmin/:id", adminController.adminRemoveBooking);

router.put("/edit/", adminController.editReservation);

module.exports = router;
