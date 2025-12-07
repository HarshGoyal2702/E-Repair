const express = require("express");
const {
  createBooking,
  getUserBookings,
  updateStatus,
} = require("../controllers/bookingController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// in routes
router.post("/", auth, upload.array("images"), createBooking);

// router.post("/", auth, createBooking);
router.get("/", auth, getUserBookings);
router.get("/my", auth, getUserBookings);
router.put("/:id", auth, updateStatus);

module.exports = router;
