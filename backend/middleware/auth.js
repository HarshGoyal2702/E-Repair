const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization || "";
    if (authHeader.startsWith("Bearer ")) token = authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ msg: "Not authorized, token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ msg: "Not authorized, user not found" });
    if (!user.isActive) return res.status(403).json({ msg: "Account disabled" });

    // attach user object (no password)
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: "Not authorized (invalid token)" });
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
