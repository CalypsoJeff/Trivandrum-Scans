"use strict";
// import { addToCartInDb, clearCartInDb, removeServiceFromCartinDb, userCartInDb, userUpdatedCartInDb } from "../../../infrastructure/repositories/mongoCartRepository";
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
// export default {
//   // ##-USER--##//
//   addToCart: async (userId: string, serviceId: string) => {
//     try {
//       await addToCartInDb(userId, serviceId);
//     } catch (error) {
//       console.error("Unexpected error in addToCart:", error);
//       throw new Error("An unexpected error in addToCart");
//     }
//   },
//   getCart: async (id: string) => {
//     try {
//       const cartData = await userCartInDb(id);
//       return cartData;
//     } catch (error) {
//       console.error("Unexpected error in getCart:", error);
//       throw new Error("An unexpected error in getCart");
//     }
//   },
//   getUpdatedCart: async (id: string) => {
//     try {
//       const cartData = await userUpdatedCartInDb(id);
//       return cartData;
//     } catch (error) {
//       console.error("Unexpected error in getCart:", error);
//       throw new Error("An unexpected error in getCart");
//     }
//   },
//   removeCartItem: async (userId: string, serviceId: string) => {
//     try {
//       await removeServiceFromCartinDb(userId, serviceId);
//     } catch (error) {
//       console.error("Unexpected error in removing Cart:", error);
//       throw new Error("An unexpected error in removing Cart");
//     }
//   },
//   clearCart: async (userId: string) => {
//     try {
//       await clearCartInDb(userId);
//     } catch (error) {
//       console.error("Error in clearing cart from interactor:", error);
//       throw error;
//     }
//   },
// }
const mongoCartRepository_1 = __importDefault(require("../../../infrastructure/repositories/mongoCartRepository"));
exports.default = {
    addToCart(userId, serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield mongoCartRepository_1.default.addToCart(userId, serviceId);
            }
            catch (error) {
                console.error("Unexpected error in addToCart:", error);
                throw new Error("An unexpected error occurred in addToCart");
            }
        });
    },
    getCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield mongoCartRepository_1.default.getUserCart(userId);
            }
            catch (error) {
                console.error("Unexpected error in getCart:", error);
                throw new Error("An unexpected error occurred in getCart");
            }
        });
    },
    getUpdatedCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield mongoCartRepository_1.default.getUserUpdatedCart(userId);
            }
            catch (error) {
                console.error("Unexpected error in getUpdatedCart:", error);
                throw new Error("An unexpected error occurred in getUpdatedCart");
            }
        });
    },
    removeCartItem(userId, serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield mongoCartRepository_1.default.removeServiceFromCart(userId, serviceId);
            }
            catch (error) {
                console.error("Unexpected error in removeCartItem:", error);
                throw new Error("An unexpected error occurred in removeCartItem");
            }
        });
    },
    clearCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoCartRepository_1.default.clearCart(userId);
            }
            catch (error) {
                console.error("Error in clearing cart:", error);
                throw new Error("Error clearing the cart");
            }
        });
    },
};
