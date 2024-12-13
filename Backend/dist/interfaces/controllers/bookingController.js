"use strict";
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
const stripe_1 = __importDefault(require("stripe"));
const bookingModel_1 = __importDefault(require("../../infrastructure/database/dbModel/bookingModel"));
const stripe = new stripe_1.default(process.env.STRIPE_KEY, {});
const bookingInteractor_1 = __importDefault(require("../../domain/useCases/auth/bookingInteractor"));
exports.default = {
    // ##-USER--##//
    bookNow: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, services, appointmentDate, appointmentTimeSlot, totalAmount, } = req.body;
            const conflictingBooking = yield bookingModel_1.default.findOne({
                booking_date: appointmentDate,
                booking_time_slot: appointmentTimeSlot,
                "services.service_id": { $in: services.map((service) => service.serviceId) },
                "services.persons": { $in: services.flatMap((service) => service.personIds) },
            });
            if (conflictingBooking) {
                return res.status(400).json({
                    error: "One or more services are already booked for this time slot on this day.",
                });
            }
            const session = yield stripe.checkout.sessions.create({
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
                success_url: `${process.env.CLIENT_URL}/appointment-success?session_id={CHECKOUT_SESSION_ID}&user_id=${userId}&appointment_date=${appointmentDate}&appointment_time_slot=${appointmentTimeSlot}&services=${encodeURIComponent(JSON.stringify(services))}&amount=${totalAmount}`,
                cancel_url: `${process.env.CLIENT_URL}/appointment-failure`,
            });
            if (!session) {
                throw new Error("Failed to create Stripe session.");
            }
            res.json({ sessionId: session.id });
        }
        catch (error) {
            console.error("Error creating Stripe session:", error);
            res.status(500).json({ error: "Failed to create Stripe session" });
        }
    }),
    booking: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { sessionId, userId, appointmentDate, services, amount, appointmentTimeSlot, } = req.body;
        try {
            const existingBooking = yield bookingModel_1.default.findOne({
                stripe_session_id: sessionId,
            });
            if (existingBooking) {
                return res.status(400).json({ error: "Booking already confirmed." });
            }
            const bookingResult = yield bookingInteractor_1.default.confirmBooking({
                stripe_session_id: sessionId,
                user_id: userId,
                booking_date: appointmentDate,
                services: services,
                total_amount: amount,
                booking_time_slot: appointmentTimeSlot, // Pass booking time slot
            });
            return res.status(201).json(bookingResult);
        }
        catch (error) {
            console.error("Error confirming booking:", error);
            return res.status(500).json({ error: "Failed to confirm booking" });
        }
    }),
    getBookingList: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const bookingList = yield bookingInteractor_1.default.getBookingList(id);
            res.status(200).json(bookingList);
        }
        catch (error) {
            console.error("Error fetching booking details:", error);
            return res.status(500).json({ error: "Failed to fetch booking list" });
        }
    }),
    getBookingDetail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params; // Extract the booking ID from the request params
            const booking = yield bookingInteractor_1.default.getBookingById(id); // Pass the ID to the interactor to fetch details
            if (!booking) {
                return res.status(404).json({ message: "Booking not found" });
            }
            res.status(200).json(booking); // Return booking details in the response
        }
        catch (error) {
            console.error("Error fetching booking details:", error);
            return res
                .status(500)
                .json({ message: "Failed to fetch booking details" });
        }
    }),
    cancelBooking: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const cancelledBooking = yield bookingInteractor_1.default.cancelBooking(id);
            if (!cancelledBooking) {
                return res.status(404).json({ error: "Booking not found or already cancelled" });
            }
            res.status(200).json({ message: "Booking successfully cancelled", booking: cancelledBooking });
        }
        catch (error) {
            console.error("Error in cancelBooking controller:", error);
            res.status(500).json({ error: "Failed to cancel booking" });
        }
    }),
    getAllBookings: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const bookings = yield bookingModel_1.default.find()
                .populate({
                path: "services.service_id",
                select: "name price",
            })
                .populate({
                path: "services.persons",
                select: "name age gender",
            });
            res.status(200).json(bookings);
        }
        catch (error) {
            console.error("Error fetching bookings:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }),
    // ##-ADMIN--##//
    bookingList: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const { bookings, totalBookings } = yield bookingInteractor_1.default.getBookingLists(page, limit);
            res.status(200).json({
                bookings,
                totalPages: Math.ceil(totalBookings / limit), // Correctly calculate total pages
                currentPage: page,
            });
        }
        catch (error) {
            console.error("Error fetching booking list:", error);
            res.status(500).json({ message: "Failed to fetch bookings" });
        }
    }),
    getBookingDetails: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const bookingDetails = yield bookingInteractor_1.default.fetchBookingDetails(id);
            if (!bookingDetails) {
                return res.status(404).json({ message: "Booking not found" });
            }
            res.status(200).json(bookingDetails);
        }
        catch (error) {
            console.error("Error fetching booking details:", error);
            res.status(500).json({ message: "Failed to fetch details" });
        }
    }),
    updateBooking: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { bookingId, serviceId } = req.params;
            const { completed } = req.body;
            const updatedBooking = yield bookingInteractor_1.default.updateServiceBooking(bookingId, serviceId, completed);
            if (!updatedBooking) {
                return res.status(404).json({ message: "Booking or service not found" });
            }
            res.json({ message: "Service completion status updated", booking: updatedBooking });
        }
        catch (error) {
            console.error("Error updating Bookings:", error);
            res.status(500).json({ message: "Server error updating Bookings" });
        }
    }),
    serviceCompleted: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const bookings = yield bookingInteractor_1.default.CompletedBooking();
            res.status(200).json({ bookings });
        }
        catch (error) {
            console.error("Error in serviceCompleted:", error);
            res.status(500).json({ message: "Failed to fetch completed bookings." });
        }
    }),
};
