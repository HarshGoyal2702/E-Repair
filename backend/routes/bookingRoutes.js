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
} = require("../controllers/bookingController");

const { protect, authorize } = require("../middleware/auth");

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
router.post(
  "/", 
  authorize("user"), 
  upload.array("images", 5), 
  createBooking
);

router.get("/me", authorize("user"), getMyBookings);
router.get("/:id", authorize("user", "admin", "worker"), getBookingById);

// User can cancel own booking (only if not completed)
router.patch("/:id/cancel", authorize("user"), cancelBooking);


// ─────────────────────────────────
// WORKER ROUTES
// ─────────────────────────────────
router.get("/worker/assigned", authorize("worker"), getWorkerBookings);

// Worker can update status of own assigned jobs
router.patch("/:id/status", authorize("worker", "admin"), updateStatus);

// Worker can add notes
router.patch("/:id/worker-notes", authorize("worker"), addWorkerNotes);


// ─────────────────────────────────
// ADMIN ROUTES
// ─────────────────────────────────
router.get("/", authorize("admin"), getAllBookings);

// Assign or reassign worker
router.patch("/:id/assign", authorize("admin"), assignWorker);

// Admin notes
router.patch("/:id/admin-notes", authorize("admin"), addAdminNotes);

module.exports = router;
