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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userInteractor_1 = __importDefault(require("../../domain/useCases/auth/userInteractor"));
const userModel_1 = require("../../infrastructure/database/dbModel/userModel");
const stripe_1 = __importDefault(require("stripe"));
const cartModel_1 = __importDefault(require("../../infrastructure/database/dbModel/cartModel"));
const bookingModel_1 = __importDefault(require("../../infrastructure/database/dbModel/bookingModel"));
const jwtHelper_1 = require("../../domain/helper/jwtHelper");
const mongoUserRepository_1 = require("../../infrastructure/repositories/mongoUserRepository");
const serviceModel_1 = require("../../infrastructure/database/dbModel/serviceModel");
const hashPassword_1 = require("../../domain/helper/hashPassword");
const stripe = new stripe_1.default(process.env.STRIPE_KEY, {});
exports.default = {
    getStatus: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.query.id;
            const response = yield userInteractor_1.default.getStatus(id);
            console.log(response, 'vvvvv');
            res.status(200).json({ response });
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }),
    userRegistration: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userInteractor_1.default.registerUser(req.body);
            res.status(200).json({ message: "Registration Success", user });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in userRegistration:", error.message);
                if (error.message === "User already exists") {
                    res.status(409).json({ message: error.message });
                }
                else {
                    res
                        .status(500)
                        .json({ message: error.message || "Internal Server Error" });
                }
            }
            else {
                console.error("Unexpected error in userRegistration:", error);
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    }),
    verifyOTP: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userdata = yield userInteractor_1.default.verifyUser(req.body);
            res.status(200).json({ message: "Verify Success", userdata });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in verifyOTP:", error.message);
                res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            }
            else {
                console.error("Unexpected error in verifyOTP:", error);
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    }),
    resendOTP: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: "Email is required." });
            }
            const response = yield userInteractor_1.default.otpResend(email);
            res.status(200).json({ response });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in resendOTP:", error.message);
                res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            }
            else {
                console.error("Unexpected error in resendOTP:", error);
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    }),
    userLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const response = yield userInteractor_1.default.loginUser(email, password);
            const { token, refreshToken } = response;
            res.cookie("usertoken", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });
            res.status(200).json({ message: "Login success", response });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in userLogin:", error.message);
                // Handle specific error messages
                if (error.message === "Account is Blocked") {
                    return res.status(403).json({ message: "Account is Blocked" });
                }
                if (error.message === "Invalid password") {
                    return res.status(401).json({ message: "Invalid password" });
                }
                if (error.message === "User not found") {
                    return res.status(404).json({ message: "User not found" });
                }
                if (error.message === "User is not verified") {
                    return res.status(403).json({ message: "User is not verified" });
                }
                // Fallback for any unexpected error messages
                return res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            }
            else {
                console.error("Unexpected error in userLogin:", error);
                return res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    }),
    googleAuth: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield userInteractor_1.default.googleUser(req.body);
            console.log(response);
            res.status(200).json({ message: "Google Auth Success", response });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in googleAuth:", error.message);
                res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            }
            else {
                console.error("Unexpected error in googleAuth:", error);
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    }),
    forgotPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield userInteractor_1.default.forgotPassword(req.body.email);
            res.status(200).json(response);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in forgotPassword:", error.message);
                res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            }
            else {
                console.error("Unexpected error in forgotPassword:", error);
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    }),
    reset_PasswordFn: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { token, password } = req.body;
            if (!token || !password) {
                return res
                    .status(400)
                    .json({ message: "Token and password are required." });
            }
            const response = yield userInteractor_1.default.resetPassword(token, password);
            res.status(200).json(response);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in reset_PasswordFn:", error.message);
                res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            }
            else {
                console.error("Unexpected error in reset_PasswordFn:", error);
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    checkAuth: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Hellooooo checkauth");
    }),
    refreshToken: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const refreshToken = req.cookies.refreshToken;
            console.log(refreshToken, 'refreshToken in request');
            if (!refreshToken) {
                return res.status(401).json({ message: "Refresh token not provided" });
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
                console.log(decoded, 'decoded refresh token data');
                const user = yield (0, mongoUserRepository_1.getUserbyEMail)(decoded.email);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                const { token: newAccessToken, refreshToken: newRefreshToken } = (0, jwtHelper_1.generateToken)(user.id, decoded.email, 'user');
                res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
                res.json({ accessToken: newAccessToken });
            }
            catch (err) {
                if (err instanceof Error) {
                    if (err.name === 'TokenExpiredError') {
                        return res.status(401).json({ message: "Refresh token expired" });
                    }
                    return res.status(403).json({ message: "Invalid refresh token" });
                }
                // Handle non-Error types if necessary
                return res.status(500).json({ message: "An unknown error occurred" });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    updateUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, address, mobile, age } = req.body; // Destructure all fields from the request body
        const { userId } = req.params;
        try {
            const user = yield userModel_1.Users.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            user.name = name || user.name;
            user.address = address || user.address;
            user.mobile = mobile || user.mobile;
            user.age = age || user.age;
            const updatedUser = yield user.save();
            res.status(200).json(updatedUser);
        }
        catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({ message: "Failed to update user" });
        }
    }),
    getServiceDetail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const fetchedServiceDetail = yield userInteractor_1.default.getServiceData(id);
            res.status(200).json(fetchedServiceDetail);
        }
        catch (error) {
            console.error("Error fetching service detail :", error);
            res.status(500).json();
        }
    }),
    getServices: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { page = 1, limit = 10 } = req.query;
            const serviceList = yield userInteractor_1.default.getServiceList(Number(page), Number(limit));
            res.status(200).json(serviceList);
        }
        catch (error) {
            console.error("Failed to retrieve services", error);
            res.status(500).json({ message: "Failed to retrieve services" });
        }
    }),
    addToCart: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, serviceId } = req.body;
            yield userInteractor_1.default.addToCart(userId, serviceId);
            res.status(200).json({ message: "successfully added to cart" });
        }
        catch (error) {
            console.error("Failed to add service to user cart", error);
            res.status(500).json({ message: "Failed to add service to user cart" });
        }
    }),
    fetchCart: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const cart = yield userInteractor_1.default.getCart(id);
            res.status(200).json(cart);
        }
        catch (error) {
            console.error("Failed to add service to user cart", error);
            res.status(500).json({ message: "Failed to add service to user cart" });
        }
    }),
    fetchUpdatedCart: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const cart = yield userInteractor_1.default.getUpdatedCart(id);
            res.status(200).json(cart);
        }
        catch (error) {
            console.error("Failed to add service to user cart", error);
            res.status(500).json({ message: "Failed to add service to user cart" });
        }
    }),
    removeCartItemById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, serviceId } = req.body;
            yield userInteractor_1.default.removeCartItem(userId, serviceId);
            res.status(200).json();
        }
        catch (error) {
            console.error("Failed to remove service from user cart", error);
            res
                .status(500)
                .json({ message: "Failed to remove service from user cart" });
        }
    }),
    bookNow: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, services, appointmentDate, appointmentTimeSlot, totalAmount, } = req.body;
            // Validate against existing bookings
            const conflictingBooking = yield bookingModel_1.default.findOne({
                booking_date: appointmentDate,
                booking_time_slot: appointmentTimeSlot,
                "services.service_id": { $in: services.map((service) => service.serviceId) },
                "services.persons": { $in: services.flatMap((service) => service.personIds) },
            });
            console.log(conflictingBooking, '124');
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
    getUserData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const user = yield userModel_1.Users.findById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(user);
        }
        catch (error) {
            console.error("Error fetching userdata:", error);
            res.status(500).json({ error: "Error fetching userdata" });
        }
    }),
    editUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { fieldToChange } = req.body;
            const editedUser = yield userInteractor_1.default.editUser(id, fieldToChange);
            res.status(200).json(editedUser);
        }
        catch (error) {
            console.error("Error updating user data:", error);
            res.status(500).json({ message: "Error updating user data" });
        }
    }),
    addPatient: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, relationToUser, age, gender, contactNumber, userId } = req.body;
            const patientData = {
                name,
                relationToUser,
                age,
                gender,
                contactNumber,
                userId,
            };
            const addedPatient = yield userInteractor_1.default.addPatient(patientData, userId);
            res.status(201).json(addedPatient);
        }
        catch (error) {
            console.error("Error adding patient data:", error);
            res.status(500).json({ message: "Failed to add patient", error });
        }
    }),
    getFamilyData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(404).json({ message: "id not foundss" });
            }
            const familyData = yield userInteractor_1.default.getFamilyData(id);
            res.status(200).json(familyData);
        }
        catch (error) {
            console.error("Error fetching family data:", error);
            res.status(500).json({ message: "Error fetching family data", error });
        }
    }),
    updateCart: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params; // Ensure `id` is being passed correctly (userId)
        const { services } = req.body;
        try {
            // Fetch the cart by userId
            const cart = yield cartModel_1.default.findOne({ userId: id });
            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }
            services.forEach((serviceUpdate) => {
                const { serviceId, personIds } = serviceUpdate;
                if (!personIds || personIds.length === 0) {
                    return res
                        .status(400)
                        .json({ message: "No person IDs found for service" });
                }
                cart.services.forEach((cartService) => {
                    if (cartService.serviceId.toString() === serviceId.toString()) {
                        cartService.personIds = personIds.map((personId) => ({
                            _id: personId, // Assign the ObjectId
                            model: personId.toString() === id ? "User" : "Patient", // Check if the personId belongs to the User
                        }));
                    }
                });
            });
            yield cart.save();
            res.status(200).json(cart);
        }
        catch (error) {
            console.error("Error updating cart data:", error);
            res.status(500).json({ message: "Error updating cart data", error });
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
            // Call the interactor to handle the booking logic
            const bookingResult = yield userInteractor_1.default.confirmBooking({
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
            const bookingList = yield userInteractor_1.default.getBookingList(id);
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
            const booking = yield userInteractor_1.default.getBookingById(id); // Pass the ID to the interactor to fetch details
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
    clearCart: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.body;
            if (!userId) {
                return res.status(400).json({ message: "User ID is required" });
            }
            yield userInteractor_1.default.clearCart(userId);
            res.status(200).json({ message: "Cart cleared successfully" });
        }
        catch (error) {
            console.error("Error clearing cart:", error);
            res.status(500).json({ message: "Error clearing cart" });
        }
    }),
    cancelBooking: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const cancelledBooking = yield userInteractor_1.default.cancelBooking(id);
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
    getCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const categories = yield userInteractor_1.default.getCategories();
            if (!categories) {
                return res.status(404).json({ message: "No categories found" });
            }
            res.status(200).json({ categories });
        }
        catch (error) {
            console.error("Error fetching categories:", error);
            res.status(500).json({ message: "Server error" });
        }
    }),
    reportList: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const reportList = yield userInteractor_1.default.reportList(id);
            res.status(200).json(reportList);
        }
        catch (error) {
            console.error("Error in reportList controller:", error);
            res.status(500).json({ message: "Failed to fetch report list" });
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
    getAllServices: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const services = yield serviceModel_1.Service.find({ isAvailable: true });
            res.status(200).json(services);
        }
        catch (error) {
            console.error('Error fetching services:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),
    changePassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { currentPassword, newPassword, userId } = req.body;
        try {
            const user = yield userModel_1.Users.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (!user.password) {
                return res.status(400).json({ message: 'User password not set' });
            }
            const isMatch = yield hashPassword_1.Encrypt.comparePassword(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
            const hashedPassword = yield hashPassword_1.Encrypt.cryptPassword(newPassword);
            user.password = hashedPassword;
            yield user.save();
            res.status(200).json({ message: 'Password updated successfully' });
        }
        catch (error) {
            console.error('Error changing password:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),
};
