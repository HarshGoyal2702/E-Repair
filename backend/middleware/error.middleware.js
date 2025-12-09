exports.errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err.stack);

  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
};
