import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  reports: [
    {
      filename: String,
      mimetype: String,
      size: Number,
      url: String, 
    },
  ],
  uploadedAt: { type: Date, default: Date.now },
  published: { type: Boolean, default: false }, 
});

export default mongoose.model("Report", reportSchema);
