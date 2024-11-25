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
exports.reportListInDb = exports.getCategories = exports.cancelBookingInDb = exports.clearCartInDb = exports.findBookingById = exports.BookingListInDb = exports.saveBooking = exports.getFamilyDataInDb = exports.addPatientInDb = exports.editUserInDb = exports.removeServiceFromCartinDb = exports.userUpdatedCartInDb = exports.userCartInDb = exports.addToCartInDb = exports.getPaginatedServices = exports.getService = exports.updateUserPassword = exports.getUserByResetToken = exports.resetPassword = exports.googleUser = exports.getStoredOTP = exports.saveOtp = exports.verifyUserDb = exports.createUser = exports.getUserbyEMail = exports.checkExistingUser = exports.getStatus = void 0;
const hashPassword_1 = require("../../domain/helper/hashPassword");
const categoryModel_1 = require("../database/dbModel/categoryModel");
const otpModel_1 = __importDefault(require("../database/dbModel/otpModel"));
const cartModel_1 = __importDefault(require("../database/dbModel/cartModel"));
const serviceModel_1 = require("../database/dbModel/serviceModel");
const userModel_1 = require("../database/dbModel/userModel");
const mongoose_1 = __importDefault(require("mongoose"));
const cartModel_2 = __importDefault(require("../database/dbModel/cartModel"));
const bookingModel_1 = __importDefault(require("../database/dbModel/bookingModel"));
const patientModel_1 = __importDefault(require("../database/dbModel/patientModel"));
const reportModel_1 = __importDefault(require("../database/dbModel/reportModel"));
const getStatus = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.Users.findOne({ _id: id });
    console.log(user);
    return user;
});
exports.getStatus = getStatus;
const checkExistingUser = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield userModel_1.Users.findOne({
        $and: [{ email: email }, { name: name }],
    });
    return existingUser;
});
exports.checkExistingUser = checkExistingUser;
const getUserbyEMail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userModel_1.Users.findOne({ email: email });
});
exports.getUserbyEMail = getUserbyEMail;
const createUser = (userData, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userData.email || !userData.name) {
        throw new Error("Email and Name are required");
    }
    const email = userData.email;
    const name = userData.name;
    const existingUser = yield (0, exports.checkExistingUser)(email, name);
    if (existingUser) {
        if (existingUser.is_verified === false) {
            return existingUser;
        }
        throw new Error(`User already exist`);
    }
    if (!userData.name || !userData.email || !userData.password) {
        throw new Error("Name, Email, and Password are required fields");
    }
    const newUser = new userModel_1.Users({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
    });
    return yield newUser.save();
});
exports.createUser = createUser;
const verifyUserDb = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield userModel_1.Users.findOneAndUpdate({ email: email }, { $set: { is_verified: true } }, { new: true });
    return userData;
});
exports.verifyUserDb = verifyUserDb;
const saveOtp = (email, otp, generatedAt) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const otpForStore = new otpModel_1.default({ otp, email, generatedAt });
        return yield otpForStore.save();
    }
    catch (error) {
        console.error("Error saving OTP:", error);
        throw new Error("Error saving OTP");
    }
});
exports.saveOtp = saveOtp;
const getStoredOTP = (email) => __awaiter(void 0, void 0, void 0, function* () { return yield otpModel_1.default.findOne({ email: email }).sort({ createdAt: -1 }).limit(1); });
exports.getStoredOTP = getStoredOTP;
// Function to handle Google User authentication and sign-up if user doesn't exist
const googleUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!userData.email || !userData.name) {
            throw new Error("User data is incomplete");
        }
        // Check if the user already exists by email
        const existingUser = yield userModel_1.Users.findOne({ email: userData.email });
        if (existingUser) {
            console.log("User already exists:", existingUser);
            return existingUser; // Return the existing user
        }
        // If user does not exist, create a new one
        const generatePass = Math.random().toString(36).slice(-8); // Generate a random password
        const hashedPassword = yield hashPassword_1.Encrypt.cryptPassword(generatePass); // Hash the generated password
        const newUser = new userModel_1.Users({
            name: userData.name,
            email: userData.email,
            password: hashedPassword, // Save the hashed password
            is_google: true,
        });
        // Save the new user to the database
        return yield newUser.save();
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in googleUser:", error.message);
            throw error;
        }
        else {
            console.error("Unexpected error in googleUser:", error);
            throw new Error("An unexpected error occurred during Google user authentication.");
        }
    }
});
exports.googleUser = googleUser;
const resetPassword = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedData = yield userModel_1.Users.updateOne({ email: email }, { $set: { token: token } });
    return updatedData;
});
exports.resetPassword = resetPassword;
const getUserByResetToken = (resetToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the user by reset token
        const user = yield userModel_1.Users.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpires: { $gt: new Date() },
        });
        return user;
    }
    catch (error) {
        console.error("Error fetching user by reset token:", error);
        throw new Error("Invalid or expired reset token");
    }
});
exports.getUserByResetToken = getUserByResetToken;
const updateUserPassword = (userId, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find user by ID and update the password field
        const user = yield userModel_1.Users.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true } // Return the updated user document
        );
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    catch (error) {
        console.error("Error updating password:", error);
        throw new Error("Error updating password");
    }
});
exports.updateUserPassword = updateUserPassword;
const getService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const serviceData = yield serviceModel_1.Service.findById(id).populate("category");
        return serviceData;
    }
    catch (error) {
        console.error("Error fetching service data from db", error);
        throw new Error("Error fetching service data from db");
    }
});
exports.getService = getService;
const getPaginatedServices = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch services without population
        const services = yield serviceModel_1.Service.find({ isAvailable: true })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()
            .exec();
        const totalServices = yield serviceModel_1.Service.countDocuments();
        const totalPages = Math.ceil(totalServices / limit);
        // For each service, fetch category name and id using category ID
        const servicesWithCategoryDetails = yield Promise.all(services.map((service) => __awaiter(void 0, void 0, void 0, function* () {
            const category = yield categoryModel_1.Category.findById(service.category, "_id name")
                .lean()
                .exec(); // Fetch both ID and name
            return Object.assign(Object.assign({}, service), { _id: service._id.toString(), category: category
                    ? {
                        _id: category._id.toString(), // Convert category _id to string
                        name: category.name,
                    }
                    : { _id: "Unknown", name: "Unknown" } });
        })));
        return {
            services: servicesWithCategoryDetails,
            totalPages,
            currentPage: page,
        };
    }
    catch (error) {
        console.error("Error fetching paginated services:", error);
        throw new Error("Error fetching paginated services");
    }
});
exports.getPaginatedServices = getPaginatedServices;
const addToCartInDb = (userId, serviceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const serviceObjectId = new mongoose_1.default.Types.ObjectId(serviceId);
        let cart = yield cartModel_1.default.findOne({ userId });
        if (cart) {
            const serviceExists = cart.services.find((service) => service.serviceId.equals(serviceObjectId) // Use equals method for ObjectId comparison
            );
            if (serviceExists) {
                return { success: false, message: "Service already in the cart" };
            }
            else {
                cart.services.push({ serviceId: serviceObjectId });
            }
        }
        else {
            cart = new cartModel_1.default({
                userId,
                services: [{ serviceId: serviceObjectId }],
            });
        }
        yield cart.save();
        return { success: true, message: "Service added to cart" };
    }
    catch (error) {
        console.error("Error adding service to cart:", error);
        return { success: false, message: "Failed to add service to cart", error };
    }
});
exports.addToCartInDb = addToCartInDb;
const userCartInDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = id;
    // Fetch cart data and populate both serviceId and personIds
    const cartData = yield cartModel_2.default.findOne({ userId })
        .populate("services.serviceId") // Populate service details
        .populate("services.personIds"); // Populate user/patient details for personIds
    if (!cartData) {
        console.error("Cart not found");
        throw new Error("Cart not found");
    }
    return cartData;
});
exports.userCartInDb = userCartInDb;
const userUpdatedCartInDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = id;
    // Fetch cart data and populate both serviceId and personIds
    const cartData = yield cartModel_2.default.findOne({ userId })
        .populate("services.serviceId")
        .populate("services.personIds")
        .exec();
    if (!cartData) {
        console.error("Cart not found");
        throw new Error("Cart not found");
    }
    // Collect all patient data
    let patientData = [];
    // Use for...of loop to handle async/await properly
    for (const service of cartData.services) {
        const patientIds = (_a = service.personIds) === null || _a === void 0 ? void 0 : _a.filter((person) => person.model === "Patient").map((person) => person._id.toString()); // Map to get the _id
        // Fetch patient data based on the IDs
        if (patientIds && patientIds.length > 0) {
            const patients = yield patientModel_1.default.find({ _id: { $in: patientIds } })
                .select("name age contactNumber relationToUser") // Select necessary fields
                .exec();
            // Merge fetched patient data into the patientData array
            patientData = [...patientData, ...patients];
        }
    }
    return {
        cart: cartData,
        patients: patientData,
    };
});
exports.userUpdatedCartInDb = userUpdatedCartInDb;
const removeServiceFromCartinDb = (userId, serviceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedCart = yield cartModel_2.default.findOneAndUpdate({ userId: userId }, // Find cart by userId
        { $pull: { services: { serviceId: serviceId } } }, // Remove the service from services array
        { new: true } // Return the updated cart after removal
        ).populate("services.serviceId"); // Populate service details (optional)
        if (!updatedCart) {
            console.error("cart not found");
            throw new Error("cart not found");
        }
    }
    catch (error) {
        console.error("Error removing cart item:", error);
    }
});
exports.removeServiceFromCartinDb = removeServiceFromCartinDb;
// export const bookAppointment = async (
//   userId: string,
//   services: { _id: string }[],
//   appointmentDate: Date,
//   totalAmount: number,
//   status: string,
//   sessionId: string,
//   appointmentTimeSlot: string
// ) => {
//   try {
//     console.log(
//       userId,
//       services,
//       appointmentDate,
//       totalAmount,
//       status,
//       sessionId,
//       appointmentTimeSlot
//     );
//     const serviceIds = services.map(
//       (service) => new mongoose.Types.ObjectId(service._id)
//     );
//     const newBooking = new BookingModel({
//       user_id: new mongoose.Types.ObjectId(userId),
//       service_id: serviceIds,
//       booking_date: new Date(appointmentDate),
//       booking_time_slot: appointmentTimeSlot,
//       total_amount: totalAmount,
//       status,
//       stripe_session_id: sessionId,
//     });
//     // Save the booking to the database
//     const booked = await newBooking.save();
//     console.log("Booking saved successfully:", booked);
//     return booked;
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error("Error saving booking:", error.message);
//       throw new Error("Failed to book appointment");
//     } else {
//       console.error("Unexpected error:", error);
//       throw new Error("An unexpected error occurred");
//     }
//   }
// };
const editUserInDb = (id, fieldToChange) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const editedUser = yield userModel_1.Users.findByIdAndUpdate(id, { $set: fieldToChange }, { new: true });
        return editedUser;
    }
    catch (error) {
        console.error("Error updating user in the database:", error);
        throw new Error("Error updating user in the database");
    }
});
exports.editUserInDb = editUserInDb;
const addPatientInDb = (patientData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPatient = new patientModel_1.default(Object.assign(Object.assign({}, patientData), { userId }));
        const addedPatient = yield newPatient.save();
        return addedPatient;
    }
    catch (error) {
        console.error("Error saving patient to database:", error);
        throw new Error("Error saving patient to database");
    }
});
exports.addPatientInDb = addPatientInDb;
const getFamilyDataInDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const familyData = yield patientModel_1.default.find({ userId: id });
        return familyData;
    }
    catch (error) {
        console.error("Error fetching patient from database:", error);
        throw new Error("Error fetching patient from database");
    }
});
exports.getFamilyDataInDb = getFamilyDataInDb;
const saveBooking = (_a) => __awaiter(void 0, [_a], void 0, function* ({ stripe_session_id, paymentIntentId, user_id, booking_date, services, total_amount, booking_time_slot, }) {
    try {
        const newBooking = new bookingModel_1.default({
            stripe_session_id,
            paymentIntentId,
            user_id: new mongoose_1.default.Types.ObjectId(user_id),
            booking_date,
            services,
            total_amount,
            status: "confirmed",
            booking_time_slot,
        });
        // Save the booking to the database
        const savedBooking = yield newBooking.save();
        return savedBooking;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error saving booking: ${error.message}`);
        }
        throw error;
    }
});
exports.saveBooking = saveBooking;
const BookingListInDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find all bookings for the given user ID and populate relevant fields
        const bookings = yield bookingModel_1.default.find({ user_id: id })
            .populate("user_id") // Populate user details
            .populate("services.service_id") // Populate service details
            .populate("services.persons") // Populate patient details
            .sort({ createdAt: -1 });
        return bookings;
    }
    catch (error) {
        console.error("Error fetching bookings from DB:", error);
        throw error;
    }
});
exports.BookingListInDb = BookingListInDb;
const findBookingById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Step 1: Find booking and apply lean() to avoid Mongoose document structure
        const booking = yield bookingModel_1.default.findById(id)
            .populate("user_id", "name email") // Populate user details
            .populate("services.service_id", "name price") // Populate service details
            .lean();
        if (!booking)
            throw new Error("Booking not found");
        // Step 2: Collect person IDs from each service
        const personIds = booking.services.flatMap((service) => service.persons);
        // Step 3: Populate persons with User and Patient models separately
        const [users, patients] = yield Promise.all([
            userModel_1.Users.find({ _id: { $in: personIds } }, "name age gender").lean(),
            patientModel_1.default.find({ _id: { $in: personIds } }, "name relationToUser age gender").lean(),
        ]);
        // Step 4: Map the user and patient data by their IDs
        const userMap = new Map(users.map((user) => [user._id.toString(), Object.assign(Object.assign({}, user), { relationToUser: "Self" })]));
        const patientMap = new Map(patients.map((patient) => [patient._id.toString(), patient]));
        // Step 5: Replace ObjectIds in `persons` with populated data
        booking.services.forEach((service) => {
            service.persons = service.persons.map((personId) => {
                const idStr = personId.toString();
                return userMap.get(idStr) || patientMap.get(idStr) || { _id: personId, name: "Unknown" };
            });
        });
        return booking;
    }
    catch (error) {
        console.error("Error in findBookingById:", error);
        throw new Error("Error fetching booking from DB");
    }
});
exports.findBookingById = findBookingById;
const clearCartInDb = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the cart by userId and remove all services (clear the cart)
        yield cartModel_2.default.updateOne({ userId: userId }, // Find the cart by the user ID
        { $set: { services: [] } } // Set the services array to an empty array (clearing the cart)
        );
    }
    catch (error) {
        console.error("Error clearing cart:", error);
        throw new Error("Error clearing the cart");
    }
});
exports.clearCartInDb = clearCartInDb;
const cancelBookingInDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cancelledBooking = yield bookingModel_1.default.findByIdAndUpdate(id, { status: "cancelled" }, { new: true });
        return cancelledBooking;
    }
    catch (error) {
        console.error("Error cancelling booking:", error);
        throw new Error("Failed to cancel booking");
    }
});
exports.cancelBookingInDb = cancelBookingInDb;
const getCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryList = yield categoryModel_1.Category.find();
        return categoryList;
    }
    catch (error) {
        console.error("Error fetching categories from database:", error);
        throw error; // Re-throw to be handled by calling functions
    }
});
exports.getCategories = getCategories;
const reportListInDb = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Convert bookingId to ObjectId if it's a valid string
        if (!mongoose_1.default.Types.ObjectId.isValid(bookingId)) {
            throw new Error("Invalid booking ID format");
        }
        const objectId = new mongoose_1.default.Types.ObjectId(bookingId);
        // Query reports for specific bookingId and published status
        const reports = yield reportModel_1.default.find({
            bookingId: objectId,
            published: true,
        });
        if (reports.length === 0) {
            console.log(`No reports found for booking ID ${bookingId} with published status.`);
        }
        else {
            console.log("Reports fetched:", reports);
        }
        return reports;
    }
    catch (error) {
        console.error("Error fetching reports from database:", error);
        throw new Error("Failed to retrieve reports");
    }
});
exports.reportListInDb = reportListInDb;
