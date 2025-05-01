const mongoose = require("mongoose");

const AddVehicleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    vehicleType: {
      type: String,
      required: true,
    },
    vehicleModel: {
      type: String,
      required: true,
      trim: true,
    },
    servicesDone: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const AddVehicle = mongoose.model("AddVehicle", AddVehicleSchema);

module.exports = AddVehicle;
