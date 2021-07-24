const mongoose = require('mongoose');

const VerificationSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true
    },
    aadhaar: {
        type: String,
        required: true
    }
})

const Verification = mongoose.model('Verification', VerificationSchema);

module.exports = Verification;