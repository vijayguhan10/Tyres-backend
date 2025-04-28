const mongoose = require("mongoose");

// Define stock schema separately if needed
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
  },
  { _id: false }
);

// Tyre Info for Client Order
const TyreInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    stock: {
      type: [StockSchema], 
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Issues"],
      default: "Pending",
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

const TyreInfo = mongoose.model("ClientOrder", TyreInfoSchema);

module.exports = TyreInfo;
