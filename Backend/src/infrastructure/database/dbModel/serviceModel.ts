import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { ICategory } from "../../../domain/entities/types/categoryType";

// Define an interface for the Service document
interface IService extends Document {
  name: string;
  price: number;
  preTestPreparations: string[];
  expectedResultDuration: string;
  category: Types.ObjectId | ICategory;
  description?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  serviceImageUrl: string;
}

// Define the Service schema
const ServiceSchema: Schema<IService> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    preTestPreparations: [
      {
        type: String,
      },
    ],
    expectedResultDuration: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    serviceImageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

// Create and export the Service model
const Service: Model<IService> = mongoose.model<IService>(
  "Service",
  ServiceSchema
);

// Export the IService interface for use in other parts of your application
export { IService, Service };
