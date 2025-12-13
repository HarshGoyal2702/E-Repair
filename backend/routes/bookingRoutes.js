const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  createBooking,
  getMyBookings,
  getWorkerBookings,
  getAllBookings,
  assignWorker,
  updateStatus,
  getBookingById,
  cancelBooking,
  addWorkerNotes,
  addAdminNotes,
  getWorkers,
} = require("../controllers/bookingController");

const { protect, authorize } = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");

// ─────────────────────────────────
// Multer setup for images
// ─────────────────────────────────
const upload = multer({ dest: "uploads/" });

// ─────────────────────────────────
// Protect all routes
// ─────────────────────────────────
router.use(protect);

// ─────────────────────────────────
// USER ROUTES
// ─────────────────────────────────
router.post("/", authorize("user"), upload.array("images", 5), createBooking);
const bookingLoggerMiddleware = (req, res, next) => {
  console.log("Booking route accessed. Request path:", req.path);
  next(); // Pass control to the bookingRoutes router
};

router.get("/worker-details", bookingLoggerMiddleware, getWorkers);
router.get("/my", authorize("user"), getMyBookings);
router.get(
  "/:id",
  validateObjectId("id"),
  authorize("user", "admin", "worker"),
  getBookingById
);

// User can cancel own booking (only if not completed)
router.patch(
  "/:id/cancel",
  validateObjectId("id"),
  authorize("user"),
  cancelBooking
);

// ─────────────────────────────────
// WORKER ROUTES
// ─────────────────────────────────
router.get("/worker/assigned", authorize("worker"), getWorkerBookings);

// Worker can update status of own assigned jobs
router.patch(
  "/:id/status",
  validateObjectId("id"),
  authorize("worker", "admin"),
  updateStatus
);

// Worker can add notes
router.patch(
  "/:id/worker-notes",
  validateObjectId("id"),
  authorize("worker"),
  addWorkerNotes
);

// ─────────────────────────────────
// ADMIN ROUTES
// ─────────────────────────────────
router.get("/", authorize("admin"), getAllBookings);

// Assign or reassign worker
router.patch(
  "/:id/assign",
  validateObjectId("id"),
  authorize("admin"),
  assignWorker
);

// Admin notes
router.patch(
  "/:id/admin-notes",
  validateObjectId("id"),
  authorize("admin"),
  addAdminNotes
);

module.exports = router;
