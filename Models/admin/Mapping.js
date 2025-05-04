const mongoose = require("mongoose");

const MappingSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
  },
  { timestamps: true }
);

const Mapping = mongoose.model("Mapping", MappingSchema);

module.exports = Mapping;
