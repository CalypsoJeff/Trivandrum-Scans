import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the Department interface
export interface IDepartment extends Document {
  name: string;
  description?: string;
}

// Define the Department schema
const DepartmentSchema: Schema<IDepartment> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
}, { timestamps: true });


export const Department: Model<IDepartment> = mongoose.model<IDepartment>('Department', DepartmentSchema);
