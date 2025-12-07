const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {
  const booking = await Booking.create({ ...req.body, user: req.user.id });
  res.json(booking);
};

exports.getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id });
  res.json(bookings);
};

exports.updateStatus = async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(booking);
};
