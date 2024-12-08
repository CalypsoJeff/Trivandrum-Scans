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
const adminInteractor_1 = __importDefault(require("../../domain/useCases/auth/adminInteractor"));
const mongoAdminRepository_1 = require("../../infrastructure/repositories/mongoAdminRepository");
const chatModel_1 = __importDefault(require("../../infrastructure/database/dbModel/chatModel"));
const messageModel_1 = __importDefault(require("../../infrastructure/database/dbModel/messageModel"));
exports.default = {
    adminLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: "Admin Credentials missing" });
            }
            const Credentials = { email, password };
            const response = yield adminInteractor_1.default.loginAdmin(Credentials);
            res.status(200).json({ message: "Login Successful", response });
        }
        catch (error) {
            console.error("Error during admin login:", error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }),
    getUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { page = 1, limit = 10 } = req.query;
            const users = yield adminInteractor_1.default.getUsers(Number(page), Number(limit));
            res.status(200).json(users);
        }
        catch (error) {
            console.error("Error fetching users:", error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }),
    getCategories: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const categories = yield adminInteractor_1.default.getCategories();
            res.status(200).json(categories);
        }
        catch (error) {
            console.error("Error fetching categories:", error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }),
    blockUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            const { is_blocked } = req.body;
            const updatedUser = yield adminInteractor_1.default.updatedUserStatus(userId, is_blocked);
            res.status(200).json(updatedUser);
        }
        catch (error) {
            // Use `unknown` type for error handling
            if (error instanceof Error) {
                console.error(error.message); // Safely access `message` only if it's an instance of `Error`
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }),
    addDepartment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, description } = req.body;
            if (!name) {
                return res.status(400).json({ error: "Department name is required" });
            }
            const departmentData = {
                departmentName: name,
                departmentDescription: description,
            };
            yield adminInteractor_1.default.addDepartment(departmentData);
            res.status(200).json({ message: "Department Added Successfully" });
        }
        catch (error) {
            console.error("Error adding department:", error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }),
    departmentList: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const departments = yield adminInteractor_1.default.getDepartments();
            res.status(200).json(departments);
        }
        catch (error) {
            console.error("Error fetching department:", error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }),
    editDepartment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            if (!id) {
                return res.status(400).json({ error: "Department ID is required" });
            }
            if (!name) {
                return res.status(400).json({ error: "Department name is required" });
            }
            const departmentData = { name, description };
            const updatedDepartment = yield adminInteractor_1.default.editDepartment(id, departmentData);
            return res.status(200).json({
                message: "Department updated successfully",
                department: updatedDepartment,
            });
        }
        catch (error) {
            console.error("Error editing department:", error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }),
    deleteDepartment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: "Department ID is required" });
            }
            // Call the interactor to handle the business logic and perform the delete
            const deletedDepartment = yield adminInteractor_1.default.deleteDepartment(id);
            if (!deletedDepartment) {
                return res.status(404).json({ error: "Department not found" });
            }
            return res
                .status(200)
                .json({ message: "Department deleted successfully", id });
        }
        catch (error) {
            console.error("Error deleting department:", error);
            // Handle error and send appropriate response
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }),
    addCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, department } = req.body;
            // Validate the input data
            if (!name || !department) {
                return res
                    .status(400)
                    .json({ error: "Category name and department are required" });
            }
            // Prepare the category data object
            const newCategoryData = { name, department };
            // Call the interactor layer to handle business logic
            const category = yield adminInteractor_1.default.addCategory(newCategoryData);
            console.log(category, 'aaaaaaaaa');
            // Send success response
            return res
                .status(201)
                .json({ message: "Category added successfully", category });
        }
        catch (error) {
            console.error("Error adding category:", error);
            // Error handling
            if (error instanceof Error) {
                return res.status(500).json({ error: error.message });
            }
            else {
                return res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }),
    // Update Category
    editCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, department } = req.body;
            if (!id) {
                return res.status(400).json({ error: "Category ID is required" });
            }
            if (!name || !department) {
                return res
                    .status(400)
                    .json({ error: "Category name and department are required" });
            }
            const updatedCategory = yield adminInteractor_1.default.updateCategory(id, {
                name,
                department,
            });
            console.log(updatedCategory, 'ddddddddddddddddddd');
            res
                .status(200)
                .json({ message: "Category updated successfully", updatedCategory });
        }
        catch (error) {
            console.error("Error updating category:", error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }),
    // Delete Category
    deleteCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: "Category ID is required" });
            }
            yield adminInteractor_1.default.deleteCategory(id);
            res.status(200).json({ message: "Category deleted successfully" });
        }
        catch (error) {
            console.error("Error deleting category:", error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }),
    getUserCount: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userCounts = yield (0, mongoAdminRepository_1.userCount)();
            res.json(userCounts);
        }
        catch (error) {
            console.error("Failed to fetch bookings", error);
            res.status(500).json({ message: "Failed to fetch bookings" });
        }
    }),
    getDepartmentCount: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const departmentCounts = yield (0, mongoAdminRepository_1.departmentCount)();
            res.json(departmentCounts);
        }
        catch (error) {
            console.error("Failed to fetch department Count", error);
            res.status(500).json({ message: "Failed to fetch department Count" });
        }
    }),
    getCategoryCount: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const categoryCounts = yield (0, mongoAdminRepository_1.categoryCount)();
            res.json(categoryCounts);
        }
        catch (error) {
            console.error("Failed to fetch department Count", error);
            res.status(500).json({ message: "Failed to fetch department Count" });
        }
    }),
    addService: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { name, price, category, preTestPreparations, expectedResultDuration, description, } = req.body;
            const files = req.files;
            const serviceImage = (_a = files === null || files === void 0 ? void 0 : files.serviceImage) === null || _a === void 0 ? void 0 : _a[0];
            if (!serviceImage) {
                console.error("Service Image is missing.");
                return res
                    .status(400)
                    .json({ message: "License document is required" });
            }
            const serviceData = {
                name,
                price,
                category,
                preTestPreparations,
                expectedResultDuration,
                description,
                serviceImage,
            };
            const result = yield adminInteractor_1.default.addServiceData(serviceData);
            res.status(200).json({ message: "Service added successfully", result });
        }
        catch (error) {
            console.error("Failed to add service", error);
            res.status(500).json({ message: "Failed to add service" });
        }
    }),
    editService: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { id } = req.params; // Get the service ID from the URL parameters
            const { name, price, category, preTestPreparations, expectedResultDuration, description, } = req.body;
            const files = req.files;
            const serviceImage = (_a = files === null || files === void 0 ? void 0 : files.serviceImage) === null || _a === void 0 ? void 0 : _a[0];
            // Prepare service data, omit serviceImage if not provided
            const serviceData = Object.assign({ name,
                price,
                category,
                preTestPreparations,
                expectedResultDuration,
                description }, (serviceImage && { serviceImage }));
            const result = yield adminInteractor_1.default.editServiceData(id, serviceData);
            res.status(200).json({ message: "Service edited successfully", result });
        }
        catch (error) {
            console.error("Failed to edit service", error);
            res.status(500).json({ message: "Failed to edit service" });
        }
    }),
    getServices: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const serviceList = yield adminInteractor_1.default.getServiceList();
            res.status(200).json(serviceList);
        }
        catch (error) {
            console.error("Failed to retrieve services", error);
            res.status(500).json({ message: "Failed to retrieve services" });
        }
    }),
    toggleService: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const toggled = adminInteractor_1.default.toggleService(id);
            res.status(200).json(toggled);
        }
        catch (error) {
            console.error("Failed to toggle services", error);
            res.status(500).json({ message: "Failed to toggle services" });
        }
    }),
    bookingList: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Parse query params for page and limit
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const { bookings, totalBookings } = yield adminInteractor_1.default.getBookingList(page, limit);
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
            const bookingDetails = yield adminInteractor_1.default.fetchBookingDetails(id);
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
    // Fetch active chats for an admin
    getActiveChats: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { adminId } = req.params;
            console.log(adminId, 'adminId for active chats');
            const activeChats = yield chatModel_1.default.find({
                users: adminId,
            })
                .populate('users', 'name') // Populate to get names of users in the chat
                .populate('latestMessage'); // Populate latest message details
            console.log(activeChats, 'activeChats for admin');
            res.status(200).json(activeChats);
        }
        catch (error) {
            console.error('Error fetching active chats for admin:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }),
    // Fetch messages in a specific chat for an admin
    getMessages: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { chatId } = req.params;
        try {
            const messages = yield messageModel_1.default.find({ chat: chatId })
                .populate('sender', 'name')
                .sort({ createdAt: 1 }); // Sort messages by creation time
            res.json(messages);
        }
        catch (error) {
            console.error('Error fetching messages for chat:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }),
    getChats: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const chats = yield chatModel_1.default.find({})
                .populate({ path: "users", select: "name" })
                .populate({
                path: "latestMessage",
                select: "content createdAt",
            })
                .sort({ "latestMessage.createdAt": -1 })
                .exec();
            res.status(200).json({ chats });
        }
        catch (error) {
            console.error("Error fetching chats:", error);
            res.status(500).json({ message: "Server error during chat retrieval" });
        }
    }),
    getChatLists: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const chats = yield chatModel_1.default.find()
                .populate('users', 'name')
                .populate('latestMessage', 'content createdAt')
                .sort({ 'latestMessage.createdAt': -1 });
            res.status(200).json(chats);
        }
        catch (error) {
            console.error("Error fetching chat list:", error);
            res.status(500).json({ message: "Server error fetching chat list" });
        }
    }),
    updateBooking: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { bookingId, serviceId } = req.params;
            const { completed } = req.body;
            const updatedBooking = yield adminInteractor_1.default.updateServiceBooking(bookingId, serviceId, completed);
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
            const bookings = yield adminInteractor_1.default.CompletedBooking();
            res.status(200).json({ bookings });
        }
        catch (error) {
            console.error("Error in serviceCompleted:", error);
            res.status(500).json({ message: "Failed to fetch completed bookings." });
        }
    }),
    uploadReport: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const files = req.files;
            const { bookingId } = req.body;
            // Validate booking ID
            if (!bookingId) {
                return res.status(400).json({ message: "Booking ID is required" });
            }
            // Validate files
            if (!files || !files.report || files.report.length === 0) {
                return res.status(400).json({ message: "No report files uploaded" });
            }
            // Pass all files to the interactor
            const result = yield adminInteractor_1.default.addReportData({ bookingId, reportFiles: files.report });
            res.status(200).json({ message: "Report uploaded successfully", result });
        }
        catch (error) {
            console.error("Error uploading report:", error);
            res.status(500).json({ message: "Failed to upload report" });
        }
    }),
    reportList: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const reports = yield adminInteractor_1.default.reportList();
            res.status(200).json({ reports });
        }
        catch (error) {
            console.error("Error fetching report list:", error);
            res.status(500).json({ message: "Failed to fetch report list" });
        }
    }),
    updateReport: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { editReportId } = req.params;
            const files = req.files;
            const { bookingId } = req.body;
            if (!bookingId) {
                return res.status(400).json({ message: "Booking ID is required" });
            }
            if (!files || !files.report || files.report.length === 0) {
                return res.status(400).json({ message: "No report file uploaded" });
            }
            // Send the array of files to the interactor for uploading and saving
            const result = yield adminInteractor_1.default.editReportData({ editReportId, bookingId, reportFiles: files.report });
            res.status(200).json({ message: "Report updated successfully", result });
        }
        catch (error) {
            console.error("Error updating report:", error);
            res.status(500).json({ message: "Failed to update report" });
        }
    }),
    publishReport: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { reportId } = req.params;
            const publishedReport = yield adminInteractor_1.default.publishReport(reportId);
            if (publishedReport) {
                res.status(200).json({ message: "Report published successfully", publishedReport });
            }
            else {
                res.status(404).json({ message: "Report not found" });
            }
        }
        catch (error) {
            console.error("Error publishing report:", error);
            res.status(500).json({ message: "Failed to publish report" });
        }
    }),
    successMessage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { chatId } = req.params;
        const { content } = req.body;
        try {
            // Call the interactor to send the success message
            const newMessage = yield adminInteractor_1.default.successMessage(chatId, content);
            res.status(200).json({ message: "Message sent successfully", newMessage });
        }
        catch (error) {
            console.error("Error sending success message:", error);
            res.status(500).json({ message: "Failed to send message" });
        }
    }),
};
