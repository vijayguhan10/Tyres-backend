const mongoose = require("mongoose");

const OrderHistorySchema = new mongoose.Schema(
  {
    orderId: {
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

    orderHistory: [OrderHistorySchema],
  },
  { timestamps: true }
);

const OwnCustomer = mongoose.model("fitmentclient", OwnCustomerSchema);

module.exports = OwnCustomer;
