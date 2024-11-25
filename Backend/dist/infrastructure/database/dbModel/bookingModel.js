"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BookingSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    services: [
        {
            service_id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: "Service" },
            persons: [{ type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: "Patient" }],
            completed: { type: Boolean, default: false },
        },
    ],
    booking_date: { type: Date, required: true },
    booking_time_slot: { type: String, required: true },
    total_amount: { type: Number, required: true },
    status: { type: String, default: "pending" },
    stripe_session_id: { type: String, required: true },
    paymentIntentId: {
        type: String,
        required: false
    }
}, { timestamps: true });
const BookingModel = mongoose_1.default.model("Booking", BookingSchema);
exports.default = BookingModel;
