const mongoose = require("mongoose");
const Address = require("../Address");

const ShopSchema = new mongoose.Schema(
  {
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
        ref: "RequestOrder", 
      },
    ],
  },
  { timestamps: true }
);

const Shop = mongoose.model("Shop", ShopSchema);

module.exports = Shop;
