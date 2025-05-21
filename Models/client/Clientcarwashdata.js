const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
  review: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
const clientcarwashSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  shopid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carwashshop",
    required: true,
  },
  review: {
    type: reviewSchema,
  },

});
const Clientcarwash = mongoose.model("Clientcarwash", clientcarwashSchema);
module.exports = Clientcarwash;
