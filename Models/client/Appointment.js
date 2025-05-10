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
    orderinfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientOrder",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["cod", "Paid", "Unpaid"],
      default: "Unpaid",
      required: true,
    },
    orderstatus: {
      type: String,
      enum: ["pending", "completed", "issue","Approved"],
      default: "pending",
      required: true,
    },

  },
  { timestamps: true }
);
const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;
//cash on delivery =cod