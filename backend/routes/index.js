const express = require("express");
const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/services", require("./serviceRoutes"));
router.use("/bookings", require("./bookingRoutes"));

module.exports = router;
