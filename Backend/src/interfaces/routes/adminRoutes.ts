import { Router } from "express";
import { protectAdmin } from "../frameworks/webserver/middleware/adminAuthMiddleware";
const adminRouter = Router();
import multer from "multer";
import authController from "../controllers/authController";
import userController from "../controllers/userController";
import serviceController from "../controllers/serviceController";
import departmentController from "../controllers/departmentController";
import categoryController from "../controllers/categoryController";
import bookingController from "../controllers/bookingController";
import reportController from "../controllers/reportController";
import messageController from "../controllers/messageController";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 },
}).fields([{ name: "serviceImage", maxCount: 1 }]);

export { upload };

const uploadReport = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true); // Accept file
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
}).fields([{ name: "report", maxCount: 5 }]); // Adjust maxCount as needed

export { uploadReport };

// Authentication routes
adminRouter.post("/login", authController.adminLogin);

// User routes
adminRouter.get("/userlist", protectAdmin, userController.getUsers);
adminRouter.patch("/blockUser/:userId", protectAdmin, userController.blockUser);
adminRouter.get("/count", userController.getUserCount);

// Department routes
adminRouter.post("/add-Department", protectAdmin, departmentController.addDepartment);
adminRouter.get("/departmentlist", protectAdmin, departmentController.departmentList);
adminRouter.put("/edit-department/:id", protectAdmin, departmentController.editDepartment);
adminRouter.delete("/delete-department/:id", protectAdmin, departmentController.deleteDepartment);
adminRouter.get("/count-departments", departmentController.getDepartmentCount);


// Category routes
adminRouter.post("/add-category", protectAdmin, categoryController.addCategory);
adminRouter.put("/edit-category/:id", protectAdmin, categoryController.editCategory);
adminRouter.delete("/delete-category/:id", protectAdmin, categoryController.deleteCategory);
adminRouter.get("/count-categories", categoryController.getCategoryCount);
adminRouter.get("/categoryList", protectAdmin, categoryController.getCategories);

// Service routes
adminRouter.post("/add-service", protectAdmin, upload, serviceController.addService);
adminRouter.put("/update-service/:id", protectAdmin, upload, serviceController.editService);
adminRouter.get("/serviceList", serviceController.getServicesAdmin);
adminRouter.patch("/service/:id/toggleListing", protectAdmin, serviceController.toggleService);
// Booking routes
adminRouter.get('/bookings', protectAdmin, bookingController.bookingList);
adminRouter.get('/bookings/:id', protectAdmin, bookingController.getBookingDetails);
adminRouter.get(`/service-Completed`, protectAdmin, bookingController.serviceCompleted);
adminRouter.patch(`/bookings/:bookingId/service/:serviceId`, bookingController.updateBooking);

// Report routes
adminRouter.post("/reports/upload", uploadReport, protectAdmin, reportController.uploadReport);
adminRouter.get('/reports', protectAdmin, reportController.reportListAdmin)
adminRouter.put(`/reports/:editReportId`, uploadReport, protectAdmin, reportController.updateReport)
adminRouter.patch(`/reports/:reportId/publish`, protectAdmin, reportController.publishReport)

// Message routes
adminRouter.post('/messages/chat/:chatId/send', protectAdmin, messageController.successMessage);
adminRouter.get('/messages/chats', messageController.getChats);
adminRouter.get('/chatList', messageController.getChatLists);

export default adminRouter;
