/* eslint-disable no-useless-catch */
// /* eslint-disable no-useless-catch */
// import { BookingListInDb, cancelBookingInDb, findBookingById, saveBooking } from "../../../infrastructure/repositories/mongoBookingRepository";
// import { bookingDetailsInDb, getBookingsFromDb, getCompletedBookings, updateServiceBookinginDb } from "../../../infrastructure/repositories/mongoBookingRepository";
// import mongoose from "mongoose";
// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_KEY as string, {});



// export default {

//     // ##-USER--##//
//     getBookingList: async (id: string) => {
//         try {
//             return await BookingListInDb(id);
//         } catch (error) {
//             console.error("Error in getBookingList:", error);
//             throw error;
//         }
//     },
//     getBookingById: async (id: string) => {
//         try {
//             const booking = await findBookingById(id); // Call repository to get booking details
//             return booking;
//         } catch (error) {
//             console.error("Error in userInteractor:", error);
//             throw new Error("Failed to fetch booking details");
//         }
//     },
//     cancelBooking: async (id: string) => {
//         try {
//             const cancelledBooking = await cancelBookingInDb(id);
//             if (!cancelledBooking) {
//                 throw new Error("Booking not found or already cancelled");
//             }
//             if (cancelledBooking.paymentIntentId) {
//                 try {
//                     const refund = await stripe.refunds.create({
//                         payment_intent: cancelledBooking.paymentIntentId,
//                     });
//                     console.log(refund.id, 'refund successfull ');
//                 } catch (error) {
//                     console.error("Error in refund:", error);
//                 }
//             } else {
//                 console.log('no payment intent id found ');
//             }
//             return cancelledBooking;
//         } catch (error) {
//             console.error("Error in cancelBooking:", error);
//             throw error;
//         }
//     },
//     confirmBooking: async ({
//         stripe_session_id,
//         user_id,
//         booking_date,
//         services,
//         total_amount,
//         booking_time_slot,
//     }: {
//         stripe_session_id: string;
//         user_id: string;
//         booking_date: Date;
//         services: {
//             serviceId: string;
//             personIds: { _id: string }[];
//         }[];
//         total_amount: number;
//         booking_time_slot: string;
//     }): Promise<{ success: boolean; booking: unknown }> => {
//         try {
//             const session = await stripe.checkout.sessions.retrieve(stripe_session_id);
//             if (!session || session.payment_status !== "paid") {
//                 throw new Error("Payment not completed or unsuccessful.");
//             }
//             const paymentIntentId = session.payment_intent
//                 ? (typeof session.payment_intent === 'string'
//                     ? session.payment_intent
//                     : session.payment_intent.id)
//                 : null;
//             if (!paymentIntentId) {
//                 throw new Error("Payment Intent ID is missing.");
//             }
//             const servicesWithObjectIds = services.map((service) => ({
//                 service_id: new mongoose.Types.ObjectId(service.serviceId),
//                 persons: service.personIds.map(
//                     (person) => new mongoose.Types.ObjectId(person._id)
//                 ),
//             }));
//             const savedBooking = await saveBooking({
//                 stripe_session_id,
//                 paymentIntentId,
//                 user_id,
//                 booking_date,
//                 services: servicesWithObjectIds,
//                 total_amount,
//                 booking_time_slot,
//             });
//             return { success: true, booking: savedBooking };
//         } catch (error) {
//             if (error instanceof Error) {
//                 throw new Error(`Error confirming booking: ${error.message}`);
//             }
//             throw error;
//         }
//     },



//     // ##-ADMIN--##//

//     getBookingLists: async (page = 1, limit = 10) => {
//         try {
//             return await getBookingsFromDb(page, limit);
//         } catch (error) {
//             throw error;
//         }
//     },
//     fetchBookingDetails: async (id: string) => {
//         try {
//             const bookingDetails = await bookingDetailsInDb(id);
//             return bookingDetails;
//         } catch (error) {
//             console.error("Error fetching booking details:", error);
//             throw error;
//         }
//     },
//     updateServiceBooking: async (bookingId: string, serviceId: string, completed: boolean) => {
//         try {
//             const updatedBooking = await updateServiceBookinginDb(bookingId, serviceId, completed);
//             return updatedBooking;
//         } catch (error) {
//             console.error("Error in service booking update:", error);
//             throw new Error("Error in service booking update");
//         }
//     },
//     CompletedBooking: async () => {
//         try {
//             const completedBookings = await getCompletedBookings();
//             return completedBookings;
//         } catch (error) {
//             console.error("Error in CompletedBooking:", error);
//             throw error;
//         }
//     },

// }


import BookingRepository from "../../../infrastructure/repositories/mongoBookingRepository";
import mongoose from "mongoose";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_KEY as string, {});

export default {
  getBookingList: async (id: string) => {
    try {
      return await BookingRepository.getUserBookings(id);
    } catch (error) {
      console.error("Error in getBookingList:", error);
      throw error;
    }
  },
  getBookingById: async (id: string) => {
    try {
      return await BookingRepository.findBookingById(id);
    } catch (error) {
      console.error("Error in getBookingById:", error);
      throw error;
    }
  },
  cancelBooking: async (id: string) => {
    try {
      const cancelledBooking = await BookingRepository.cancelBooking(id);
      if (!cancelledBooking) {
        throw new Error("Booking not found or already cancelled");
      }
      if (cancelledBooking.paymentIntentId) {
        try {
          await stripe.refunds.create({ payment_intent: cancelledBooking.paymentIntentId });
        } catch (error) {
          console.error("Error processing refund:", error);
        }
      }
      return cancelledBooking;
    } catch (error) {
      console.error("Error in cancelBooking:", error);
      throw error;
    }
  },
  confirmBooking: async (data: {
    stripe_session_id: string;
    user_id: string;
    booking_date: Date;
    services: { serviceId: string; personIds: { _id: string }[] }[];
    total_amount: number;
    booking_time_slot: string;
  }) => {
    try {
      const session = await stripe.checkout.sessions.retrieve(data.stripe_session_id);
      if (!session || session.payment_status !== "paid") {
        throw new Error("Payment not completed or unsuccessful.");
      }
      const paymentIntentId = session.payment_intent?.toString();
      if (!paymentIntentId) {
        throw new Error("Payment Intent ID is missing.");
      }
      const servicesWithObjectIds = data.services.map((service) => ({
        service_id: new mongoose.Types.ObjectId(service.serviceId),
        persons: service.personIds.map((person) => new mongoose.Types.ObjectId(person._id)),
      }));
      return await BookingRepository.saveBooking({
        ...data,
        paymentIntentId,
        services: servicesWithObjectIds,
      });
    } catch (error) {
      console.error("Error confirming booking:", error);
      throw error;
    }
  },
  getBookingLists: async (page = 1, limit = 10) => {
    try {
      return await BookingRepository.getBookings(page, limit);
    } catch (error) {
      throw error;
    }
  },
  fetchBookingDetails: async (id: string) => {
    try {
      return await BookingRepository.getBookingDetails(id);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      throw error;
    }
  },
  updateServiceBooking: async (bookingId: string, serviceId: string, completed: boolean) => {
    try {
      return await BookingRepository.updateServiceBooking(bookingId, serviceId, completed);
    } catch (error) {
      console.error("Error in service booking update:", error);
      throw new Error("Error in service booking update");
    }
  },
  CompletedBooking: async () => {
    try {
      return await BookingRepository.getCompletedBookings();
    } catch (error) {
      console.error("Error in CompletedBooking:", error);
      throw error;
    }
  },
};
