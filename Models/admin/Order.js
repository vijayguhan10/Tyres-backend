const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    tyreInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TyreInfo",
      required: true,
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
