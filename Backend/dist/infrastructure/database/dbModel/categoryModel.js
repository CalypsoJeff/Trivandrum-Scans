"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Define the Category schema
const CategorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Unique name for each category
    },
    department: {
        type: mongoose_1.default.Schema.Types.ObjectId, // Reference to the Department (Imaging or Laboratory)
        ref: "Department",
        required: true,
    },
}, { timestamps: true });
// Create and export the Category model
exports.Category = mongoose_1.default.model("Category", CategorySchema);
