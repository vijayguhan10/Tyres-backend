const mongoose = require("mongoose");

const sizequantity = new mongoose.Schema(
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

const TyreRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ShopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
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
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      required: true,
    },
    deleterequest: {
      type: Boolean,
      required: true,
      default: false,
    },
    comments: {
      type: String,
      default: "",
      trim: true,
    },
    specification: [sizequantity],
    price: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

const TyreRequest = mongoose.model("TyreRequest", TyreRequestSchema);
module.exports = TyreRequest;
