const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["client", "admin", "fitment-center"],
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      required: true,
      default: true,
      enum: [true, false],
    },
  },
  { timestamps: true }
);
const Address = mongoose.model("Address", AddressSchema);
module.exports = Address;
