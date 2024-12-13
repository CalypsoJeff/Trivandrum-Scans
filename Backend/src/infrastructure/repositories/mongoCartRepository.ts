import mongoose from "mongoose";
import Cart from "../database/dbModel/cartModel";
import Patient from "../database/dbModel/patientModel";
import { IPatientInput } from "../../domain/entities/types/patientType";

class CartRepository {
  async addToCart(userId: string, serviceId: string) {
    try {
      const serviceObjectId = new mongoose.Types.ObjectId(serviceId);
      let cart = await Cart.findOne({ userId });
      if (cart) {
        const serviceExists = cart.services.find(
          (service) => service.serviceId.equals(serviceObjectId)
        );
        if (serviceExists) {
          return { success: false, message: "Service already in the cart" };
        } else {
          cart.services.push({ serviceId: serviceObjectId });
        }
      } else {
        cart = new Cart({
          userId,
          services: [{ serviceId: serviceObjectId }],
        });
      }
      await cart.save();
      return { success: true, message: "Service added to cart" };
    } catch (error) {
      console.error("Error adding service to cart:", error);
      return { success: false, message: "Failed to add service to cart", error };
    }
  }

  async getUserCart(userId: string) {
    try {
      const cartData = await Cart.findOne({ userId })
        .populate("services.serviceId")
        .populate("services.personIds");
      if (!cartData) {
        throw new Error("Cart not found");
      }
      return cartData;
    } catch (error) {
      console.error("Error fetching cart data:", error);
      throw error;
    }
  }

  async getUserUpdatedCart(userId: string) {
    try {
      const cartData = await Cart.findOne({ userId })
        .populate("services.serviceId")
        .populate("services.personIds")
        .exec();

      if (!cartData) {
        throw new Error("Cart not found");
      }

      let patientData: IPatientInput[] = [];
      for (const service of cartData.services) {
        const patientIds = service.personIds
          ?.filter((person) => person.model === "Patient")
          .map((person) => person._id.toString());
        if (patientIds && patientIds.length > 0) {
          const patients = await Patient.find({ _id: { $in: patientIds } })
            .select("name age contactNumber relationToUser")
            .exec();
          patientData = [...patientData, ...patients];
        }
      }
      return { cart: cartData, patients: patientData };
    } catch (error) {
      console.error("Error fetching updated cart data:", error);
      throw error;
    }
  }

  async removeServiceFromCart(userId: string, serviceId: string) {
    try {
      const updatedCart = await Cart.findOneAndUpdate(
        { userId },
        { $pull: { services: { serviceId: serviceId } } },
        { new: true }
      ).populate("services.serviceId");

      if (!updatedCart) {
        throw new Error("Cart not found");
      }
      return updatedCart;
    } catch (error) {
      console.error("Error removing service from cart:", error);
      throw error;
    }
  }

  async clearCart(userId: string) {
    try {
      await Cart.updateOne(
        { userId },
        { $set: { services: [] } }
      );
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw new Error("Error clearing the cart");
    }
  }
}

export default new CartRepository();
