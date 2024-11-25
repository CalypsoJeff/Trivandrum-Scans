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
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoUserRepository_1 = require("../../../infrastructure/repositories/mongoUserRepository");
const emailUtils_1 = require("../../../utils/emailUtils");
const otpUtils_1 = require("../../../utils/otpUtils");
const hashPassword_1 = require("../../helper/hashPassword");
const jwtHelper_1 = require("../../helper/jwtHelper");
const stripe_1 = __importDefault(require("stripe"));
const mongoose_1 = __importDefault(require("mongoose"));
const stripe = new stripe_1.default(process.env.STRIPE_KEY, {});
function createError(message, status) {
    const error = new Error(message);
    error.status = status;
    return error;
}
exports.default = {
    registerUser: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!userData.email || !userData.name) {
                throw new Error("Email and name are required");
            }
            const existingUser = yield (0, mongoUserRepository_1.checkExistingUser)(userData.email, userData.name);
            if (existingUser && existingUser.is_verified == true) {
                throw new Error("User already exists");
            }
            const otp = yield (0, otpUtils_1.generateOTP)();
            console.log(`OTP: ${otp}`);
            const generatedAt = Date.now();
            yield (0, emailUtils_1.sendOTPEmail)(userData.email, otp, userData.name);
            yield (0, mongoUserRepository_1.saveOtp)(userData.email, otp, generatedAt);
            const password = userData.password;
            const hashedPassword = yield hashPassword_1.Encrypt.cryptPassword(password);
            const savedUser = yield (0, mongoUserRepository_1.createUser)(userData, hashedPassword);
            return savedUser;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in registerUser:", error.message);
                throw error;
            }
            else {
                console.error("Unexpected error in registerUser:", error);
                throw new Error("An unexpected error occurred");
            }
        }
    }),
    verifyUser: (data) => __awaiter(void 0, void 0, void 0, function* () {
        if (!data.otp) {
            throw new Error("no otp");
        }
        const storedOTP = yield (0, mongoUserRepository_1.getStoredOTP)(data.email);
        console.log("Stored OTP: ", storedOTP);
        if (!storedOTP || storedOTP.otp !== data.otp) {
            console.log("invalid otp");
            throw new Error("Invalid Otp");
        }
        const otpGeneratedAt = storedOTP.generatedAt;
        const currentTime = Date.now();
        const otpAge = currentTime - otpGeneratedAt.getTime();
        const expireOTP = 1 * 60 * 1000;
        if (otpAge > expireOTP) {
            throw new Error("OTP Expired");
        }
        return yield (0, mongoUserRepository_1.verifyUserDb)(data.email);
    }),
    otpResend: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newotp = yield (0, otpUtils_1.generateOTP)();
            const generatedAt = Date.now();
            const users = yield (0, mongoUserRepository_1.getUserbyEMail)(email);
            if (users && users.name) {
                yield (0, emailUtils_1.sendOTPEmail)(email, newotp, users.name);
                console.log("newOtp:", newotp);
                yield (0, mongoUserRepository_1.saveOtp)(email, newotp, generatedAt);
            }
            else {
                throw new Error("Please signup again");
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in registerUser:", error.message);
                throw error;
            }
            else {
                console.error("Unexpected error in registerUser:", error);
                throw new Error("An unexpected error occurred");
            }
        }
    }),
    loginUser: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = yield (0, mongoUserRepository_1.getUserbyEMail)(email);
        if (!existingUser || !existingUser.password) {
            throw new Error("User not found");
        }
        const isValid = yield hashPassword_1.Encrypt.comparePassword(password, existingUser.password);
        if (!isValid) {
            throw new Error("Invalid password");
        }
        if (existingUser && existingUser.is_blocked) {
            throw new Error("Account is Blocked");
        }
        if (existingUser.is_verified == false) {
            throw new Error(`User is not verified.Register!`);
        }
        const role = "user";
        const { token, refreshToken } = yield (0, jwtHelper_1.generateToken)(existingUser.id, email, role);
        const user = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            isBlocked: existingUser.is_blocked,
        };
        return { token, user, refreshToken };
    }),
    getStatus: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield (0, mongoUserRepository_1.getStatus)(id);
        }
        catch (error) {
            console.error(error.message);
            throw error;
        }
    }),
    googleUser: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const savedUser = yield (0, mongoUserRepository_1.googleUser)(userData);
            console.log("Saved User:", savedUser);
            if (savedUser) {
                const user = {
                    id: savedUser._id,
                    name: savedUser.name,
                    email: savedUser.email,
                };
                console.log("User Object:", user);
                if (!savedUser._id || !savedUser.email) {
                    throw new Error("User not found");
                }
                if (savedUser.is_blocked) {
                    throw createError("Account is Blocked", 403);
                }
                const role = "user";
                const { token, refreshToken } = (0, jwtHelper_1.generateToken)(savedUser.id, savedUser.email, role);
                console.log(token, refreshToken, "refresh");
                return { user, token, refreshToken };
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in registerUser:", error.message);
                throw error;
            }
            else {
                console.error("Unexpected error in registerUser:", error);
                throw new Error("An unexpected error occurred");
            }
        }
    }),
    forgotPassword: (email) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, mongoUserRepository_1.getUserbyEMail)(email);
        if (!user) {
            throw new Error("User not found");
        }
        const resetToken = (0, jwtHelper_1.generateResetToken)(email);
        console.log(resetToken, "this is reset token");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);
        yield user.save();
        yield (0, emailUtils_1.sendVerifyMail)(user.email || "", resetToken, user.name || "User");
        return { message: "Password reset email sent" };
    }),
    resetPassword: (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, mongoUserRepository_1.getUserByResetToken)(token);
        if (!user) {
            throw new Error("Invalid or expired reset token");
        }
        if (!user.email) {
            throw new Error("User email not found");
        }
        if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
            throw new Error("Reset token has expired");
        }
        const isTokenValid = (0, jwtHelper_1.validateResetToken)(token, user.email);
        if (!isTokenValid) {
            throw new Error("Invalid reset token");
        }
        const hashedPassword = yield hashPassword_1.Encrypt.cryptPassword(newPassword);
        yield (0, mongoUserRepository_1.updateUserPassword)(user.id, hashedPassword);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        yield user.save();
        return { message: "Password has been reset successfully" };
    }),
    getServiceData: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const service = yield (0, mongoUserRepository_1.getService)(id);
        return service;
    }),
    getServiceList: (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const services = yield (0, mongoUserRepository_1.getPaginatedServices)(page, limit); // Update to use the new function
            return services;
        }
        catch (error) {
            console.error("Error fetching service list:", error);
            throw new Error("Error fetching service list");
        }
    }),
    addToCart: (userId, serviceId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, mongoUserRepository_1.addToCartInDb)(userId, serviceId);
        }
        catch (error) {
            console.error("Unexpected error in addToCart:", error);
            throw new Error("An unexpected error in addToCart");
        }
    }),
    getCart: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const cartData = yield (0, mongoUserRepository_1.userCartInDb)(id);
            return cartData;
        }
        catch (error) {
            console.error("Unexpected error in getCart:", error);
            throw new Error("An unexpected error in getCart");
        }
    }),
    getUpdatedCart: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const cartData = yield (0, mongoUserRepository_1.userUpdatedCartInDb)(id);
            return cartData;
        }
        catch (error) {
            console.error("Unexpected error in getCart:", error);
            throw new Error("An unexpected error in getCart");
        }
    }),
    removeCartItem: (userId, serviceId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, mongoUserRepository_1.removeServiceFromCartinDb)(userId, serviceId);
        }
        catch (error) {
            console.error("Unexpected error in removing Cart:", error);
            throw new Error("An unexpected error in removing Cart");
        }
    }),
    editUser: (id, fieldToChange) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedUser = yield (0, mongoUserRepository_1.editUserInDb)(id, fieldToChange);
            return updatedUser;
        }
        catch (error) {
            console.error("Error updating user", error);
            throw new Error("Error updating user");
        }
    }),
    addPatient: (patientData, userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Call the repository to add patient to the database
            const addedPatient = yield (0, mongoUserRepository_1.addPatientInDb)(patientData, userId);
            return addedPatient; // Return the added patient
        }
        catch (error) {
            console.error("Error in adding patient: ", error);
            throw new Error("Error in adding patient");
        }
    }),
    getFamilyData: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const familyData = (0, mongoUserRepository_1.getFamilyDataInDb)(id);
            return familyData;
        }
        catch (error) {
            console.error("Error fetching patient: ", error);
            throw new Error("Error fetching patient");
        }
    }),
    getCategories: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield (0, mongoUserRepository_1.getCategories)();
        }
        catch (error) {
            console.error("Error in userInteractor getCategories:", error);
            throw error; // Re-throw to be handled by the controller
        }
    }),
    // bookAppointment: async (
    //   user_id: string,
    //   service_id: [],
    //   booking_date: Date,
    //   total_amount: number,
    //   status: string,
    //   stripe_session_id: string,
    //   booking_time_slot: string
    // ) => {
    //   return await bookAppointment(
    //     user_id,
    //     service_id,
    //     booking_date,
    //     total_amount,
    //     "success",
    //     stripe_session_id,
    //     booking_time_slot
    //   );
    // },
    // confirmBooking: async ({
    //   stripe_session_id,
    //   user_id,
    //   booking_date,
    //   services,
    //   total_amount,
    //   booking_time_slot,
    // }: {
    //   stripe_session_id: string;
    //   user_id: string;
    //   booking_date: Date;
    //   services: {
    //     serviceId: string;
    //     personIds: { _id: string }[];
    //   }[];
    //   total_amount: number;
    //   booking_time_slot: string;
    // }): Promise<{ success: boolean; booking: unknown }> => {
    //   try {
    //     // Verify the Stripe payment session
    //     const session = await stripe.checkout.sessions.retrieve(
    //       stripe_session_id
    //     );
    //     if (!session || session.payment_status !== "paid"&& session.payment_intent) {
    //       throw new Error("Payment not completed or unsuccessful.");
    //     }
    //     const servicesWithObjectIds = services.map((service) => ({
    //       service_id: new mongoose.Types.ObjectId(service.serviceId), // Convert serviceId to ObjectId
    //       persons: service.personIds.map(
    //         (person) => new mongoose.Types.ObjectId(person._id)
    //       ), // Convert each person._id to ObjectId
    //     }));
    //     const savedBooking = await saveBooking({
    //       stripe_session_id,
    //       paymentIntentId:session.payment_intent.toString(),
    //       user_id,
    //       booking_date,
    //       services: servicesWithObjectIds,
    //       total_amount,
    //       booking_time_slot,
    //     });
    //     return { success: true, booking: savedBooking };
    //   } catch (error) {
    //     if (error instanceof Error) {
    //       throw new Error(`Error confirming booking: ${error.message}`);
    //     }
    //     throw error;
    //   }
    // },
    confirmBooking: (_a) => __awaiter(void 0, [_a], void 0, function* ({ stripe_session_id, user_id, booking_date, services, total_amount, booking_time_slot, }) {
        try {
            // Verify the Stripe payment session
            const session = yield stripe.checkout.sessions.retrieve(stripe_session_id);
            // Ensure the session exists and the payment is successful
            if (!session || session.payment_status !== "paid") {
                throw new Error("Payment not completed or unsuccessful.");
            }
            // Extract the payment intent ID, ensuring it's not null
            const paymentIntentId = session.payment_intent
                ? (typeof session.payment_intent === 'string'
                    ? session.payment_intent
                    : session.payment_intent.id)
                : null;
            if (!paymentIntentId) {
                throw new Error("Payment Intent ID is missing.");
            }
            // Convert service and person IDs to ObjectId for MongoDB
            const servicesWithObjectIds = services.map((service) => ({
                service_id: new mongoose_1.default.Types.ObjectId(service.serviceId),
                persons: service.personIds.map((person) => new mongoose_1.default.Types.ObjectId(person._id)),
            }));
            // Save the booking with paymentIntentId
            const savedBooking = yield (0, mongoUserRepository_1.saveBooking)({
                stripe_session_id,
                paymentIntentId,
                user_id,
                booking_date,
                services: servicesWithObjectIds,
                total_amount,
                booking_time_slot,
            });
            return { success: true, booking: savedBooking };
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error confirming booking: ${error.message}`);
            }
            throw error;
        }
    }),
    getBookingList: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Call the database query function to get bookings
            return yield (0, mongoUserRepository_1.BookingListInDb)(id);
        }
        catch (error) {
            console.error("Error in getBookingList:", error);
            throw error;
        }
    }),
    getBookingById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const booking = yield (0, mongoUserRepository_1.findBookingById)(id); // Call repository to get booking details
            return booking;
        }
        catch (error) {
            console.error("Error in userInteractor:", error);
            throw new Error("Failed to fetch booking details");
        }
    }),
    clearCart: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Clear the cart in the database
            yield (0, mongoUserRepository_1.clearCartInDb)(userId);
        }
        catch (error) {
            console.error("Error in clearing cart from interactor:", error);
            throw error;
        }
    }),
    cancelBooking: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const cancelledBooking = yield (0, mongoUserRepository_1.cancelBookingInDb)(id);
            if (!cancelledBooking) {
                throw new Error("Booking not found or already cancelled");
            }
            if (cancelledBooking.paymentIntentId) {
                try {
                    const refund = yield stripe.refunds.create({
                        payment_intent: cancelledBooking.paymentIntentId,
                    });
                    console.log(refund.id, 'refund successfull ');
                }
                catch (error) {
                    console.error("Error in refund:", error);
                }
            }
            else {
                console.log('no payment intent id found ');
            }
            return cancelledBooking;
        }
        catch (error) {
            console.error("Error in cancelBooking:", error);
            throw error;
        }
    }),
    reportList: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const reportList = yield (0, mongoUserRepository_1.reportListInDb)(id);
            return reportList;
        }
        catch (error) {
            console.error("Error in reportList interactor:", error);
            throw new Error("Failed to fetch report list");
        }
    })
};
