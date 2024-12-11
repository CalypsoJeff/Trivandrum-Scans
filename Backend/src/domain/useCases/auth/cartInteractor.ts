import { addToCartInDb, clearCartInDb, removeServiceFromCartinDb, userCartInDb, userUpdatedCartInDb } from "../../../infrastructure/repositories/mongoCartRepository";

export default {
  // ##-USER--##//
  addToCart: async (userId: string, serviceId: string) => {
    try {
      await addToCartInDb(userId, serviceId);
    } catch (error) {
      console.error("Unexpected error in addToCart:", error);
      throw new Error("An unexpected error in addToCart");
    }
  },
  getCart: async (id: string) => {
    try {
      const cartData = await userCartInDb(id);
      return cartData;
    } catch (error) {
      console.error("Unexpected error in getCart:", error);
      throw new Error("An unexpected error in getCart");
    }
  },
  getUpdatedCart: async (id: string) => {
    try {
      const cartData = await userUpdatedCartInDb(id);
      return cartData;
    } catch (error) {
      console.error("Unexpected error in getCart:", error);
      throw new Error("An unexpected error in getCart");
    }
  },
  removeCartItem: async (userId: string, serviceId: string) => {
    try {
      await removeServiceFromCartinDb(userId, serviceId);
    } catch (error) {
      console.error("Unexpected error in removing Cart:", error);
      throw new Error("An unexpected error in removing Cart");
    }
  },
  clearCart: async (userId: string) => {
    try {
      await clearCartInDb(userId);
    } catch (error) {
      console.error("Error in clearing cart from interactor:", error);
      throw error;
    }
  },
}