const mongoose = require("mongoose");
const addtyre = require("../../Models/admin/Addtyre");

const OrderItemSchema = new mongoose.Schema(
  {
    tyre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "addtyre",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
  },
  { _id: false }
);

const TyreInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [OrderItemSchema],
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
