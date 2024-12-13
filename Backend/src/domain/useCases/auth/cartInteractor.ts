import CartRepository from "../../../infrastructure/repositories/mongoCartRepository";
export default {
  async addToCart(userId: string, serviceId: string) {
    try {
      return await CartRepository.addToCart(userId, serviceId);
    } catch (error) {
      console.error("Unexpected error in addToCart:", error);
      throw new Error("An unexpected error occurred in addToCart");
    }
  },
  async getCart(userId: string) {
    try {
      return await CartRepository.getUserCart(userId);
    } catch (error) {
      console.error("Unexpected error in getCart:", error);
      throw new Error("An unexpected error occurred in getCart");
    }
  },
  async getUpdatedCart(userId: string) {
    try {
      return await CartRepository.getUserUpdatedCart(userId);
    } catch (error) {
      console.error("Unexpected error in getUpdatedCart:", error);
      throw new Error("An unexpected error occurred in getUpdatedCart");
    }
  },
  async removeCartItem(userId: string, serviceId: string) {
    try {
      return await CartRepository.removeServiceFromCart(userId, serviceId);
    } catch (error) {
      console.error("Unexpected error in removeCartItem:", error);
      throw new Error("An unexpected error occurred in removeCartItem");
    }
  },
  async clearCart(userId: string) {
    try {
      await CartRepository.clearCart(userId);
    } catch (error) {
      console.error("Error in clearing cart:", error);
      throw new Error("Error clearing the cart");
    }
  },
};
