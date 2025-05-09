const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
   
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    TyresRequested: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TyreRequest",
      },
    ],

    // ✅ New fields added below
    adminNotes: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
    },
    businessAddress: {
      type: String,
    },
    pincode: {
      type: String,
    },
    region: {
      type: String,
    },
    noOfStaff: {
      type: String,
    },
    openingTime: {
      type: Date,
    },
    closingTime: {
      type: Date,
    },
    daysOfOperation: {
      type: [String], // Example: ["Monday", "Tuesday"]
    },
  },
  { timestamps: true }
);

const Shop = mongoose.model("Shop", ShopSchema);
module.exports = Shop;
