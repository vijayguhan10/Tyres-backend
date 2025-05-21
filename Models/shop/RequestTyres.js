const mongoose = require("mongoose");

const TyreMetaData = new mongoose.Schema(
  {
    tyreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tyre",
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const TyreRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ShopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "fitment-push"],
      default: "Pending",
      required: true,
    },
    deleterequest: {
      type: Boolean,
      required: true,
      default: false,
    },
    comments: {
      type: String,
      default: "",
      trim: true,
    },
    specification: [TyreMetaData],
    price: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

const TyreRequest = mongoose.model("TyreRequest", TyreRequestSchema);
module.exports = TyreRequest;
