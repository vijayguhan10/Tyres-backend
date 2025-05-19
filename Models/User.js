const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["client", "admin", "fitment-center", "carwash"],
    required: true,
  },
  levellogin: {
    type: String,
    enum: ["enterprice", "individual", "notmention"],
    default: "notmention",
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
