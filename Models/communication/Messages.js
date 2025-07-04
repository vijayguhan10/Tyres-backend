const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true },
    senderName: { type: String }, // New field
    messageText: { type: String },
    messageType: { type: String },
    messageId: { type: String },
    contextId: { type: String },  // New field
    gsId: { type: String },       // New field
    appName: { type: String },    // New field
    receivedAt: { type: Date },   // Gupshup timestamp
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
