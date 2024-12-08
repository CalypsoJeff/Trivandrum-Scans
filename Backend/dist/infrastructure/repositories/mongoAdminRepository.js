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
exports.successMessagetoUser = exports.publishReportInDb = exports.updateReportInDb = exports.getReportsFromDb = exports.saveReport = exports.getCompletedBookings = exports.updateServiceBookinginDb = exports.bookingDetailsInDb = exports.getBookingsFromDb = exports.toggleServiceByID = exports.getAllServicesWithCategoryDetails = exports.updateService = exports.saveService = exports.categoryCount = exports.departmentCount = exports.userCount = exports.deleteCategoryFromDB = exports.updateCategoryInDB = exports.addCategoryToDB = exports.updateUserStatus = exports.getPaginatedCategories = exports.deleteDepartment = exports.updateDepartment = exports.getAllDepartments = exports.getPaginatedUsers = exports.getAllUsers = exports.findAdmin = void 0;
const adminModel_1 = require("../database/dbModel/adminModel");
const bookingModel_1 = __importDefault(require("../database/dbModel/bookingModel"));
const categoryModel_1 = require("../database/dbModel/categoryModel");
const departmentModel_1 = require("../database/dbModel/departmentModel");
const serviceModel_1 = require("../database/dbModel/serviceModel");
const userModel_1 = require("../database/dbModel/userModel");
const patientModel_1 = __importDefault(require("../database/dbModel/patientModel"));
const reportModel_1 = __importDefault(require("../database/dbModel/reportModel"));
const emailUtils_1 = require("../../utils/emailUtils");
const messageModel_1 = __importDefault(require("../database/dbModel/messageModel"));
// import mongoose from "mongoose";
// Find Admin by Email
const findAdmin = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield adminModel_1.Admin.findOne({ email });
});
exports.findAdmin = findAdmin;
// Get All Users
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield userModel_1.Users.find();
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unknown error occurred while fetching all users.");
    }
});
exports.getAllUsers = getAllUsers;
// Get Paginated Users with proper typing
const getPaginatedUsers = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.Users.find()
            .skip((page - 1) * limit)
            .limit(limit);
        const totalUsers = yield userModel_1.Users.countDocuments();
        const totalPages = Math.ceil(totalUsers / limit);
        return {
            users,
            totalPages,
        };
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unknown error occurred while fetching paginated users.");
    }
});
exports.getPaginatedUsers = getPaginatedUsers;
const getAllDepartments = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield departmentModel_1.Department.find();
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unknown error occurred while fetching all departments.");
    }
});
exports.getAllDepartments = getAllDepartments;
const updateDepartment = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate that the ID is provided
        if (!id) {
            throw new Error("Department ID is required");
        }
        // Find the department by ID and update it with the provided data (name, description)
        const updatedDepartment = yield departmentModel_1.Department.findByIdAndUpdate(id, Object.assign({}, updatedData), // The new data (name and description)
        { new: true, runValidators: true } // Return the updated document and validate input
        );
        // Return the updated department or null if not found
        return updatedDepartment;
    }
    catch (error) {
        console.error("Error updating department:", error);
        throw new Error("Could not update department");
    }
});
exports.updateDepartment = updateDepartment;
const deleteDepartment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!id) {
            throw new Error("Department ID is required");
        }
        // Delete the department by ID and return the deleted department data
        const deletedDepartment = yield departmentModel_1.Department.findByIdAndDelete(id);
        return deletedDepartment; // Returns null if the department is not found
    }
    catch (error) {
        console.error("Error deleting department:", error);
        throw new Error("Could not delete department");
    }
});
exports.deleteDepartment = deleteDepartment;
const getPaginatedCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield categoryModel_1.Category.find()
            .populate("department")
            .lean()
            .exec();
        // Map over categories to explicitly cast _id to string
        const mappedCategories = categories.map((category) => (Object.assign(Object.assign({}, category), { _id: category._id.toString() })));
        return {
            categories: mappedCategories,
        };
    }
    catch (error) {
        console.error("Error fetching paginated categories:", error);
        throw new Error("Error fetching paginated categories");
    }
});
exports.getPaginatedCategories = getPaginatedCategories;
// Update User Status (Block/Unblock)
const updateUserStatus = (userId, isBlocked) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield userModel_1.Users.findByIdAndUpdate(userId, { is_blocked: isBlocked }, { new: true });
        return updatedUser;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        else {
            throw new Error("An unknown error occurred while updating user status.");
        }
    }
});
exports.updateUserStatus = updateUserStatus;
// Database Interaction Layer for Adding a New Category
const addCategoryToDB = (categoryData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create a new Category instance
        const newCategory = new categoryModel_1.Category({
            name: categoryData.name,
            department: categoryData.department,
        });
        // Save the new category to the database
        const savedCategory = yield newCategory.save();
        const populatedCategory = yield categoryModel_1.Category.findById(savedCategory._id).populate("department");
        if (!populatedCategory) {
            throw new Error("Failed to populate the newly created category.");
        }
        // Return the saved category as an object
        return populatedCategory.toObject();
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        else {
            throw new Error("An unknown error occurred while adding a new category.");
        }
    }
});
exports.addCategoryToDB = addCategoryToDB;
// Update Category
const updateCategoryInDB = (categoryId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedCategory = yield categoryModel_1.Category.findByIdAndUpdate(categoryId, {
            name: updateData.name,
            department: updateData.department,
        }, { new: true }).populate("department");
        return updatedCategory ? updatedCategory.toObject() : null; // Explicitly cast the result to ICategory
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        else {
            throw new Error("An unknown error occurred while updating the category.");
        }
    }
});
exports.updateCategoryInDB = updateCategoryInDB;
// Delete Category
const deleteCategoryFromDB = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield categoryModel_1.Category.findByIdAndDelete(categoryId);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        else {
            throw new Error("An unknown error occurred while deleting the category.");
        }
    }
});
exports.deleteCategoryFromDB = deleteCategoryFromDB;
const userCount = () => __awaiter(void 0, void 0, void 0, function* () {
    const userCount = yield userModel_1.Users.countDocuments();
    return userCount;
});
exports.userCount = userCount;
const departmentCount = () => __awaiter(void 0, void 0, void 0, function* () {
    const departmentCount = yield departmentModel_1.Department.countDocuments();
    return departmentCount;
});
exports.departmentCount = departmentCount;
const categoryCount = () => __awaiter(void 0, void 0, void 0, function* () {
    const categoryCounts = yield categoryModel_1.Category.countDocuments();
    return categoryCounts;
});
exports.categoryCount = categoryCount;
const saveService = (completeServiceData) => __awaiter(void 0, void 0, void 0, function* () {
    const service = new serviceModel_1.Service(completeServiceData);
    return yield service.save();
});
exports.saveService = saveService;
const updateService = (id, completeServiceData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the service by its ID
        const existingService = yield serviceModel_1.Service.findById(id);
        if (!existingService) {
            throw new Error("Service not found");
        }
        // Update the service fields
        Object.assign(existingService, completeServiceData);
        // Save the updated service
        const updatedService = yield existingService.save();
        return updatedService;
    }
    catch (error) {
        console.error("Error updating service:", error);
        throw new Error("Failed to update service");
    }
});
exports.updateService = updateService;
const getAllServicesWithCategoryDetails = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all services
        const services = yield serviceModel_1.Service.find().lean();
        // Fetch category details for each service
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
        };
    }
    catch (error) {
        console.error("Error fetching all services:", error);
        throw new Error("Error fetching all services");
    }
});
exports.getAllServicesWithCategoryDetails = getAllServicesWithCategoryDetails;
const toggleServiceByID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = yield serviceModel_1.Service.findById(id);
        if (!service) {
            throw new Error("Service not found");
        }
        // Toggle the availability status
        service.isAvailable = !service.isAvailable;
        return yield service.save();
    }
    catch (error) {
        console.error("Error toggling services:", error);
        throw new Error("Error toggling services");
    }
});
exports.toggleServiceByID = toggleServiceByID;
const getBookingsFromDb = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10) {
    try {
        const skip = (page - 1) * limit;
        const bookings = yield bookingModel_1.default.find()
            .populate("user_id")
            .populate("services.service_id")
            .sort({ booking_date: -1 }) // Sort by booking_date in descending order
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
exports.getBookingsFromDb = getBookingsFromDb;
const bookingDetailsInDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the booking without populating `persons`
        const booking = yield bookingModel_1.default.findById(id)
            .populate("user_id") // Populating user details
            .populate("services.service_id") // Populating service details
            .lean(); // Convert to plain JS object
        if (!booking)
            throw new Error("Booking not found");
        // Collect person IDs from each service
        const personIds = booking.services.flatMap((service) => service.persons);
        // Fetch both users and patients by IDs
        const [users, patients] = yield Promise.all([
            userModel_1.Users.find({ _id: { $in: personIds } }, "name age gender contactNumber").lean(),
            patientModel_1.default.find({ _id: { $in: personIds } }, "name relationToUser age gender contactNumber").lean(),
        ]);
        // Map users and patients by their IDs
        const userMap = new Map(users.map((user) => [user._id.toString(), Object.assign(Object.assign({}, user), { relationToUser: "Self" })]));
        const patientMap = new Map(patients.map((patient) => [patient._id.toString(), patient]));
        // Replace ObjectIds in `persons` with populated data
        booking.services.forEach((service) => {
            service.persons = service.persons.map((personId) => {
                const idStr = personId.toString();
                // Return populated User or Patient, or fallback with basic details
                return (userMap.get(idStr) ||
                    patientMap.get(idStr) || {
                    _id: personId,
                    name: "Unknown",
                    relationToUser: "N/A",
                });
            });
        });
        return booking;
    }
    catch (error) {
        console.error("Error fetching booking from DB:", error);
        throw new Error("Error fetching booking from DB");
    }
});
exports.bookingDetailsInDb = bookingDetailsInDb;
const updateServiceBookinginDb = (bookingId, serviceId, completed) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedBooking = yield bookingModel_1.default.findOneAndUpdate({ _id: bookingId, "services.service_id": serviceId }, // Match booking and service
        { $set: { "services.$.completed": completed } }, // Use positional operator to set completion
        { new: true } // Return updated document
        );
        return updatedBooking;
    }
    catch (error) {
        console.error("Database error updating service completion status:", error);
        throw new Error("Database error updating service completion status");
    }
});
exports.updateServiceBookinginDb = updateServiceBookinginDb;
const getCompletedBookings = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookings = yield bookingModel_1.default.find({
            // Find bookings where every service has `completed: true`
            services: { $all: [{ $elemMatch: { completed: true } }] }
        })
            .populate('user_id')
            .populate('services.service_id')
            .populate('services.persons');
        console.log(bookings, "Filtered bookings with all services completed");
        return bookings;
    }
    catch (error) {
        console.error("Error fetching completed bookings:", error);
        throw error; // Propagate error for handling
    }
});
exports.getCompletedBookings = getCompletedBookings;
const saveReport = (reportData) => __awaiter(void 0, void 0, void 0, function* () {
    const report = new reportModel_1.default(reportData);
    return yield report.save();
});
exports.saveReport = saveReport;
const getReportsFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch reports and populate booking and user data
        const reportList = yield reportModel_1.default
            .find()
            .populate("bookingId", "user_id booking_date")
            .populate({
            path: "bookingId",
            populate: { path: "user_id", select: "name" },
        }).sort({ uploadedAt: -1 });
        return reportList;
    }
    catch (error) {
        console.error("Error fetching reports from database:", error);
        throw error;
    }
});
exports.getReportsFromDb = getReportsFromDb;
const updateReportInDb = (reportId, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield reportModel_1.default.findByIdAndUpdate(reportId, updatedData, { new: true });
});
exports.updateReportInDb = updateReportInDb;
// export const publishReportInDb = async (reportId:string) => {
//   return await reportModel.findByIdAndUpdate(
//     reportId,
//     { published: true },
//     { new: true } 
//   );
// };
// Function to publish report in the database and send an email notification
const publishReportInDb = (reportId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const updatedReport = yield reportModel_1.default.findByIdAndUpdate(reportId, { published: true }, { new: true }).populate({
            path: "bookingId",
            populate: { path: "user_id", select: "email name" },
        });
        if (!updatedReport) {
            throw new Error("Report not found");
        }
        const booking = updatedReport.bookingId;
        if (!booking || !("user_id" in booking)) {
            throw new Error("Booking data not populated correctly.");
        }
        const user = booking.user_id;
        if (!user.email || !user.name) {
            throw new Error("User data is not populated correctly.");
        }
        // Retrieve the first PDF URL from the reports array
        const reportFile = (_a = updatedReport.reports) === null || _a === void 0 ? void 0 : _a[0]; // You could also select a specific report if needed
        if (!reportFile || !reportFile.url) {
            throw new Error("No report file URL found in the reports array.");
        }
        const downloadLink = reportFile.url;
        // Send email with the actual S3 download link
        yield (0, emailUtils_1.sendReportPublishedEmail)(user.email, reportId, user.name, downloadLink);
        console.log("Report published and email with download link sent to user.");
        return updatedReport;
    }
    catch (error) {
        console.error("Failed to publish report and send email:", error);
        throw error;
    }
});
exports.publishReportInDb = publishReportInDb;
const successMessagetoUser = (chatId, content) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(chatId, content, 'yesssssssss');
    return yield messageModel_1.default.create({
        chat: chatId,
        sender: '66ee588d1e1448fbea1f40bb',
        senderModel: "Admin",
        content,
        createdAt: new Date(),
    });
});
exports.successMessagetoUser = successMessagetoUser;
