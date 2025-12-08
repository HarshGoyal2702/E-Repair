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
      description: data.description,
      address: data.address || user.address || {},
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      createdByRoleSnapshot: user.role,
      statusHistory: [
        { status: "pending", changedBy: user._id, role: user.role },
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
      status: booking.status,
      changedBy: adminId,
      role: "admin",
    });

    await booking.save();
    return booking;
  },

  async updateStatus(bookingId, status, actor) {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error("Booking not found");

    booking.status = status;
    booking.statusHistory.push({
      status,
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
    if (["completed", "in_progress"].includes(booking.status)) {
      throw new Error("Cannot cancel now");
    }

    booking.status = "cancelled";
    booking.statusHistory.push({
      status: "cancelled",
      changedBy: user._id,
      role: "user",
    });

    await booking.save();
    return booking;
  },
};
