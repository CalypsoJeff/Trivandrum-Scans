import mongoose, { Document, Schema } from "mongoose";
export interface Iuser extends Document {
  name?: string;
  email?: string;
  password?: string;
  address?: string;
  mobile?: string;
  age?: number;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  is_verified?: boolean;
  is_blocked?: boolean;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String }, 
  mobile: { type: String },
  age: { type: Number }, 
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  is_verified: { type: Boolean, default: false },
  is_google: { type: Boolean, default: false },
  is_blocked: { type: Boolean, default: false },
});

export const Users = mongoose.model<Iuser>("User", UserSchema);
