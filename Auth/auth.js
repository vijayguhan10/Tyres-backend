const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const secretKey = process.env.JWT_SECRET_KEY;

const generateToken = (userId, role, levellogin) => {
  if (levellogin) {
    return jwt.sign({ userId, role, levellogin }, secretKey, { expiresIn: "5d" });
  }
  return jwt.sign({ userId, role }, secretKey, { expiresIn: "5d" });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          reject({ status: 408, message: "Token expired" });
        } else {
          reject({ status: 403, message: "Invalid token" });
        }
      } else {
        resolve(decoded);
      }
    });
  });
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
};
