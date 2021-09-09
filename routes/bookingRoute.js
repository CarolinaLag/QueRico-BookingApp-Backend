const express = require("express");
router = express.Router();
const bookingController = require("../controller/bookingController");

router.post("/create", bookingController.makeNewReservation);

router.get(
  "/checktables/:date/:guests",
  bookingController.checkTableAvailability
);

router.delete("/delete/:id", bookingController.guestRemoveBooking);

module.exports = router;
