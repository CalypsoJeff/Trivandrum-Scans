"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const userAuthMiddleware_1 = require("../frameworks/webserver/middleware/userAuthMiddleware");
const authController_1 = __importDefault(require("../controllers/authController"));
const cartController_1 = __importDefault(require("../controllers/cartController"));
const serviceController_1 = __importDefault(require("../controllers/serviceController"));
const bookingController_1 = __importDefault(require("../controllers/bookingController"));
const reportController_1 = __importDefault(require("../controllers/reportController"));
const categoryController_1 = __importDefault(require("../controllers/categoryController"));
const userRouter = (0, express_1.Router)();
// Authentication routes
userRouter.post("/signup", authController_1.default.userRegistration); //-
userRouter.post("/otp-verification", authController_1.default.verifyOTP); //-
userRouter.post("/resend-otp", authController_1.default.resendOTP); //-
userRouter.post("/login", authController_1.default.userLogin); //-
userRouter.post("/googleAuth", authController_1.default.googleAuth); //-
userRouter.post("/forget-password", authController_1.default.forgotPassword); //-
userRouter.post("/reset-password", authController_1.default.reset_PasswordFn); //-
userRouter.post('/refreshtoken', authController_1.default.refreshToken); //-
userRouter.put('/change-password', authController_1.default.changePassword); //-
// User routes
userRouter.get("/getStatus", userAuthMiddleware_1.protectUser, userController_1.default.getStatus); //-
userRouter.post("/checkAuth", userAuthMiddleware_1.protectUser, userController_1.default.checkAuth); //-
userRouter.put("/updateuser/:userId", userAuthMiddleware_1.protectUser, userController_1.default.updateUser); //-
userRouter.get("/UserData/:id", userAuthMiddleware_1.protectUser, userController_1.default.getUserData); //-
userRouter.get("/familyData/:id", userAuthMiddleware_1.protectUser, userController_1.default.getFamilyData); //-
userRouter.put("/UserData/edit/:id", userAuthMiddleware_1.protectUser, userController_1.default.editUser); //-
userRouter.post("/patients/add", userAuthMiddleware_1.protectUser, userController_1.default.addPatient); //-
// Service routes
userRouter.get("/serviceList", serviceController_1.default.getServices); //-
userRouter.get("/service/:id", serviceController_1.default.getServiceDetail); //-
// Category routes
userRouter.get('/categoryList', categoryController_1.default.getCategory); //-
// Cart routes
userRouter.post("/cart/add", userAuthMiddleware_1.protectUser, cartController_1.default.addToCart); //-
userRouter.post("/cart/update/:id", userAuthMiddleware_1.protectUser, cartController_1.default.updateCart); //-
userRouter.get("/cart/:id", userAuthMiddleware_1.protectUser, cartController_1.default.fetchCart); //-
userRouter.get("/cart/latest/:id", userAuthMiddleware_1.protectUser, cartController_1.default.fetchUpdatedCart); //-
userRouter.post("/cart/remove", userAuthMiddleware_1.protectUser, cartController_1.default.removeCartItemById); //-
userRouter.post('/cart/clear', userAuthMiddleware_1.protectUser, cartController_1.default.clearCart); //-
// Booking routes
userRouter.post("/booknowcheckout", bookingController_1.default.bookNow); //-
userRouter.post("/confirm-booking", userAuthMiddleware_1.protectUser, bookingController_1.default.booking); //-
userRouter.get('/bookings/:id', userAuthMiddleware_1.protectUser, bookingController_1.default.getBookingList); //-
userRouter.get('/booking/user/:id', userAuthMiddleware_1.protectUser, bookingController_1.default.getBookingDetail); //-
userRouter.post('/booking/cancel/:id', userAuthMiddleware_1.protectUser, bookingController_1.default.cancelBooking); //-
userRouter.get('/allbookings', bookingController_1.default.getAllBookings);
// Report routes
userRouter.get('/reports/:id', userAuthMiddleware_1.protectUser, reportController_1.default.reportList);
exports.default = userRouter;
