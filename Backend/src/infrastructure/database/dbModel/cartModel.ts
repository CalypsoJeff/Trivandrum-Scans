import mongoose, { Document, Schema, Types, model } from "mongoose";

// Define the TypeScript interface for services within the cart
interface ICartService {
  serviceId: Types.ObjectId; // Use Types.ObjectId for serviceId
  personIds?: { // Each personId will have an _id and a model reference (either User or Patient)
    _id: Types.ObjectId;
    model: string; // The model can be 'User' or 'Patient'
  }[];
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
    ref: "User", // Reference to the User model
  },
  services: [
    {
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
      personIds: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
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
const Cart = model<ICart>("Cart", cartSchema);
export default Cart;
