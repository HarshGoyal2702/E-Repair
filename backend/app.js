const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const routes = require("./routes");
const { notFoundHandler } = require("./middleware/notFound.middleware");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();

/* ---------- Security ---------- */
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());

/* ---------- Logging ---------- */
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/* ---------- Rate limit ---------- */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { msg: "Too many requests, try again later" },
});
app.use("/api", limiter);

/* ---------- CORS ---------- */
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.CLIENT_URL]
    : ["http://localhost:3000", "http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

/* ---------- Routes ---------- */
app.disable("x-powered-by"); // for security purposes
app.use("/api", routes);

/* ---------- Health ---------- */
app.get("/health", (req, res) => {
  res.json({ status: "OK", uptime: process.uptime() });
});

/* ---------- 404 + Errors ---------- */
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
