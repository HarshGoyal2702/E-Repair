const Booking = require("../models/Booking");
const User = require("../models/User");

const VALID_STATUSES = [
  "pending",
  "assigned",
  "accepted",
  "in_progress",
  "completed",
  "cancelled",
];

module.exports = {
  VALID_STATUSES,

  async createBooking(data, user) {
    return await Booking.create({
      user: user._id,
      specialty: data.specialty,
      serviceAddress: data.serviceAddress || user.address || {},
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      createdByRoleSnapshot: user.role,
      statusHistory: [
        {
          from: null,
          to: "pending",
          changedBy: user._id,
          role: user.role,
        },
      ],
    });
  },

  async getUserBookings(userId) {
    return Booking.find({ user: userId, isActive: true }).sort({
      createdAt: -1,
    });
  },

  async getWorkerBookings(workerId) {
    return Booking.find({ worker: workerId, isActive: true }).sort({
      scheduledAt: 1,
    });
  },

  async getAllBookings(filter, page, limit) {
    const skip = (page - 1) * limit;

    const bookings = await Booking.find(filter)
      .populate("user", "name email phone")
      .populate("worker", "name email phone specialty")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(filter);
    return { total, page, limit, data: bookings };
  },

  async assignWorker(bookingId, workerId, adminId) {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error("Booking not found");

    if (["completed", "cancelled"].includes(booking.status)) {
      throw new Error("Cannot assign worker to closed booking");
    }
    const previousStatus = booking.status;
    if (workerId) {
      const worker = await User.findById(workerId);
      if (!worker || worker.role !== "worker")
        throw new Error("Invalid worker");

      booking.worker = workerId;
      if (booking.status === "pending") booking.status = "assigned";
    } else {
      booking.worker = undefined;
      booking.status = "pending";
    }

    booking.statusHistory.push({
      from: previousStatus,
      to: booking.status,
      changedBy: adminId,
      role: "admin",
    });

    await booking.save();
    return booking;
  },
  async updateStatus(bookingId, status, actor) {
    const allowedTransitions = {
      pending: ["assigned", "cancelled"],
      assigned: ["accepted", "cancelled"],
      accepted: ["in_progress", "cancelled"],
      in_progress: ["completed", "cancelled"],
    };

    const validStatuses = [
      "pending",
      "assigned",
      "accepted",
      "in_progress",
      "completed",
      "cancelled",
    ];

    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error("Booking not found");

    if (!validStatuses.includes(status))
      throw new Error("Invalid status value");

    if (actor.role === "user")
      throw new Error("Users cannot update booking status");

    // Worker ownership check
    if (actor.role === "worker") {
      if (
        !booking.worker ||
        booking.worker.toString() !== actor._id.toString()
      ) {
        throw new Error("Not your assigned booking");
      }
    }

    const previousStatus = booking.status;

    // Cannot change closed bookings
    if (["completed", "cancelled"].includes(previousStatus)) {
      throw new Error("Cannot change closed booking");
    }

    // Workflow check
    if (actor.role === "worker") {
      if (!allowedTransitions[previousStatus]?.includes(status)) {
        throw new Error("Invalid status transition");
      }
    }

    // Admin can override workflow except for closed bookings
    booking.status = status;
    booking.statusHistory.push({
      from: previousStatus,
      to: status,
      changedBy: actor._id,
      role: actor.role,
    });

    await booking.save();
    return booking;
  },

  async cancelBooking(bookingId, user) {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error("Booking not found");

    if (booking.user.toString() !== user._id.toString()) {
      throw new Error("Unauthorized");
    }
    if (["accepted", "in_progress", "completed"].includes(booking.status)) {
      throw new Error("Cannot cancel now");
    }
    const previousStatus = booking.status;
    booking.status = "cancelled";
    booking.statusHistory.push({
      from: previousStatus,
      to: "cancelled",
      changedBy: user._id,
      role: "user",
    });

    await booking.save();
    return booking;
  },

  async getBookingById(bookingId, user) {
    const booking = await Booking.findById(bookingId)
      .populate("user", "name email phone")
      .populate("worker", "name email phone specialty");

    if (!booking) {
      throw new Error("Booking not found");
    }

    // Authorization Check: Only the owner, the assigned worker, or an admin can view the booking.
    const isOwner = booking.user._id.toString() === user._id.toString();
    const isWorker =
      booking.worker && booking.worker._id.toString() === user._id.toString();
    const isAdmin = user.role === "admin";

    if (!isOwner && !isWorker && !isAdmin) {
      // Throw 404 to avoid leaking information about existing bookings to unauthorized users
      throw new Error("Booking not found");
    }

    return booking;
  },

  // 2. Implementation for exports.addWorkerNotes
  async addWorkerNotes(bookingId, worker, notes) {
    if (!notes || notes.trim() === "") {
      throw new Error("Notes cannot be empty");
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Authorization Check: Must be the assigned worker
    if (
      !booking.worker ||
      booking.worker.toString() !== worker._id.toString() ||
      worker.role !== "worker"
    ) {
      throw new Error("Unauthorized to add worker notes to this booking");
    }

    // Append notes to the booking document
    booking.workerNotes = booking.workerNotes || [];
    booking.workerNotes.push({
      changedAt: new Date(),
      content: notes.trim(),
      changedBy: worker._id,
    });

    await booking.save();
    return booking;
  },

  async addAdminNotes(bookingId, admin, notes) {
    if (!notes || notes.trim() === "") {
      throw new Error("Notes cannot be empty");
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Authorization Check: Must be an admin
    if (admin.role !== "admin") {
      throw new Error("Unauthorized: Only admins can add admin notes");
    }

    // 💡 FIX: Check if the field exists and initialize it if it doesn't.
    // Mongoose often requires this explicit check for array fields not yet in the DB.
    if (!booking.adminNotes) {
      booking.adminNotes = []; // Initialize it to an empty array
    }

    // Now push the new note object
    booking.adminNotes.push({
      changedAt: new Date(),
      content: notes.trim(),
      changedBy: admin._id,
    });

    // Alternatively, you can use the $push operator directly for maximum reliability,
    // which avoids Mongoose loading the array into the document first:
    /*
    const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        {
            $push: {
                adminNotes: {
                    date: new Date(),
                    content: notes.trim(),
                    changedBy: admin._id,
                },
            },
        },
        { new: true }
    );
    return updatedBooking;
    */

    await booking.save();
    return booking;
  },
};
