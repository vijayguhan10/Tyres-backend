const mongoose = require("mongoose");
const OrderItemSchema = new mongoose.Schema(
  {
    tyreid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    invoiceUrl: {
      type: String,
      required: true,
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
    vehicleNumber: {
      type: String,
      required: true,
    },
    customerPurchaseType: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);
const OrderHistorySchema = new mongoose.Schema(
  {
    items: {
      type: [OrderItemSchema], // CHANGED: 1D array of items
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const OwnCustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    addressProof: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },

    orderHistory: {
      timestamps: true,
      type: [OrderHistorySchema],
      default: [],
    },
  },
  { timestamps: true }
);

const OwnCustomer = mongoose.model("fitmentclient", OwnCustomerSchema);

module.exports = OwnCustomer;
