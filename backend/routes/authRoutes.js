const express = require("express");
const { register, login } = require("../controllers/authController");
const rateLimit = require("express-rate-limit");
const { body } = require("express-validator");

const router = express.Router();

/* -------------------- RATE LIMITERS -------------------- */

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 requests per IP
  message: "Too many attempts, please try again later",
});

/* -------------------- VALIDATION -------------------- */

const validateRegister = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const validateLogin = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

/* -------------------- ROUTES -------------------- */

router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);

module.exports = router;
