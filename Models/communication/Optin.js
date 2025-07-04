const mongoose = require('mongoose');

const optInUserSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    senderName: { type: String }, // Add sender's name for tracking
    consent: { type: Boolean, default: true },
    optedInAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('OptInUser', optInUserSchema);
