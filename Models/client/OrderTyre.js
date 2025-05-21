const mongoose = require("mongoose");
const addtyre = require("../../Models/admin/Addtyre");

const OrderItemSchema = new mongoose.Schema(
  {
    tyre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "addtyre",
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AddVehicle",
      default: null,
      required: false,
    },
    size: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
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
    totalPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Approved", "Rejected"],
      default: "Pending",
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
      required: true,
    },
    clientType: {
      type: String,
      enum: ["enterprice", "individual", "notmention"],
      default: "notmention",
      required: true,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to calculate totalPrice
TyreInfoSchema.pre("save", function (next) {
  this.totalPrice = this.orderItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
  next();
});

const TyreInfo = mongoose.model("ClientOrder", TyreInfoSchema);

module.exports = TyreInfo;
