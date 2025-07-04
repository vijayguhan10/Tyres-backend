// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true },
    messageText: { type: String },
    messageType: { type: String },
    messageId: { type: String },
    externalMessageId: { type: String },
    eventType: { type: String },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
