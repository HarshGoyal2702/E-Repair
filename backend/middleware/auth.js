const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyToken } = require("../utils/jwt");

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ msg: "Unauthorized: token missing" });
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ msg: "Unauthorized: user not found" });
    if (!user.isActive) return res.status(403).json({ msg: "Account disabled" });

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ msg: "Unauthorized: invalid token" });
  }
};

// authorize roles: usage -> authorize("admin"), or authorize("admin", "worker")
exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ msg: "Not authenticated" });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Forbidden: insufficient role" });
    }
    next();
  };
};
