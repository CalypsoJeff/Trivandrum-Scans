"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define the Mongoose schema for the cart
const cartSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User", // Reference to the User model
    },
    services: [
        {
            serviceId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Service",
                required: true,
            },
            personIds: [
                {
                    _id: {
                        type: mongoose_1.default.Schema.Types.ObjectId,
                        required: true,
                        refPath: "services.personIds.model", // Dynamic reference to either User or Patient
                    },
                    model: {
                        type: String,
                        required: true,
                        enum: ["User", "Patient"], // The model can be either 'User' or 'Patient'
                    },
                },
            ],
        },
    ],
});
// Create and export the Mongoose Cart model with the interface ICart
const Cart = (0, mongoose_1.model)("Cart", cartSchema);
exports.default = Cart;
