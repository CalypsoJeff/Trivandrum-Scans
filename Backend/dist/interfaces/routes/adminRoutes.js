"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadReport = exports.upload = void 0;
const express_1 = require("express");
const adminController_1 = __importDefault(require("../controllers/adminController"));
const adminAuthMiddleware_1 = require("../frameworks/webserver/middleware/adminAuthMiddleware");
const adminRouter = (0, express_1.Router)();
const multer_1 = __importDefault(require("multer"));
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
adminRouter.post("/login", adminController_1.default.adminLogin);
adminRouter.get("/userlist", adminAuthMiddleware_1.protectAdmin, adminController_1.default.getUsers);
adminRouter.patch("/blockUser/:userId", adminAuthMiddleware_1.protectAdmin, adminController_1.default.blockUser);
adminRouter.post("/add-Department", adminAuthMiddleware_1.protectAdmin, adminController_1.default.addDepartment);
adminRouter.get("/departmentlist", adminAuthMiddleware_1.protectAdmin, adminController_1.default.departmentList);
adminRouter.put("/edit-department/:id", adminAuthMiddleware_1.protectAdmin, adminController_1.default.editDepartment);
adminRouter.delete("/delete-department/:id", adminAuthMiddleware_1.protectAdmin, adminController_1.default.deleteDepartment);
adminRouter.post("/add-category", adminAuthMiddleware_1.protectAdmin, adminController_1.default.addCategory);
adminRouter.put("/edit-category/:id", adminAuthMiddleware_1.protectAdmin, adminController_1.default.editCategory);
adminRouter.delete("/delete-category/:id", adminAuthMiddleware_1.protectAdmin, adminController_1.default.deleteCategory);
adminRouter.get("/count", adminController_1.default.getUserCount);
adminRouter.get("/count-categories", adminController_1.default.getCategoryCount);
adminRouter.get("/count-departments", adminController_1.default.getDepartmentCount);
adminRouter.get("/categoryList", adminAuthMiddleware_1.protectAdmin, adminController_1.default.getCategories);
adminRouter.post("/add-service", adminAuthMiddleware_1.protectAdmin, upload, adminController_1.default.addService);
adminRouter.put("/update-service/:id", adminAuthMiddleware_1.protectAdmin, upload, adminController_1.default.editService);
adminRouter.get("/serviceList", adminController_1.default.getServices);
adminRouter.patch("/service/:id/toggleListing", adminAuthMiddleware_1.protectAdmin, adminController_1.default.toggleService);
adminRouter.get('/bookings', adminAuthMiddleware_1.protectAdmin, adminController_1.default.bookingList);
adminRouter.get('/bookings/:id', adminAuthMiddleware_1.protectAdmin, adminController_1.default.getBookingDetails);
adminRouter.get(`/service-Completed`, adminAuthMiddleware_1.protectAdmin, adminController_1.default.serviceCompleted);
adminRouter.patch(`/bookings/:bookingId/service/:serviceId`, adminController_1.default.updateBooking);
adminRouter.post("/reports/upload", uploadReport, adminAuthMiddleware_1.protectAdmin, adminController_1.default.uploadReport);
adminRouter.get('/reports', adminAuthMiddleware_1.protectAdmin, adminController_1.default.reportList);
adminRouter.put(`/reports/:editReportId`, uploadReport, adminAuthMiddleware_1.protectAdmin, adminController_1.default.updateReport);
adminRouter.patch(`/reports/:reportId/publish`, adminAuthMiddleware_1.protectAdmin, adminController_1.default.publishReport);
adminRouter.post('/chat/:chatId/send', adminAuthMiddleware_1.protectAdmin, adminController_1.default.successMessage);
adminRouter.get('/chats', adminController_1.default.getChats);
adminRouter.get('/chatList', adminController_1.default.getChatLists);
exports.default = adminRouter;
