const mongoose = require("mongoose");
const Address = require("../Address");
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
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
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
  },
  { timestamps: true }
);
const Shop = mongoose.model("Shop", ShopSchema);
module.exports = Shop;
