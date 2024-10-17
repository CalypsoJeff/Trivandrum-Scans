import mongoose, { Document, Schema, Types, model } from "mongoose";

// Define the TypeScript interface for services within the cart
interface ICartService {
  serviceId: Types.ObjectId; // Use Types.ObjectId for serviceId
}

// Define the TypeScript interface for the Cart document
interface ICart extends Document {
  userId: Types.ObjectId; // The user ID is an ObjectId reference
  services: ICartService[]; // An array of services
}

// Define the Mongoose schema for the cart
const cartSchema: Schema<ICart> = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  services: [
    {
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true, // Ensure serviceId is required
      },
    },
  ],
});

// Create and export the Mongoose Cart model with the interface ICart
const Cart = model<ICart>("Cart", cartSchema);
export default Cart;
