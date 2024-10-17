import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    }, // Ensure this is correct
    service_id: [
      { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Service" },
    ], // Ensure this is correct
    booking_date: { type: Date, required: true }, // Ensure this matches with the `appointmentDate`
    total_amount: { type: Number, required: true }, // Ensure this matches
    status: { type: String, default: "pending" },
    stripe_session_id: { type: String, required: true }, // Ensure the Stripe session ID is stored here
  },
  { timestamps: true }
);

// BookingSchema.pre("save", function (next) {
//   this.updated_at = new Date();
//   next();
// });
const BookingModel = mongoose.model("Booking", BookingSchema);

export default BookingModel;
