"use strict";
// import mongoose from "mongoose";
// import Cart from "../database/dbModel/cartModel";
// import { IPatientInput } from "../../domain/entities/types/patientType";
// import Patient from "../database/dbModel/patientModel";
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
// export const addToCartInDb = async (userId: string, serviceId: string) => {
//     try {
//       const serviceObjectId = new mongoose.Types.ObjectId(serviceId);
//       let cart = await Cart.findOne({ userId });
//       if (cart) {
//         const serviceExists = cart.services.find(
//           (service) => service.serviceId.equals(serviceObjectId) // Use equals method for ObjectId comparison
//         );
//         if (serviceExists) {
//           return { success: false, message: "Service already in the cart" };
//         } else {
//           cart.services.push({ serviceId: serviceObjectId });
//         }
//       } else {
//         cart = new Cart({
//           userId,
//           services: [{ serviceId: serviceObjectId }],
//         });
//       }
//       await cart.save();
//       return { success: true, message: "Service added to cart" };
//     } catch (error) {
//       console.error("Error adding service to cart:", error);
//       return { success: false, message: "Failed to add service to cart", error };
//     }
//   };
//   export const userCartInDb = async (id: string) => {
//     const userId = id;
//     // Fetch cart data and populate both serviceId and personIds
//     const cartData = await Cart.findOne({ userId })
//       .populate("services.serviceId") // Populate service details
//       .populate("services.personIds"); // Populate user/patient details for personIds
//     if (!cartData) {
//       console.error("Cart not found");
//       throw new Error("Cart not found");
//     }
//     return cartData;
//   };
//   export const userUpdatedCartInDb = async (id: string) => {
//     const userId = id;
//     // Fetch cart data and populate both serviceId and personIds
//     const cartData = await Cart.findOne({ userId })
//       .populate("services.serviceId")
//       .populate("services.personIds")
//       .exec();
//     if (!cartData) {
//       console.error("Cart not found");
//       throw new Error("Cart not found");
//     }
//     // Collect all patient data
//     let patientData: IPatientInput[] = [];
//     // Use for...of loop to handle async/await properly
//     for (const service of cartData.services) {
//       const patientIds = service.personIds
//         ?.filter((person) => person.model === "Patient") // Filter only patients
//         .map((person) => person._id.toString()); // Map to get the _id
//       // Fetch patient data based on the IDs
//       if (patientIds && patientIds.length > 0) {
//         const patients = await Patient.find({ _id: { $in: patientIds } })
//           .select("name age contactNumber relationToUser") // Select necessary fields
//           .exec();
//         // Merge fetched patient data into the patientData array
//         patientData = [...patientData, ...patients];
//       }
//     }
//     return {
//       cart: cartData,
//       patients: patientData,
//     };
//   };
//   export const removeServiceFromCartinDb = async (
//     userId: string,
//     serviceId: string
//   ) => {
//     try {
//       const updatedCart = await Cart.findOneAndUpdate(
//         { userId: userId }, // Find cart by userId
//         { $pull: { services: { serviceId: serviceId } } }, // Remove the service from services array
//         { new: true } // Return the updated cart after removal
//       ).populate("services.serviceId"); // Populate service details (optional)
//       if (!updatedCart) {
//         console.error("cart not found");
//         throw new Error("cart not found");
//       }
//     } catch (error) {
//       console.error("Error removing cart item:", error);
//     }
//   };
//   export const clearCartInDb = async (userId: string) => {
//     try {
//       // Find the cart by userId and remove all services (clear the cart)
//       await Cart.updateOne(
//         { userId: userId }, // Find the cart by the user ID
//         { $set: { services: [] } } // Set the services array to an empty array (clearing the cart)
//       );
//     } catch (error) {
//       console.error("Error clearing cart:", error);
//       throw new Error("Error clearing the cart");
//     }
//   };
const mongoose_1 = __importDefault(require("mongoose"));
const cartModel_1 = __importDefault(require("../database/dbModel/cartModel"));
const patientModel_1 = __importDefault(require("../database/dbModel/patientModel"));
class CartRepository {
    addToCart(userId, serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serviceObjectId = new mongoose_1.default.Types.ObjectId(serviceId);
                let cart = yield cartModel_1.default.findOne({ userId });
                if (cart) {
                    const serviceExists = cart.services.find((service) => service.serviceId.equals(serviceObjectId));
                    if (serviceExists) {
                        return { success: false, message: "Service already in the cart" };
                    }
                    else {
                        cart.services.push({ serviceId: serviceObjectId });
                    }
                }
                else {
                    cart = new cartModel_1.default({
                        userId,
                        services: [{ serviceId: serviceObjectId }],
                    });
                }
                yield cart.save();
                return { success: true, message: "Service added to cart" };
            }
            catch (error) {
                console.error("Error adding service to cart:", error);
                return { success: false, message: "Failed to add service to cart", error };
            }
        });
    }
    getUserCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cartData = yield cartModel_1.default.findOne({ userId })
                    .populate("services.serviceId")
                    .populate("services.personIds");
                if (!cartData) {
                    throw new Error("Cart not found");
                }
                return cartData;
            }
            catch (error) {
                console.error("Error fetching cart data:", error);
                throw error;
            }
        });
    }
    getUserUpdatedCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const cartData = yield cartModel_1.default.findOne({ userId })
                    .populate("services.serviceId")
                    .populate("services.personIds")
                    .exec();
                if (!cartData) {
                    throw new Error("Cart not found");
                }
                let patientData = [];
                for (const service of cartData.services) {
                    const patientIds = (_a = service.personIds) === null || _a === void 0 ? void 0 : _a.filter((person) => person.model === "Patient").map((person) => person._id.toString());
                    if (patientIds && patientIds.length > 0) {
                        const patients = yield patientModel_1.default.find({ _id: { $in: patientIds } })
                            .select("name age contactNumber relationToUser")
                            .exec();
                        patientData = [...patientData, ...patients];
                    }
                }
                return { cart: cartData, patients: patientData };
            }
            catch (error) {
                console.error("Error fetching updated cart data:", error);
                throw error;
            }
        });
    }
    removeServiceFromCart(userId, serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCart = yield cartModel_1.default.findOneAndUpdate({ userId }, { $pull: { services: { serviceId: serviceId } } }, { new: true }).populate("services.serviceId");
                if (!updatedCart) {
                    throw new Error("Cart not found");
                }
                return updatedCart;
            }
            catch (error) {
                console.error("Error removing service from cart:", error);
                throw error;
            }
        });
    }
    clearCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield cartModel_1.default.updateOne({ userId }, { $set: { services: [] } });
            }
            catch (error) {
                console.error("Error clearing cart:", error);
                throw new Error("Error clearing the cart");
            }
        });
    }
}
exports.default = new CartRepository();
