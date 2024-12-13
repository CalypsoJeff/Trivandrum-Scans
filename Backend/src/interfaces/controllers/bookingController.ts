import { Request, Response } from "express";
import Stripe from "stripe";
import BookingModel from "../../infrastructure/database/dbModel/bookingModel";
const stripe = new Stripe(process.env.STRIPE_KEY as string, {});
import mongoose from "mongoose";
import bookingInteractor from "../../domain/useCases/auth/bookingInteractor";
interface IService {
    serviceId: mongoose.Types.ObjectId;
    personIds: string[];
    price: number;
}
export default {
    // ##-USER--##//
    bookNow: async (req: Request, res: Response) => {
        try {
            const {
                userId,
                services,
                appointmentDate,
                appointmentTimeSlot,
                totalAmount,
            } = req.body;
            const conflictingBooking = await BookingModel.findOne({
                booking_date: appointmentDate,
                booking_time_slot: appointmentTimeSlot,
                "services.service_id": { $in: services.map((service: IService) => service.serviceId) },
                "services.persons": { $in: services.flatMap((service: IService) => service.personIds) },
            });
            if (conflictingBooking) {
                return res.status(400).json({
                    error: "One or more services are already booked for this time slot on this day.",
                });
            }
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            currency: "inr",
                            product_data: { name: "Service Booking" },
                            unit_amount: totalAmount * 100,
                        },
                        quantity: 1,
                    },
                ],
                mode: "payment",
                success_url: `${process.env.CLIENT_URL
                    }/appointment-success?session_id={CHECKOUT_SESSION_ID}&user_id=${userId}&appointment_date=${appointmentDate}&appointment_time_slot=${appointmentTimeSlot}&services=${encodeURIComponent(
                        JSON.stringify(services)
                    )}&amount=${totalAmount}`,

                cancel_url: `${process.env.CLIENT_URL}/appointment-failure`,

            });

            if (!session) {
                throw new Error("Failed to create Stripe session.");
            }
            res.json({ sessionId: session.id });
        } catch (error) {
            console.error("Error creating Stripe session:", error);
            res.status(500).json({ error: "Failed to create Stripe session" });
        }
    },
    booking: async (req: Request, res: Response) => {
        const {
            sessionId,
            userId,
            appointmentDate,
            services,
            amount,
            appointmentTimeSlot,
        } = req.body;
        try {
            const existingBooking = await BookingModel.findOne({
                stripe_session_id: sessionId,
            });
            if (existingBooking) {
                return res.status(400).json({ error: "Booking already confirmed." });
            }
            const bookingResult = await bookingInteractor.confirmBooking({
                stripe_session_id: sessionId,
                user_id: userId,
                booking_date: appointmentDate,
                services: services,
                total_amount: amount,
                booking_time_slot: appointmentTimeSlot, // Pass booking time slot
            });
            return res.status(201).json(bookingResult);
        } catch (error) {
            console.error("Error confirming booking:", error);
            return res.status(500).json({ error: "Failed to confirm booking" });
        }
    },
    getBookingList: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const bookingList = await bookingInteractor.getBookingList(id);
            res.status(200).json(bookingList);
        } catch (error) {
            console.error("Error fetching booking details:", error);
            return res.status(500).json({ error: "Failed to fetch booking list" });
        }
    },
    getBookingDetail: async (req: Request, res: Response) => {
        try {
            const { id } = req.params; // Extract the booking ID from the request params
            const booking = await bookingInteractor.getBookingById(id); // Pass the ID to the interactor to fetch details
            if (!booking) {
                return res.status(404).json({ message: "Booking not found" });
            }
            res.status(200).json(booking); // Return booking details in the response
        } catch (error) {
            console.error("Error fetching booking details:", error);
            return res
                .status(500)
                .json({ message: "Failed to fetch booking details" });
        }
    },
    cancelBooking: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const cancelledBooking = await bookingInteractor.cancelBooking(id);
            if (!cancelledBooking) {
                return res.status(404).json({ error: "Booking not found or already cancelled" });
            }
            res.status(200).json({ message: "Booking successfully cancelled", booking: cancelledBooking });
        } catch (error) {
            console.error("Error in cancelBooking controller:", error);
            res.status(500).json({ error: "Failed to cancel booking" });
        }
    },
    getAllBookings: async (req: Request, res: Response) => {
        try {
            const bookings = await BookingModel.find()
                .populate({
                    path: "services.service_id",
                    select: "name price",
                })
                .populate({
                    path: "services.persons",
                    select: "name age gender",
                });
            res.status(200).json(bookings);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },


    // ##-ADMIN--##//
    bookingList: async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const { bookings, totalBookings } = await bookingInteractor.getBookingLists(
                page,
                limit
            );
            res.status(200).json({
                bookings,
                totalPages: Math.ceil(totalBookings / limit), // Correctly calculate total pages
                currentPage: page,
            });
        } catch (error) {
            console.error("Error fetching booking list:", error);
            res.status(500).json({ message: "Failed to fetch bookings" });
        }
    },
    getBookingDetails: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const bookingDetails = await bookingInteractor.fetchBookingDetails(id);

            if (!bookingDetails) {
                return res.status(404).json({ message: "Booking not found" });
            }
            res.status(200).json(bookingDetails);
        } catch (error) {
            console.error("Error fetching booking details:", error);
            res.status(500).json({ message: "Failed to fetch details" });
        }
    },
    updateBooking: async (req: Request, res: Response) => {
        try {
            const { bookingId, serviceId } = req.params;
            const { completed } = req.body;
            const updatedBooking = await bookingInteractor.updateServiceBooking(bookingId, serviceId, completed);
            if (!updatedBooking) {
                return res.status(404).json({ message: "Booking or service not found" });
            }
            res.json({ message: "Service completion status updated", booking: updatedBooking });
        } catch (error) {
            console.error("Error updating Bookings:", error);
            res.status(500).json({ message: "Server error updating Bookings" });
        }
    },
    serviceCompleted: async (req: Request, res: Response) => {
        try {
            const bookings = await bookingInteractor.CompletedBooking();
            res.status(200).json({ bookings });
        } catch (error) {
            console.error("Error in serviceCompleted:", error);
            res.status(500).json({ message: "Failed to fetch completed bookings." });
        }
    },
}