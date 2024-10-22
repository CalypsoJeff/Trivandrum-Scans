import mongoose, { Schema } from "mongoose";
import { IBooking } from "../../../domain/entities/types/bookingType";

const BookingSchema: Schema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    services: [
      {
        service_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Service" },
        persons: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Patient" }],
      },
    ],
    booking_date: { type: Date, required: true },
    booking_time_slot: { type: String, required: true },
    total_amount: { type: Number, required: true },
    status: { type: String, default: "pending" },
    stripe_session_id: { type: String, required: true },
  },
  { timestamps: true }
);

const BookingModel = mongoose.model<IBooking>("Booking", BookingSchema);

export default BookingModel;
