import mongoose, { Document, Schema, Model } from "mongoose";
import { IDepartment } from "./departmentModel"; // Correctly importing IDepartment

// Define an interface for the Category document
interface ICategory extends Document {
  name: string;
  department: IDepartment["_id"]; 
  createdAt: Date; 
  updatedAt: Date;
}

// Define the Category schema
const CategorySchema: Schema<ICategory> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Unique name for each category
    },
    department: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Department (Imaging or Laboratory)
      ref: "Department",
      required: true,
    },
  },
  { timestamps: true }
);

// Create and export the Category model
export const Category: Model<ICategory> = mongoose.model<ICategory>(
  "Category",
  CategorySchema
);
