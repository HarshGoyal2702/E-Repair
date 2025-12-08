const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ---------------- REGISTER ----------------
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role, specialty, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All required fields must be filled" });
    }

    const allowedRoles = ["user", "worker", "admin"];
    const userRole = allowedRoles.includes(role) ? role : "user";

    // ✅ Validate worker specialties
    let specialties = [];
    if (userRole === "worker") {
      if (!specialty) {
        return res.status(400).json({ msg: "Specialty is required for workers" });
      }

      specialties = Array.isArray(specialty) ? specialty : [specialty];

      if (specialties.length === 0) {
        return res.status(400).json({ msg: "At least one specialty is required" });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
      role: userRole,
      specialty: userRole === "worker" ? specialties : undefined,
      address: userRole === "user" ? address : undefined,
    });

    res.status(201).json({
      msg: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message || "Server error" });
  }
};

// ---------------- LOGIN ----------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ msg: "Account is disabled" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Role-based response
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };

    if (user.role === "user") {
      userData.address = user.address;
    }

    if (user.role === "worker") {
      userData.specialty = user.specialty;
    }

    res.status(200).json({
      msg: "Login successful",
      token,
      user: userData,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

