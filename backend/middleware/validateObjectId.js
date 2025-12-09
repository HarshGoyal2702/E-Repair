const mongoose = require("mongoose");

module.exports = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!id) {
      return res.status(400).json({
        msg: `${paramName} is required`,
      });
    }

    // Mongoose-safe ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        msg: `Invalid ${paramName} format`,
      });
    }

    next();
  };
};
