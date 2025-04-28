const mongoose = require("mongoose");

const RequestOrderSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Completed","issues"], 
        default: "Pending", 
        required: true,
    }
}, { timestamps: true });

const RequestOrder = mongoose.model("RequestOrder", RequestOrderSchema);

module.exports = RequestOrder;
