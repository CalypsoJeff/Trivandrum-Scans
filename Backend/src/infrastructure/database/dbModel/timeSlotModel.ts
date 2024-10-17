import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Define the TimeSlot interface
interface ITimeSlot extends Document {
  serviceId: Types.ObjectId; // Reference to the specific service
  date: Date; // Date for the time slot
  slots: {
    time: string; // E.g., "9 AM - 10 AM"
    available: number; // Available units for this time slot
  }[];
}

// Define the TimeSlot schema
const TimeSlotSchema: Schema<ITimeSlot> = new mongoose.Schema({
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: "Service",
    required: true, // Each time slot is tied to a specific service
  },
  date: {
    type: Date,
    required: true, // Date for the available time slots
  },
  slots: [
    {
      time: { type: String, required: true }, // Time range
      available: { type: Number, required: true }, // Units available for this time
    },
  ],
});

// Create and export the TimeSlot model
const TimeSlot: Model<ITimeSlot> = mongoose.model<ITimeSlot>(
  "TimeSlot",
  TimeSlotSchema
);
export { ITimeSlot, TimeSlot };
