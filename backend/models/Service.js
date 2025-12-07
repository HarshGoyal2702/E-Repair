const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
});

module.exports = mongoose.model("Service", serviceSchema);
