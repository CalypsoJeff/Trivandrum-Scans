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
Object.defineProperty(exports, "__esModule", { value: true });
const departmentModel_1 = require("../../../infrastructure/database/dbModel/departmentModel");
const mongoAdminRepository_1 = require("../../../infrastructure/repositories/mongoAdminRepository");
const s3Uploader_1 = require("../../../utils/s3Uploader");
const server_1 = require("../../../server");
require("../../entities/types/categoryType");
const hashPassword_1 = require("../../helper/hashPassword");
const jwtHelper_1 = require("../../helper/jwtHelper");
exports.default = {
    loginAdmin: (cred) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const admin = yield (0, mongoAdminRepository_1.findAdmin)(cred.email);
            if (!admin || !admin.password) {
                throw new Error("Admin not found or password is missing");
            }
            const isValid = yield hashPassword_1.Encrypt.comparePassword(cred.password, admin.password);
            if (!isValid) {
                throw new Error("Invalid password");
            }
            const role = "admin";
            const tokenData = yield (0, jwtHelper_1.generateToken)(admin.id, cred.email, role);
            return {
                admin,
                token: tokenData.token,
                refreshToken: tokenData.refreshToken,
            };
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                throw error;
            }
            else {
                console.error("An unknown error occurred");
                throw new Error("An unknown error occurred");
            }
        }
    }),
    userList: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield (0, mongoAdminRepository_1.getAllUsers)();
            return users;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                throw error;
            }
            throw new Error("An unknown error occurred while fetching user list");
        }
    }),
    getUsers: (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield (0, mongoAdminRepository_1.getPaginatedUsers)(page, limit);
            return users;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("An unknown error occurred while fetching paginated users");
        }
    }),
    getCategories: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Call the function to fetch paginated categories
            const categories = yield (0, mongoAdminRepository_1.getPaginatedCategories)();
            return categories;
        }
        catch (error) {
            if (error instanceof Error) {
                // Log and rethrow the error if known
                console.error(`Error: ${error.message}`);
                throw new Error(error.message);
            }
            // Handle unexpected errors
            throw new Error("An unknown error occurred while fetching paginated categories");
        }
    }),
    updatedUserStatus: (userId, is_blocked) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedUser = yield (0, mongoAdminRepository_1.updateUserStatus)(userId, is_blocked);
            return updatedUser;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("An unknown error occurred while updating user status in userInteractor.");
            }
        }
    }),
    addDepartment: (departmentData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newDepartment = new departmentModel_1.Department({
                name: departmentData.departmentName,
                description: departmentData.departmentDescription || "",
            });
            const savedDepartment = yield newDepartment.save();
            return savedDepartment;
        }
        catch (error) {
            console.error("Error adding department:", error);
            throw new Error("Could not add department");
        }
    }),
    getDepartments: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield (0, mongoAdminRepository_1.getAllDepartments)();
            return users;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("An unknown error occurred while fetching paginated users");
        }
    }),
    editDepartment: (id, departmentData) => __awaiter(void 0, void 0, void 0, function* () {
        // Call the repository to update the department
        const updatedDepartment = yield (0, mongoAdminRepository_1.updateDepartment)(id, departmentData);
        // Handle if the department is not found
        if (!updatedDepartment) {
            throw new Error("Department not found or could not be updated");
        }
        return updatedDepartment;
    }),
    deleteDepartment: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!id) {
                throw new Error("Department ID is required");
            }
            // Attempt to delete the department by ID
            const deletedDepartment = yield departmentModel_1.Department.findByIdAndDelete(id);
            if (!deletedDepartment) {
                throw new Error("Department not found or could not be deleted");
            }
            return deletedDepartment; // Return the deleted department object
        }
        catch (error) {
            console.error("Error deleting department:", error);
            throw new Error("Could not delete department");
        }
    }),
    // Interactor Layer for Adding a New Category
    addCategory: (categoryData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Validate category data
            if (!categoryData.name || !categoryData.department) {
                throw new Error("Category name and department are required");
            }
            // Call the function that interacts with the database
            const newCategory = yield (0, mongoAdminRepository_1.addCategoryToDB)(categoryData);
            return newCategory;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                throw new Error(error.message);
            }
            else {
                throw new Error("An unknown error occurred while adding the category.");
            }
        }
    }),
    // Update Category
    updateCategory: (categoryId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!updateData.name || !updateData.department) {
                throw new Error("Category name and department are required");
            }
            const updatedCategory = yield (0, mongoAdminRepository_1.updateCategoryInDB)(categoryId, updateData);
            return updatedCategory;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("An unknown error occurred while updating the category.");
            }
        }
    }),
    // Delete Category
    deleteCategory: (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, mongoAdminRepository_1.deleteCategoryFromDB)(categoryId);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("An unknown error occurred while deleting the category.");
            }
        }
    }),
    addServiceData: (serviceData) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, price, category, preTestPreparations, expectedResultDuration, description, serviceImage, } = serviceData;
        const serviceDataResult = yield (0, s3Uploader_1.uploadToS3)(serviceImage);
        const serviceImageUrl = serviceDataResult.Location;
        const completeServiceData = {
            name,
            price,
            category,
            preTestPreparations,
            expectedResultDuration,
            description,
            serviceImageUrl,
        };
        const savedService = yield (0, mongoAdminRepository_1.saveService)(completeServiceData);
        return savedService;
    }),
    // In the interactor
    editServiceData: (id, serviceData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let serviceImageUrl = null;
            // If a new service image was uploaded, upload it to S3
            if (serviceData.serviceImage) {
                const serviceDataResult = yield (0, s3Uploader_1.uploadToS3)(serviceData.serviceImage);
                serviceImageUrl = serviceDataResult.Location; // S3 image URL
            }
            // Build complete data to update, including new image URL if applicable
            const completeServiceData = Object.assign({ name: serviceData.name, price: serviceData.price, category: serviceData.category, preTestPreparations: serviceData.preTestPreparations, expectedResultDuration: serviceData.expectedResultDuration, description: serviceData.description }, (serviceImageUrl && { serviceImageUrl }));
            // Call repository to update service by ID
            const updatedService = yield (0, mongoAdminRepository_1.updateService)(id, completeServiceData);
            return updatedService;
        }
        catch (error) {
            console.error("Error in editing service:", error);
            throw new Error("Failed to edit service data");
        }
    }),
    getServiceList: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const services = yield (0, mongoAdminRepository_1.getAllServicesWithCategoryDetails)(); // Update to use the new function
            return services;
        }
        catch (error) {
            console.error("Error fetching service list:", error);
            throw new Error("Error fetching service list");
        }
    }),
    toggleService: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const toggleStatus = yield (0, mongoAdminRepository_1.toggleServiceByID)(id);
            return toggleStatus;
        }
        catch (error) {
            console.error("Error toggling service :", error);
            throw new Error("Error toggling service");
        }
    }),
    getBookingList: (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10) {
        // eslint-disable-next-line no-useless-catch
        try {
            return yield (0, mongoAdminRepository_1.getBookingsFromDb)(page, limit);
        }
        catch (error) {
            throw error;
        }
    }),
    fetchBookingDetails: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const bookingDetails = yield (0, mongoAdminRepository_1.bookingDetailsInDb)(id);
            return bookingDetails;
        }
        catch (error) {
            console.error("Error fetching booking details:", error);
            throw error;
        }
    }),
    updateServiceBooking: (bookingId, serviceId, completed) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedBooking = yield (0, mongoAdminRepository_1.updateServiceBookinginDb)(bookingId, serviceId, completed);
            return updatedBooking;
        }
        catch (error) {
            console.error("Error in service booking update:", error);
            throw new Error("Error in service booking update");
        }
    }),
    CompletedBooking: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const completedBookings = yield (0, mongoAdminRepository_1.getCompletedBookings)();
            return completedBookings;
        }
        catch (error) {
            console.error("Error in CompletedBooking:", error);
            throw error;
        }
    }),
    // addReportData: async ({ bookingId, reportFiles }: { bookingId: string; reportFiles: Express.Multer.File[] }) => {
    //   const reports = [];
    //   // Upload each file to S3 and collect its metadata
    //   for (const reportFile of reportFiles) {
    //     const reportData = await uploadToS3(reportFile);
    //     const reportUrl = reportData.Location;
    //     reports.push({
    //       filename: reportFile.originalname,
    //       mimetype: reportFile.mimetype,
    //       size: reportFile.size,
    //       url: reportUrl,
    //     });
    //   }
    //   // Prepare the complete report data for the database
    //   const completeReportData = {
    //     bookingId,
    //     reports,
    //   };
    //   // Save report data to the database
    //   const savedReport = await saveReport(completeReportData);
    //   return savedReport;
    // },
    addReportData: (_a) => __awaiter(void 0, [_a], void 0, function* ({ bookingId, reportFiles }) {
        const reports = [];
        // Upload each file to S3 and collect its metadata
        for (const reportFile of reportFiles) {
            const reportData = yield (0, s3Uploader_1.uploadToS3)(reportFile, true); // Generate Signed URL
            const reportUrl = reportData.Location;
            reports.push({
                filename: reportFile.originalname,
                mimetype: reportFile.mimetype,
                size: reportFile.size,
                url: reportUrl,
            });
        }
        // Prepare the complete report data for the database
        const completeReportData = {
            bookingId,
            reports,
        };
        // Save report data to the database
        const savedReport = yield (0, mongoAdminRepository_1.saveReport)(completeReportData);
        return savedReport;
    }),
    reportList: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, mongoAdminRepository_1.getReportsFromDb)();
    }),
    // editReportData: async ({ editReportId, bookingId, reportFiles }: { editReportId: string; bookingId: string; reportFiles: Express.Multer.File[] }) => {
    //   const reports = [];
    //   // Upload each file and store details in the reports array
    //   for (const reportFile of reportFiles) {
    //     const reportData = await uploadToS3(reportFile);
    //     const reportUrl = reportData.Location;
    //     reports.push({
    //       filename: reportFile.originalname,
    //       mimetype: reportFile.mimetype,
    //       size: reportFile.size,
    //       url: reportUrl,
    //     });
    //   }
    //   // Prepare the updated data object
    //   const updatedReportData = {
    //     bookingId,
    //     reports,
    //   };
    //   // Update the report in the database
    //   const updatedReport = await updateReportInDb(editReportId, updatedReportData);
    //   return updatedReport;
    // },
    editReportData: (_a) => __awaiter(void 0, [_a], void 0, function* ({ editReportId, bookingId, reportFiles }) {
        const reports = [];
        // Upload each file and store details in the reports array
        for (const reportFile of reportFiles) {
            const reportData = yield (0, s3Uploader_1.uploadToS3)(reportFile, true); // Generate Signed URL
            const reportUrl = reportData.Location;
            reports.push({
                filename: reportFile.originalname,
                mimetype: reportFile.mimetype,
                size: reportFile.size,
                url: reportUrl,
            });
        }
        // Prepare the updated data object
        const updatedReportData = {
            bookingId,
            reports,
        };
        // Update the report in the database
        const updatedReport = yield (0, mongoAdminRepository_1.updateReportInDb)(editReportId, updatedReportData);
        return updatedReport;
    }),
    publishReport: (reportId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, mongoAdminRepository_1.publishReportInDb)(reportId);
    }),
    successMessage: (chatId, content) => __awaiter(void 0, void 0, void 0, function* () {
        // Save the message in the database
        const newMessage = yield (0, mongoAdminRepository_1.successMessagetoUser)(chatId, content);
        // Emit the message to the specified chat room via Socket.IO
        server_1.io.to(chatId).emit("receiveMessage", newMessage);
        return newMessage;
    })
};
