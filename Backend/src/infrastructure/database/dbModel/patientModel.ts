import mongoose, { Schema, Document, model } from "mongoose";

export interface IPatient extends Document {
  name: string;
  relationToUser: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contactNumber: string;
  userId: mongoose.Schema.Types.ObjectId;
}

const PatientSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  relationToUser: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Create and export the Mongoose model with TypeScript interface
const Patient = model<IPatient>('Patient', PatientSchema);

export default Patient;
