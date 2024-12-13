"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import BookingModel from "../database/dbModel/bookingModel";
// import { Users } from "../database/dbModel/userModel";
// import Patient from "../database/dbModel/patientModel";
// import mongoose, { Types } from "mongoose";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // ##-ADMIN--##// 
// export const getBookingsFromDb = async (page = 1, limit = 10) => {
//   try {
//     const skip = (page - 1) * limit;
//     const bookings = await BookingModel.find()
//       .populate("user_id")
//       .populate("services.service_id")
//       .sort({ booking_date: -1 })  // Sort by booking_date in descending order
//       .skip(skip)
//       .limit(limit)
//       .lean()
//       .exec();
//     const totalBookings = await BookingModel.countDocuments();
//     return { bookings, totalBookings };
//   } catch (error) {
//     console.error("Error fetching bookings from DB:", error);
//     throw error;
//   }
// };
// export const bookingDetailsInDb = async (id: string) => {
//   try {
//     // Fetch the booking without populating `persons`
//     const booking = await BookingModel.findById(id)
//       .populate("user_id") // Populating user details
//       .populate("services.service_id") // Populating service details
//       .lean(); // Convert to plain JS object
//     if (!booking) throw new Error("Booking not found");
//     // Collect person IDs from each service
//     const personIds: Types.ObjectId[] = booking.services.flatMap(
//       (service: any) => service.persons
//     );
//     // Fetch both users and patients by IDs
//     const [users, patients] = await Promise.all([
//       Users.find({ _id: { $in: personIds } }, "name age gender contactNumber").lean(),
//       Patient.find(
//         { _id: { $in: personIds } },
//         "name relationToUser age gender contactNumber"
//       ).lean(),
//     ]);
//     // Map users and patients by their IDs
//     const userMap = new Map(
//       users.map((user) => [user._id.toString(), { ...user, relationToUser: "Self" }])
//     );
//     const patientMap = new Map(
//       patients.map((patient) => [patient._id.toString(), patient])
//     );
//     // Replace ObjectIds in `persons` with populated data
//     booking.services.forEach((service: any) => {
//       service.persons = service.persons.map((personId: Types.ObjectId) => {
//         const idStr = personId.toString();
//         // Return populated User or Patient, or fallback with basic details
//         return (
//           userMap.get(idStr) ||
//           patientMap.get(idStr) || {
//             _id: personId,
//             name: "Unknown",
//             relationToUser: "N/A",
//           }
//         );
//       });
//     });
//     return booking;
//   } catch (error) {
//     console.error("Error fetching booking from DB:", error);
//     throw new Error("Error fetching booking from DB");
//   }
// };
// export const updateServiceBookinginDb = async (bookingId: string, serviceId: string, completed: boolean) => {
//   try {
//     const updatedBooking = await BookingModel.findOneAndUpdate(
//       { _id: bookingId, "services.service_id": serviceId },  // Match booking and service
//       { $set: { "services.$.completed": completed } },       // Use positional operator to set completion
//       { new: true }                                          // Return updated document
//     );
//     return updatedBooking;
//   } catch (error) {
//     console.error("Database error updating service completion status:", error);
//     throw new Error("Database error updating service completion status");
//   }
// };
// export const getCompletedBookings = async () => {
//   try {
//     const bookings = await BookingModel.find({
//       // Find bookings where every service has `completed: true`
//       services: { $all: [{ $elemMatch: { completed: true } }] }
//     })
//       .populate('user_id')
//       .populate('services.service_id')
//       .populate('services.persons');
//     console.log(bookings, "Filtered bookings with all services completed");
//     return bookings;
//   } catch (error) {
//     console.error("Error fetching completed bookings:", error);
//     throw error; // Propagate error for handling
//   }
// };
// // ##-USER--##//
// export const saveBooking = async ({
//   stripe_session_id,
//   paymentIntentId,
//   user_id,
//   booking_date,
//   services,
//   total_amount,
//   booking_time_slot,
// }: {
//   stripe_session_id: string;
//   paymentIntentId?: string,
//   user_id: string;
//   booking_date: Date;
//   services: {
//     service_id: mongoose.Types.ObjectId;
//     persons: mongoose.Types.ObjectId[];
//   }[];
//   total_amount: number;
//   booking_time_slot: string;
// }): Promise<unknown> => {
//   try {
//     const newBooking = new BookingModel({
//       stripe_session_id,
//       paymentIntentId,
//       user_id: new mongoose.Types.ObjectId(user_id),
//       booking_date,
//       services,
//       total_amount,
//       status: "confirmed",
//       booking_time_slot,
//     });
//     // Save the booking to the database
//     const savedBooking = await newBooking.save();
//     return savedBooking;
//   } catch (error) {
//     if (error instanceof Error) {
//       throw new Error(`Error saving booking: ${error.message}`);
//     }
//     throw error;
//   }
// };
// export const BookingListInDb = async (id: string) => {
//   try {
//     // Find all bookings for the given user ID and populate relevant fields
//     const bookings = await BookingModel.find({ user_id: id })
//       .populate("user_id") // Populate user details
//       .populate("services.service_id") // Populate service details
//       .populate("services.persons") // Populate patient details
//       .sort({ createdAt: -1 });
//     return bookings;
//   } catch (error) {
//     console.error("Error fetching bookings from DB:", error);
//     throw error;
//   }
// };
// export const findBookingById = async (id: string) => {
//   try {
//     // Step 1: Find booking and apply lean() to avoid Mongoose document structure
//     const booking = await BookingModel.findById(id)
//       .populate("user_id", "name email") // Populate user details
//       .populate("services.service_id", "name price") // Populate service details
//       .lean();
//     if (!booking) throw new Error("Booking not found");
//     // Step 2: Collect person IDs from each service
//     const personIds: Types.ObjectId[] = booking.services.flatMap((service: any) => service.persons);
//     // Step 3: Populate persons with User and Patient models separately
//     const [users, patients] = await Promise.all([
//       Users.find({ _id: { $in: personIds } }, "name age gender").lean(),
//       Patient.find({ _id: { $in: personIds } }, "name relationToUser age gender").lean(),
//     ]);
//     // Step 4: Map the user and patient data by their IDs
//     const userMap = new Map(users.map((user) => [user._id.toString(), { ...user, relationToUser: "Self" }]));
//     const patientMap = new Map(patients.map((patient) => [patient._id.toString(), patient]));
//     // Step 5: Replace ObjectIds in `persons` with populated data
//     booking.services.forEach((service: any) => {
//       service.persons = service.persons.map((personId: Types.ObjectId) => {
//         const idStr = personId.toString();
//         return userMap.get(idStr) || patientMap.get(idStr) || { _id: personId, name: "Unknown" };
//       });
//     });
//     return booking;
//   } catch (error) {
//     console.error("Error in findBookingById:", error);
//     throw new Error("Error fetching booking from DB");
//   }
// };
// export const cancelBookingInDb = async (id: string) => {
//   try {
//     const cancelledBooking = await BookingModel.findByIdAndUpdate(
//       id,
//       { status: "cancelled" },
//       { new: true }
//     );
//     return cancelledBooking;
//   } catch (error) {
//     console.error("Error cancelling booking:", error);
//     throw new Error("Failed to cancel booking");
//   }
// };
const bookingModel_1 = __importDefault(require("../database/dbModel/bookingModel"));
const userModel_1 = require("../database/dbModel/userModel");
const patientModel_1 = __importDefault(require("../database/dbModel/patientModel"));
const mongoose_1 = __importDefault(require("mongoose"));
class BookingRepository {
    // ##-ADMIN--##//
    getBookings() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10) {
            try {
                const skip = (page - 1) * limit;
                const bookings = yield bookingModel_1.default.find()
                    .populate("user_id")
                    .populate("services.service_id")
                    .sort({ booking_date: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean()
                    .exec();
                const totalBookings = yield bookingModel_1.default.countDocuments();
                return { bookings, totalBookings };
            }
            catch (error) {
                console.error("Error fetching bookings from DB:", error);
                throw error;
            }
        });
    }
    getBookingDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const booking = yield bookingModel_1.default.findById(id)
                    .populate("user_id")
                    .populate("services.service_id")
                    .lean();
                if (!booking)
                    throw new Error("Booking not found");
                const personIds = booking.services.flatMap((service) => service.persons);
                const [users, patients] = yield Promise.all([
                    userModel_1.Users.find({ _id: { $in: personIds } }, "name age gender contactNumber").lean(),
                    patientModel_1.default.find({ _id: { $in: personIds } }, "name relationToUser age gender contactNumber").lean(),
                ]);
                const userMap = new Map(users.map((user) => [user._id.toString(), Object.assign(Object.assign({}, user), { relationToUser: "Self" })]));
                const patientMap = new Map(patients.map((patient) => [patient._id.toString(), patient]));
                booking.services.forEach((service) => {
                    service.persons = service.persons.map((personId) => {
                        const idStr = personId.toString();
                        return (userMap.get(idStr) ||
                            patientMap.get(idStr) || { _id: personId, name: "Unknown", relationToUser: "N/A" });
                    });
                });
                return booking;
            }
            catch (error) {
                console.error("Error fetching booking from DB:", error);
                throw new Error("Error fetching booking from DB");
            }
        });
    }
    updateServiceBooking(bookingId, serviceId, completed) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield bookingModel_1.default.findOneAndUpdate({ _id: bookingId, "services.service_id": serviceId }, { $set: { "services.$.completed": completed } }, { new: true });
            }
            catch (error) {
                console.error("Error updating service booking status:", error);
                throw new Error("Database error updating service booking");
            }
        });
    }
    getCompletedBookings() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield bookingModel_1.default.find({
                    services: { $all: [{ $elemMatch: { completed: true } }] }
                })
                    .populate("user_id")
                    .populate("services.service_id")
                    .populate("services.persons");
            }
            catch (error) {
                console.error("Error fetching completed bookings:", error);
                throw error;
            }
        });
    }
    // ##-USER--##//
    saveBooking(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newBooking = new bookingModel_1.default(Object.assign(Object.assign({}, data), { user_id: new mongoose_1.default.Types.ObjectId(data.user_id), status: "confirmed" }));
                return yield newBooking.save();
            }
            catch (error) {
                console.error("Error saving booking:", error);
                throw new Error("Error saving booking");
            }
        });
    }
    getUserBookings(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield bookingModel_1.default.find({ user_id: userId })
                    .populate("user_id")
                    .populate("services.service_id")
                    .populate("services.persons")
                    .sort({ createdAt: -1 });
            }
            catch (error) {
                console.error("Error fetching user bookings:", error);
                throw error;
            }
        });
    }
    findBookingById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const booking = yield bookingModel_1.default.findById(id)
                    .populate("user_id", "name email")
                    .populate("services.service_id", "name price")
                    .lean();
                if (!booking)
                    throw new Error("Booking not found");
                const personIds = booking.services.flatMap((service) => service.persons);
                const [users, patients] = yield Promise.all([
                    userModel_1.Users.find({ _id: { $in: personIds } }, "name age gender").lean(),
                    patientModel_1.default.find({ _id: { $in: personIds } }, "name relationToUser age gender").lean(),
                ]);
                const userMap = new Map(users.map((user) => [user._id.toString(), Object.assign(Object.assign({}, user), { relationToUser: "Self" })]));
                const patientMap = new Map(patients.map((patient) => [patient._id.toString(), patient]));
                booking.services.forEach((service) => {
                    service.persons = service.persons.map((personId) => {
                        const idStr = personId.toString();
                        return userMap.get(idStr) || patientMap.get(idStr) || { _id: personId, name: "Unknown" };
                    });
                });
                return booking;
            }
            catch (error) {
                console.error("Error fetching booking by ID:", error);
                throw new Error("Error fetching booking by ID");
            }
        });
    }
    cancelBooking(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield bookingModel_1.default.findByIdAndUpdate(id, { status: "cancelled" }, { new: true });
            }
            catch (error) {
                console.error("Error canceling booking:", error);
                throw new Error("Failed to cancel booking");
            }
        });
    }
}
exports.default = new BookingRepository();
