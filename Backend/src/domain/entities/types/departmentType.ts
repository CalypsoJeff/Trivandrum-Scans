import { Document } from "mongoose";

// Define the IDepartment interface, extending Mongoose's Document for typing
export interface IDepartment extends Document {
  name: string;
  description?: string;
}
