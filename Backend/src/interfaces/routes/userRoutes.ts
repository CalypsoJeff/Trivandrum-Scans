import { Router } from "express";
import userController from "../controllers/userController";
import { protectUser } from "../frameworks/webserver/middleware/userAuthMiddleware";
import authController from "../controllers/authController";
import cartController from "../controllers/cartController";
import serviceController from "../controllers/serviceController";
import bookingController from "../controllers/bookingController";
import reportController from "../controllers/reportController";
import categoryController from "../controllers/categoryController";
const userRouter = Router();

// Authentication routes
userRouter.post("/signup", authController.userRegistration);//-
userRouter.post("/otp-verification", authController.verifyOTP);//-
userRouter.post("/resend-otp", authController.resendOTP);//-
userRouter.post("/login", authController.userLogin);//-
userRouter.post("/googleAuth", authController.googleAuth);//-
userRouter.post("/forget-password", authController.forgotPassword);//-
userRouter.post("/reset-password", authController.reset_PasswordFn);//-
userRouter.post('/refreshtoken',authController.refreshToken)//-
userRouter.put('/change-password',authController.changePassword)//-
// User routes
userRouter.get("/getStatus",protectUser,userController.getStatus);//-
userRouter.post("/checkAuth", protectUser, userController.checkAuth);//-
userRouter.put("/updateuser/:userId", protectUser, userController.updateUser);//-
userRouter.get("/UserData/:id", protectUser, userController.getUserData);//-
userRouter.get("/familyData/:id", protectUser, userController.getFamilyData);//-
userRouter.put("/UserData/edit/:id", protectUser, userController.editUser);//-
userRouter.post("/patients/add", protectUser, userController.addPatient);//-
// Service routes
userRouter.get("/serviceList", serviceController.getServices);//-
userRouter.get("/service/:id", serviceController.getServiceDetail);//-
// Category routes
userRouter.get('/categoryList',categoryController.getCategory)//-
// Cart routes
userRouter.post("/cart/add", protectUser, cartController.addToCart);//-
userRouter.post("/cart/update/:id", protectUser, cartController.updateCart);//-
userRouter.get("/cart/:id", protectUser, cartController.fetchCart);//-
userRouter.get("/cart/latest/:id", protectUser, cartController.fetchUpdatedCart);//-
userRouter.post("/cart/remove", protectUser, cartController.removeCartItemById);//-
userRouter.post('/cart/clear', protectUser, cartController.clearCart);//-
// Booking routes
userRouter.post("/booknowcheckout", bookingController.bookNow);//-
userRouter.post("/confirm-booking", protectUser, bookingController.booking);//-
userRouter.get('/bookings/:id', protectUser, bookingController.getBookingList)//-
userRouter.get('/booking/user/:id', protectUser, bookingController.getBookingDetail)//-
userRouter.post('/booking/cancel/:id',protectUser,bookingController.cancelBooking)//-
userRouter.get('/allbookings',bookingController.getAllBookings)
// Report routes
userRouter.get('/reports/:id',protectUser,reportController.reportList)


export default userRouter;
