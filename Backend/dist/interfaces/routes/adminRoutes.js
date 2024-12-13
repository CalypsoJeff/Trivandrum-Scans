"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadReport = exports.upload = void 0;
const express_1 = require("express");
const adminAuthMiddleware_1 = require("../frameworks/webserver/middleware/adminAuthMiddleware");
const adminRouter = (0, express_1.Router)();
const multer_1 = __importDefault(require("multer"));
const authController_1 = __importDefault(require("../controllers/authController"));
const userController_1 = __importDefault(require("../controllers/userController"));
const serviceController_1 = __importDefault(require("../controllers/serviceController"));
const departmentController_1 = __importDefault(require("../controllers/departmentController"));
const categoryController_1 = __importDefault(require("../controllers/categoryController"));
const bookingController_1 = __importDefault(require("../controllers/bookingController"));
const reportController_1 = __importDefault(require("../controllers/reportController"));
const messageController_1 = __importDefault(require("../controllers/messageController"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 },
}).fields([{ name: "serviceImage", maxCount: 1 }]);
exports.upload = upload;
const uploadReport = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true); // Accept file
        }
        else {
            cb(new Error("Only PDF files are allowed"));
        }
    },
}).fields([{ name: "report", maxCount: 5 }]); // Adjust maxCount as needed
exports.uploadReport = uploadReport;
// Authentication routes
adminRouter.post("/login", authController_1.default.adminLogin);
// User routes
adminRouter.get("/userlist", adminAuthMiddleware_1.protectAdmin, userController_1.default.getUsers);
adminRouter.patch("/blockUser/:userId", adminAuthMiddleware_1.protectAdmin, userController_1.default.blockUser);
adminRouter.get("/count", userController_1.default.getUserCount);
// Department routes
adminRouter.post("/add-Department", adminAuthMiddleware_1.protectAdmin, departmentController_1.default.addDepartment);
adminRouter.get("/departmentlist", adminAuthMiddleware_1.protectAdmin, departmentController_1.default.departmentList);
adminRouter.put("/edit-department/:id", adminAuthMiddleware_1.protectAdmin, departmentController_1.default.editDepartment);
adminRouter.delete("/delete-department/:id", adminAuthMiddleware_1.protectAdmin, departmentController_1.default.deleteDepartment);
adminRouter.get("/count-departments", departmentController_1.default.getDepartmentCount);
// Category routes
adminRouter.post("/add-category", adminAuthMiddleware_1.protectAdmin, categoryController_1.default.addCategory);
adminRouter.put("/edit-category/:id", adminAuthMiddleware_1.protectAdmin, categoryController_1.default.editCategory);
adminRouter.delete("/delete-category/:id", adminAuthMiddleware_1.protectAdmin, categoryController_1.default.deleteCategory);
adminRouter.get("/count-categories", categoryController_1.default.getCategoryCount);
adminRouter.get("/categoryList", adminAuthMiddleware_1.protectAdmin, categoryController_1.default.getCategories);
// Service routes
adminRouter.post("/add-service", adminAuthMiddleware_1.protectAdmin, upload, serviceController_1.default.addService);
adminRouter.put("/update-service/:id", adminAuthMiddleware_1.protectAdmin, upload, serviceController_1.default.editService);
adminRouter.get("/serviceList", serviceController_1.default.getServicesAdmin);
adminRouter.patch("/service/:id/toggleListing", adminAuthMiddleware_1.protectAdmin, serviceController_1.default.toggleService);
// Booking routes
adminRouter.get('/bookings', adminAuthMiddleware_1.protectAdmin, bookingController_1.default.bookingList);
adminRouter.get('/bookings/:id', adminAuthMiddleware_1.protectAdmin, bookingController_1.default.getBookingDetails);
adminRouter.get(`/service-Completed`, adminAuthMiddleware_1.protectAdmin, bookingController_1.default.serviceCompleted);
adminRouter.patch(`/bookings/:bookingId/service/:serviceId`, bookingController_1.default.updateBooking);
// Report routes
adminRouter.post("/reports/upload", uploadReport, adminAuthMiddleware_1.protectAdmin, reportController_1.default.uploadReport);
adminRouter.get('/reports', adminAuthMiddleware_1.protectAdmin, reportController_1.default.reportListAdmin);
adminRouter.put(`/reports/:editReportId`, uploadReport, adminAuthMiddleware_1.protectAdmin, reportController_1.default.updateReport);
adminRouter.patch(`/reports/:reportId/publish`, adminAuthMiddleware_1.protectAdmin, reportController_1.default.publishReport);
// Message routes
adminRouter.post('/messages/chat/:chatId/send', adminAuthMiddleware_1.protectAdmin, messageController_1.default.successMessage);
adminRouter.get('/messages/chats', messageController_1.default.getChats);
adminRouter.get('/chatList', messageController_1.default.getChatLists);
exports.default = adminRouter;
