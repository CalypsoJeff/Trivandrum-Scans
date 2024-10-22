import mongoose from 'mongoose';

// Input data interface (without Mongoose-specific fields)
export interface IPatientInput {
  name: string;
  relationToUser: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contactNumber: string;
  userId: mongoose.Schema.Types.ObjectId;
}

// Full Mongoose Document interface (with Mongoose-specific fields)
export interface IPatient extends IPatientInput, mongoose.Document {}
