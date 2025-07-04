// models/OptInUser.js
const mongoose = require('mongoose');

const optInUserSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    consent: { type: Boolean, default: true },
    optedInAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('OptInUser', optInUserSchema);
