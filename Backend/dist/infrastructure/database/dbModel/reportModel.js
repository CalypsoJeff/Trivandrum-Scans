"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reportSchema = new mongoose_1.default.Schema({
    bookingId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Booking", required: true },
    reports: [
        {
            filename: String,
            mimetype: String,
            size: Number,
            // url: String,
            key: String,
        },
    ],
    uploadedAt: { type: Date, default: Date.now },
    published: { type: Boolean, default: false },
});
exports.default = mongoose_1.default.model("Report", reportSchema);
