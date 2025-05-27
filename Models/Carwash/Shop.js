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
        appointmentDate: {
          type: Date,
          required: true
        },
        appointmentTime: {
          type: String,
          required: true
        },
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "completed", "rejected"],
          default: "pending",
        },
    price: {
      type: Number,
      default: 0,
    },
      },
    ],
    description: {
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
      type: [String],
    },

    userReviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        review: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        description: {
          type: String,
          default: "",
        },
      },
    ],
  },
  { timestamps: true }
);

const Shop = mongoose.model("carwash", ShopSchema);
module.exports = Shop;
