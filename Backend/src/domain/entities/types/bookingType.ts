import mongoose, { Document } from "mongoose";

// Define an interface for the service in the booking
interface Service {
  service_id: mongoose.Types.ObjectId;
  persons: mongoose.Types.ObjectId[];
}

// Define the interface for the Booking document
export interface IBooking extends Document {
  user_id: mongoose.Types.ObjectId;
  services: Service[];
  booking_date: Date;
  booking_time_slot: string;
  total_amount: number;
  status: string;
  stripe_session_id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingData {
    user_id: mongoose.Types.ObjectId; // ObjectId used in MongoDB
    services: {
      service_id: mongoose.Types.ObjectId; // ObjectId used in MongoDB
      persons: mongoose.Types.ObjectId[]; // ObjectId used in MongoDB
    }[];
    appointment_date: Date;
    total_amount: number;
    status: string;
    stripe_session_id: string;
  } 
  
  export interface BookingInput {
    sessionId: string;
    userId: string; // Expecting userId as string from input
    appointmentDate: Date;
    services: {
      serviceId: string; // Expecting serviceId as string from input
      personIds: string[]; // Expecting personIds as strings
    }[];
    amount: number;
  }
  
  
