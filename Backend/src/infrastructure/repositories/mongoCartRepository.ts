import mongoose from "mongoose";
import Cart from "../database/dbModel/cartModel";
import { IPatientInput } from "../../domain/entities/types/patientType";
import Patient from "../database/dbModel/patientModel";


export const addToCartInDb = async (userId: string, serviceId: string) => {
    try {
      const serviceObjectId = new mongoose.Types.ObjectId(serviceId);
      let cart = await Cart.findOne({ userId });
      if (cart) {
        const serviceExists = cart.services.find(
          (service) => service.serviceId.equals(serviceObjectId) // Use equals method for ObjectId comparison
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
  };
  export const userCartInDb = async (id: string) => {
    const userId = id;
  
    // Fetch cart data and populate both serviceId and personIds
    const cartData = await Cart.findOne({ userId })
      .populate("services.serviceId") // Populate service details
      .populate("services.personIds"); // Populate user/patient details for personIds
    if (!cartData) {
      console.error("Cart not found");
      throw new Error("Cart not found");
    }
    return cartData;
  };
  export const userUpdatedCartInDb = async (id: string) => {
    const userId = id;
  
    // Fetch cart data and populate both serviceId and personIds
    const cartData = await Cart.findOne({ userId })
      .populate("services.serviceId")
      .populate("services.personIds")
      .exec();
  
    if (!cartData) {
      console.error("Cart not found");
      throw new Error("Cart not found");
    }
  
    // Collect all patient data
    let patientData: IPatientInput[] = [];
  
    // Use for...of loop to handle async/await properly
    for (const service of cartData.services) {
      const patientIds = service.personIds
        ?.filter((person) => person.model === "Patient") // Filter only patients
        .map((person) => person._id.toString()); // Map to get the _id
      // Fetch patient data based on the IDs
      if (patientIds && patientIds.length > 0) {
        const patients = await Patient.find({ _id: { $in: patientIds } })
          .select("name age contactNumber relationToUser") // Select necessary fields
          .exec();
  
        // Merge fetched patient data into the patientData array
        patientData = [...patientData, ...patients];
      }
    }
    return {
      cart: cartData,
      patients: patientData,
    };
  };
  
  export const removeServiceFromCartinDb = async (
    userId: string,
    serviceId: string
  ) => {
    try {
      const updatedCart = await Cart.findOneAndUpdate(
        { userId: userId }, // Find cart by userId
        { $pull: { services: { serviceId: serviceId } } }, // Remove the service from services array
        { new: true } // Return the updated cart after removal
      ).populate("services.serviceId"); // Populate service details (optional)
  
      if (!updatedCart) {
        console.error("cart not found");
        throw new Error("cart not found");
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  export const clearCartInDb = async (userId: string) => {
    try {
      // Find the cart by userId and remove all services (clear the cart)
      await Cart.updateOne(
        { userId: userId }, // Find the cart by the user ID
        { $set: { services: [] } } // Set the services array to an empty array (clearing the cart)
      );
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw new Error("Error clearing the cart");
    }
  };