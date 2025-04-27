const mongoose = require("mongoose");

const TyreSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Tubeless", "Tube", "Radial", "Bias"],
      required: true,
    },
    vehicleType: {
      type: String,
      enum: ["Car", "Bike", "Truck", "Bus", "SUV", "Van", "Tractor"],
      required: true,
    },
    loadIndex: {
      type: Number,
      required: true,
    },
    speedRating: {
      type: String,
      required: true,
    },
    quantityInStock: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    warranty: {
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Tyre = mongoose.model("Tyre", TyreSchema);

module.exports = Tyre;
