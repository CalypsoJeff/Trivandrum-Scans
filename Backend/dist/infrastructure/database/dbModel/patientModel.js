"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PatientSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    relationToUser: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});
// Create and export the Mongoose model with TypeScript interface
const Patient = (0, mongoose_1.model)('Patient', PatientSchema);
exports.default = Patient;
