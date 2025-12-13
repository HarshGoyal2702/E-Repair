const bookingService = require("../services/bookingService");
const Booking = require("../models/Booking");
const User = require("../models/User");

exports.createBooking = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ msg: "Only users can create bookings" });
    }

    let { deviceType, brand, issue, specialty, serviceAddress, priority } =
      req.body;

    // Validate required fields
    if (!deviceType || !brand || !issue || !specialty) {
      return res.status(400).json({
        msg: "deviceType, brand, issue, and specialty are required",
      });
    }
    if (serviceAddress && typeof serviceAddress === "string") {
      serviceAddress = JSON.parse(serviceAddress);
    }
    // Validate lengths / formats
    if (issue.trim().length < 5 || issue.trim().length > 500) {
      return res.status(400).json({ msg: "Issue must be 5-500 characters" });
    }
    if (deviceType.length > 50 || brand.length > 50) {
      return res
        .status(400)
        .json({ msg: "deviceType and brand max 50 characters" });
    }
    if (!["low", "medium", "high"].includes(priority)) {
      req.body.priority = "medium"; // default if invalid
    }

    // If serviceAddress is not provided, take from user profile
    const address = serviceAddress || req.user.address;

    const booking = await Booking.create({
      user: req.user._id,
      deviceType: deviceType.trim(),
      brand: brand.trim(),
      issue: issue.trim(),
      specialty: specialty.trim(),
      serviceAddress: address,
      priority: req.body.priority || "medium",
      scheduledAt: new Date(), // automatically set current datetime
      createdByRoleSnapshot: req.user.role,
    });

    if (req.files && req.files.length > 0) {
      booking.images = req.files.map((file) => file.path); // save file paths
      await booking.save();
    }
    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const data = await bookingService.getUserBookings(req.user._id);
    res.json(data);
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getWorkerBookings = async (req, res) => {
  try {
    if (req.user.role !== "worker") {
      return res.status(403).json({ msg: "Access denied" });
    }
    const data = await bookingService.getWorkerBookings(req.user._id);
    res.json(data);
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, specialty, worker } = req.query;
    const filter = { isActive: true };
    if (status) filter.status = status;
    if (specialty) filter.specialty = specialty;
    if (worker) filter.worker = worker;

    const data = await bookingService.getAllBookings(
      filter,
      Number(page),
      Number(limit)
    );

    res.json(data);
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.assignWorker = async (req, res) => {
  try {
    // Only admin allowed
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Only admin can assign workers" });
    }

    const { id: bookingId } = req.params;

    if (bookingId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(bookingId)) {
      return res.status(400).json({
        msg: "Invalid Booking ID format. ID must be a 24-character hexadecimal string.",
      });
    }
    const { workerId } = req.body;

    if (!workerId) {
      return res.status(400).json({ msg: "workerId is required" });
    }
    if (workerId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(workerId)) {
      return res.status(400).json({
        msg: "Invalid Worker ID format. workerId must be a 24-character hexadecimal string.",
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    // Check if user is actually a worker
    const worker = await User.findById(workerId);
    if (!worker || worker.role !== "worker") {
      return res.status(400).json({ msg: "Invalid worker" });
    }

    // Assign worker + update status
    booking.worker = workerId;

    booking.statusHistory.push({
      from: booking.status,
      to: "assigned",
      changedBy: req.user._id,
      role: req.user.role,
    });

    booking.status = "assigned";

    await booking.save();

    await User.findByIdAndUpdate(workerId, {
      $push: { assignedRequests: booking._id },
    });
    res.json({
      msg: "Worker assigned successfully",
      booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = bookingService.VALID_STATUSES.includes(status);
    if (!valid) {
      console.error("Invalid status value:", status);
      return res.status(400).json({ msg: "Invalid status" });
    }

    const booking = await bookingService.updateStatus(
      req.params.id,
      status,
      req.user
    );

    res.json(booking);
  } catch (err) {
    if (err.message === "Booking not found") {
      res.status(404).json({ msg: err.message });
    } else {
      res.status(403).json({ msg: err.message });
    }
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id, req.user);
    res.json(booking);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;

    if (bookingId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(bookingId)) {
      return res.status(400).json({
        msg: "Invalid Booking ID format. ID must be a 24-character hexadecimal string.",
      });
    }
    const booking = await bookingService.getBookingById(
      req.params.id,
      req.user
    );
    res.json(booking);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

exports.addWorkerNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    const booking = await bookingService.addWorkerNotes(
      req.params.id,
      req.user,
      notes
    );
    res.json(booking);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.addAdminNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    const { id: bookingId } = req.params;

    if (bookingId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(bookingId)) {
      return res.status(400).json({
        msg: "Invalid Booking ID format. ID must be a 24-character hexadecimal string.",
      });
    }
    const booking = await bookingService.addAdminNotes(
      bookingId,
      req.user,
      notes
    );
    res.json(booking);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};
// exports.getWorkers = async (req, res) => {
//   try {
//     const { specialty } = req.query;

//     let workers = [];
//     let fallback = false;

//     // Use case-insensitive regex for specialty matching
//     if (specialty) {
//       workers = await User.find({
//         role: "worker",
//         isAvailable: true,
//         specialty: { $regex: new RegExp(`^${specialty}$`, "i") }, // Case-insensitive exact match
//       }).select("name email specialty isAvailable");
//     }

//     // If no specialty workers found → fallback to ALL available workers
//     if (!workers || workers.length === 0) {
//       fallback = true;

//       workers = await User.find({
//         role: "worker",
//         isAvailable: true,
//       }).select("name email specialty isAvailable");
//     }

//     res.json({
//       fallback,
//       count: workers.length,
//       workers,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Failed to fetch workers" });
//   }
// };

exports.getWorkers = async (req, res) => {
  try {
    const { specialty } = req.query;

    let workers = [];
    let fallback = false;

    // 1️⃣ Try specialty-based workers
    if (specialty) {
      workers = await User.find({
        role: "worker",
        isAvailable: true,
        specialty: {
          $regex: new RegExp(`^${specialty}$`, "i"),
        },
      }).select("name email specialty isAvailable");
    }

    // 2️⃣ Fallback → all available workers
    if (!workers || workers.length === 0) {
      fallback = true;

      workers = await User.find({
        role: "worker",
      }).select("name email specialty isAvailable");
    }

    res.json({
      fallback,
      count: workers.length,
      workers,
      message: fallback
        ? "No workers found for this specialty. Showing all available workers."
        : "Showing workers matching booking specialty.",
    });
  } catch (err) {
    console.error("getWorkers error:", err);
    res.status(500).json({ msg: "Failed to fetch workers" });
  }
};
