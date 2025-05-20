const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const OwnInventory = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    model: {
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
    stock: [StockSchema],
  },
  { timestamps: true }
);
const shopinventory = mongoose.model("Owninventory", OwnInventory);
module.exports = shopinventory;
