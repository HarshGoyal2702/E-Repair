const bookingService = require("../services/bookingService");

exports.createBooking = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ msg: "Only users can create bookings" });
    }

    const { deviceType, brand, issue, specialty, serviceAddress, priority } = req.body;

    // Validate required fields
    if (!deviceType || !brand || !issue || !specialty) {
      return res.status(400).json({
        msg: "deviceType, brand, issue, and specialty are required"
      });
    }

    // Validate lengths / formats
    if (issue.length < 5 || issue.length > 500) {
      return res.status(400).json({ msg: "Issue must be 5-500 characters" });
    }
    if (deviceType.length > 50 || brand.length > 50) {
      return res.status(400).json({ msg: "deviceType and brand max 50 characters" });
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
    const booking = await bookingService.assignWorker(
      req.params.id,
      req.body.workerId,
      req.user._id
    );
    res.json(booking);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = bookingService.VALID_STATUSES.includes(status);
    if (!valid) return res.status(400).json({ msg: "Invalid status" });

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
    const booking = await bookingService.getBookingById(req.params.id, req.user);
    res.json(booking);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

exports.addWorkerNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    const booking = await bookingService.addWorkerNotes(req.params.id, req.user, notes);
    res.json(booking);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.addAdminNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    const booking = await bookingService.addAdminNotes(req.params.id, req.user, notes);
    res.json(booking);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

