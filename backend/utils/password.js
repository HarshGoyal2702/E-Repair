const bcrypt = require("bcryptjs");

exports.hashPassword = (password) => {
  return bcrypt.hash(password, 10);
};

exports.comparePassword = (plain, hash) => {
  return bcrypt.compare(plain, hash);
};
