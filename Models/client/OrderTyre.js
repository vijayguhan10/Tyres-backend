const mongoose = require("mongoose");

const TyreInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tyreBrand: {
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
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "issues"],
      default: "Pending",
      required: true,
    },
  },
  { timestamps: true }
);

const TyreInfo = mongoose.model("ClientOrder", TyreInfoSchema);
module.exports = TyreInfo;
