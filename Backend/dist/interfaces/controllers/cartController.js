"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cartModel_1 = __importDefault(require("../../infrastructure/database/dbModel/cartModel"));
const cartInteractor_1 = __importDefault(require("../../domain/useCases/auth/cartInteractor"));
exports.default = {
    addToCart: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, serviceId } = req.body;
            yield cartInteractor_1.default.addToCart(userId, serviceId);
            res.status(200).json({ message: "successfully added to cart" });
        }
        catch (error) {
            console.error("Failed to add service to user cart", error);
            res.status(500).json({ message: "Failed to add service to user cart" });
        }
    }),
    fetchCart: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const cart = yield cartInteractor_1.default.getCart(id);
            res.status(200).json(cart);
        }
        catch (error) {
            console.error("Failed to add service to user cart", error);
            res.status(500).json({ message: "Failed to add service to user cart" });
        }
    }),
    fetchUpdatedCart: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const cart = yield cartInteractor_1.default.getUpdatedCart(id);
            res.status(200).json(cart);
        }
        catch (error) {
            console.error("Failed to add service to user cart", error);
            res.status(500).json({ message: "Failed to add service to user cart" });
        }
    }),
    removeCartItemById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, serviceId } = req.body;
            yield cartInteractor_1.default.removeCartItem(userId, serviceId);
            res.status(200).json();
        }
        catch (error) {
            console.error("Failed to remove service from user cart", error);
            res
                .status(500)
                .json({ message: "Failed to remove service from user cart" });
        }
    }),
    updateCart: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params; // Ensure `id` is being passed correctly (userId)
        const { services } = req.body;
        try {
            const cart = yield cartModel_1.default.findOne({ userId: id });
            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }
            services.forEach((serviceUpdate) => {
                const { serviceId, personIds } = serviceUpdate;
                if (!personIds || personIds.length === 0) {
                    return res
                        .status(400)
                        .json({ message: "No person IDs found for service" });
                }
                cart.services.forEach((cartService) => {
                    if (cartService.serviceId.toString() === serviceId.toString()) {
                        cartService.personIds = personIds.map((personId) => ({
                            _id: personId, // Assign the ObjectId
                            model: personId.toString() === id ? "User" : "Patient",
                        }));
                    }
                });
            });
            yield cart.save();
            res.status(200).json(cart);
        }
        catch (error) {
            console.error("Error updating cart data:", error);
            res.status(500).json({ message: "Error updating cart data", error });
        }
    }),
    clearCart: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.body;
            if (!userId) {
                return res.status(400).json({ message: "User ID is required" });
            }
            yield cartInteractor_1.default.clearCart(userId);
            res.status(200).json({ message: "Cart cleared successfully" });
        }
        catch (error) {
            console.error("Error clearing cart:", error);
            res.status(500).json({ message: "Error clearing cart" });
        }
    }),
};
