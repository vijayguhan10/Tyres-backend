const mongoose = require("mongoose");

const TyreInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tyreinfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "addtyre",
      required: true,
    },
    deleted: {
      type: Boolean,
      required: true,
      default: false,
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
