const mongoose = require("mongoose");
const OwnInventory = require("./Owninventory");
const fitmentclient = require("./Owncustomers");
const ShopStockSchema = new mongoose.Schema(
  {
    tyreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "addtyre",
      required: true,
    },
    sizes: [
      {
        size: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { _id: false }
);
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
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Appointment",
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "completed", "rejected"],
          default: "pending",
        },
      },
    ],

    TyresRequested: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TyreRequest",
      },
    ],

    ShopStocks: {
      type: [ShopStockSchema],
      default: [],
    },

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
      type: [String],
    },

    OwnInventory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owninventory",
        default: [],
      },
    ],
    OwnCustomers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fitmentclient",
        default: [],
      },
    ],
  },

  { timestamps: true }
);

const Shop = mongoose.model("Shop", ShopSchema);
module.exports = Shop;
