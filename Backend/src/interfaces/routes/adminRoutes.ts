import { Router } from "express";
import adminController from "../controllers/adminController";
import { protectAdmin } from "../frameworks/webserver/middleware/adminAuthMiddleware";
const adminRouter = Router();
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 },
}).fields([{ name: "serviceImage", maxCount: 1 }]);

export { upload };

adminRouter.post("/login", adminController.adminLogin);

adminRouter.get("/userlist", protectAdmin, adminController.getUsers);
adminRouter.patch(
  "/blockUser/:userId",
  protectAdmin,
  adminController.blockUser
);
adminRouter.post(
  "/add-Department",
  protectAdmin,
  adminController.addDepartment
);
adminRouter.get(
  "/departmentlist",
  protectAdmin,
  adminController.departmentList
);
adminRouter.put(
  "/edit-department/:id",
  protectAdmin,
  adminController.editDepartment
);
adminRouter.delete(
  "/delete-department/:id",
  protectAdmin,
  adminController.deleteDepartment
);
adminRouter.post("/add-category", protectAdmin, adminController.addCategory);
adminRouter.put(
  "/edit-category/:id",
  protectAdmin,
  adminController.editCategory
);
adminRouter.delete(
  "/delete-category/:id",
  protectAdmin,
  adminController.deleteCategory
);
adminRouter.get("/count", adminController.getUserCount);
adminRouter.get("/count-categories", adminController.getCategoryCount);
adminRouter.get("/count-departments", adminController.getDepartmentCount);
adminRouter.get("/categoryList", protectAdmin, adminController.getCategories);
adminRouter.post(
  "/add-service",
  protectAdmin,
  upload,
  adminController.addService
);
adminRouter.put(
  "/update-service/:id",
  protectAdmin,
  upload,
  adminController.editService
);
adminRouter.get("/serviceList", adminController.getServices);
adminRouter.patch(
  "/service/:id/toggleListing",
  protectAdmin,
  adminController.toggleService
);
adminRouter.get('/bookings',protectAdmin,adminController.bookingList)
adminRouter.get('/bookings/:id',protectAdmin,adminController.getBookingDetails)
export default adminRouter;
