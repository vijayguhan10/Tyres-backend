const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    tyreInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientOrder",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "issues"],
      default: "Pending",
      required: true,
    },
  },
  { timestamps: true }
);
const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;
