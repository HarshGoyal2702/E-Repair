const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

/* -------------------- SECURITY MIDDLEWARE -------------------- */

// Secure headers
app.use(helmet());

// Body parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Logging (only in development)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Rate limiter – protect brute force
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: "Too many requests, please try again later",
});
app.use("/api", limiter);

// CORS (restrict in production)
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://yourdomain.com"]
    : ["http://localhost:3000", "http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

/* -------------------- ROUTES -------------------- */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));

/* -------------------- HEALTH CHECK -------------------- */

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", uptime: process.uptime() });
});

/* -------------------- GLOBAL ERROR HANDLER -------------------- */

app.use((err, req, res, next) => {
  console.error("ERROR:", err.stack);
  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

/* -------------------- GRACEFUL SHUTDOWN -------------------- */

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down...");
  await mongoose.connection.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Shutting down...");
  await mongoose.connection.close();
  process.exit(0);
});

/* -------------------- SERVER START -------------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
