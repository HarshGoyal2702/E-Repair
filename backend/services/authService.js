const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/password");

exports.registerUser = async (data) => {
  const { name, email, password, phone, role, specialty, address } = data;
  if (!name || !email || !password) {
    throw new Error(
      "All required fields (name, email, password) must be filled"
    );
  }
  const allowedRoles = ["user", "worker", "admin"];
  const userRole = allowedRoles.includes(role) ? role : "user";

  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already exists");
  if (userRole == "user") {
    if (!address) {
      throw new Error("Address is a required field");
    }
  }
  const hashed = await hashPassword(password);

  let specialties = [];
  if (userRole === "worker") {
    if (!specialty) {
      throw new Error("Specialty is required for workers");
    }
    specialties = Array.isArray(specialty) ? specialty : [specialty];
    if (specialties.length === 0) {
      throw new Error("At least one specialty is required");
    }
  }

  const user = await User.create({
    name,
    email,
    phone,
    password: hashed,
    role: userRole,
    specialty: userRole === "worker" ? specialties : undefined,
    address: userRole === "user" ? address : undefined,
  });

  return user;
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid email or password");

  if (!user.isActive) throw new Error("Account disabled");

  const match = await comparePassword(password, user.password);
  if (!match) throw new Error("Invalid email or password");

  return user;
};
