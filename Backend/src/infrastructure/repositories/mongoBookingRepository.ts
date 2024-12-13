/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
import BookingModel from "../database/dbModel/bookingModel";
import { Users } from "../database/dbModel/userModel";
import Patient from "../database/dbModel/patientModel";
import mongoose, { Types } from "mongoose";
class BookingRepository {
  // ##-ADMIN--##//

  async getBookings(page = 1, limit = 10): Promise<{ bookings: any[]; totalBookings: number }> {
    try {
      const skip = (page - 1) * limit;
      const bookings = await BookingModel.find()
        .populate("user_id")
        .populate("services.service_id")
        .sort({ booking_date: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();

      const totalBookings = await BookingModel.countDocuments();
      return { bookings, totalBookings };
    } catch (error) {
      console.error("Error fetching bookings from DB:", error);
      throw error;
    }
  }

  async getBookingDetails(id: string): Promise<any> {
    try {
      const booking = await BookingModel.findById(id)
        .populate("user_id")
        .populate("services.service_id")
        .lean();

      if (!booking) throw new Error("Booking not found");

      const personIds: Types.ObjectId[] = booking.services.flatMap(
        (service: any) => service.persons
      );

      const [users, patients] = await Promise.all([
        Users.find({ _id: { $in: personIds } }, "name age gender contactNumber").lean(),
        Patient.find(
          { _id: { $in: personIds } },
          "name relationToUser age gender contactNumber"
        ).lean(),
      ]);

      const userMap = new Map(users.map((user) => [user._id.toString(), { ...user, relationToUser: "Self" }]));
      const patientMap = new Map(patients.map((patient) => [patient._id.toString(), patient]));

      booking.services.forEach((service: any) => {
        service.persons = service.persons.map((personId: Types.ObjectId) => {
          const idStr = personId.toString();
          return (
            userMap.get(idStr) ||
            patientMap.get(idStr) || { _id: personId, name: "Unknown", relationToUser: "N/A" }
          );
        });
      });

      return booking;
    } catch (error) {
      console.error("Error fetching booking from DB:", error);
      throw new Error("Error fetching booking from DB");
    }
  }

  async updateServiceBooking(bookingId: string, serviceId: string, completed: boolean): Promise<any> {
    try {
      return await BookingModel.findOneAndUpdate(
        { _id: bookingId, "services.service_id": serviceId },
        { $set: { "services.$.completed": completed } },
        { new: true }
      );
    } catch (error) {
      console.error("Error updating service booking status:", error);
      throw new Error("Database error updating service booking");
    }
  }

  async getCompletedBookings(): Promise<any[]> {
    try {
      return await BookingModel.find({
        services: { $all: [{ $elemMatch: { completed: true } }] }
      })
        .populate("user_id")
        .populate("services.service_id")
        .populate("services.persons");
    } catch (error) {
      console.error("Error fetching completed bookings:", error);
      throw error;
    }
  }

  // ##-USER--##//

  async saveBooking(data: {
    stripe_session_id: string;
    paymentIntentId?: string;
    user_id: string;
    booking_date: Date;
    services: { service_id: mongoose.Types.ObjectId; persons: mongoose.Types.ObjectId[] }[];
    total_amount: number;
    booking_time_slot: string;
  }): Promise<any> {
    try {
      const newBooking = new BookingModel({
        ...data,
        user_id: new mongoose.Types.ObjectId(data.user_id),
        status: "confirmed",
      });

      return await newBooking.save();
    } catch (error) {
      console.error("Error saving booking:", error);
      throw new Error("Error saving booking");
    }
  }

  async getUserBookings(userId: string): Promise<any[]> {
    try {
      return await BookingModel.find({ user_id: userId })
        .populate("user_id")
        .populate("services.service_id")
        .populate("services.persons")
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      throw error;
    }
  }

  async findBookingById(id: string) {
    try {
      const booking = await BookingModel.findById(id)
        .populate("user_id", "name email")
        .populate("services.service_id", "name price")
        .lean();

      if (!booking) throw new Error("Booking not found");

      const personIds: Types.ObjectId[] = booking.services.flatMap((service: any) => service.persons);
      const [users, patients] = await Promise.all([
        Users.find({ _id: { $in: personIds } }, "name age gender").lean(),
        Patient.find({ _id: { $in: personIds } }, "name relationToUser age gender").lean(),
      ]);

      const userMap = new Map(users.map((user) => [user._id.toString(), { ...user, relationToUser: "Self" }]));
      const patientMap = new Map(patients.map((patient) => [patient._id.toString(), patient]));

      booking.services.forEach((service: any) => {
        service.persons = service.persons.map((personId: Types.ObjectId) => {
          const idStr = personId.toString();
          return userMap.get(idStr) || patientMap.get(idStr) || { _id: personId, name: "Unknown" };
        });
      });

      return booking;
    } catch (error) {
      console.error("Error fetching booking by ID:", error);
      throw new Error("Error fetching booking by ID");
    }
  }

  async cancelBooking(id: string): Promise<any> {
    try {
      return await BookingModel.findByIdAndUpdate(
        id,
        { status: "cancelled" },
        { new: true }
      );
    } catch (error) {
      console.error("Error canceling booking:", error);
      throw new Error("Failed to cancel booking");
    }
  }
}

export default new BookingRepository(); 