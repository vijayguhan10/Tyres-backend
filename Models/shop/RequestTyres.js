const mongoose = require("mongoose");

const TyreRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tyreBrand: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      required: true,
    },
    deleterequest: {
      type: Boolean,
      enum: [true, false],
      required: true,
      default: false,
    },
    comments: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

const TyreRequest = mongoose.model("TyreRequest", TyreRequestSchema);

module.exports = TyreRequest;
