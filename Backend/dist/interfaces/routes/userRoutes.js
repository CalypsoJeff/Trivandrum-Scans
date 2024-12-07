"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const userAuthMiddleware_1 = require("../frameworks/webserver/middleware/userAuthMiddleware");
const userRouter = (0, express_1.Router)();
userRouter.post("/signup", userController_1.default.userRegistration);
userRouter.post("/otp-verification", userController_1.default.verifyOTP);
userRouter.post("/resend-otp", userController_1.default.resendOTP);
userRouter.post("/login", userController_1.default.userLogin);
userRouter.post("/googleAuth", userController_1.default.googleAuth);
userRouter.post("/forget-password", userController_1.default.forgotPassword);
userRouter.post("/reset-password", userController_1.default.reset_PasswordFn);
userRouter.post('/refreshtoken', userController_1.default.refreshToken);
// Protected routes
userRouter.get("/getStatus", userAuthMiddleware_1.protectUser, userController_1.default.getStatus);
userRouter.get("/UserData/:id", userAuthMiddleware_1.protectUser, userController_1.default.getUserData);
userRouter.get("/familyData/:id", userAuthMiddleware_1.protectUser, userController_1.default.getFamilyData);
userRouter.put("/UserData/edit/:id", userAuthMiddleware_1.protectUser, userController_1.default.editUser);
userRouter.post("/patients/add", userAuthMiddleware_1.protectUser, userController_1.default.addPatient);
userRouter.post("/checkAuth", userAuthMiddleware_1.protectUser, userController_1.default.checkAuth);
userRouter.put("/updateuser/:userId", userAuthMiddleware_1.protectUser, userController_1.default.updateUser);
userRouter.get("/serviceList", userController_1.default.getServices);
userRouter.get("/service/:id", userController_1.default.getServiceDetail);
userRouter.get('/categoryList', userController_1.default.getCategory);
userRouter.post("/cart/add", userAuthMiddleware_1.protectUser, userController_1.default.addToCart);
userRouter.post("/cart/update/:id", userAuthMiddleware_1.protectUser, userController_1.default.updateCart);
userRouter.get("/cart/:id", userAuthMiddleware_1.protectUser, userController_1.default.fetchCart);
userRouter.get("/cart/latest/:id", userAuthMiddleware_1.protectUser, userController_1.default.fetchUpdatedCart);
userRouter.post("/cart/remove", userAuthMiddleware_1.protectUser, userController_1.default.removeCartItemById);
userRouter.post("/booknowcheckout", userController_1.default.bookNow);
userRouter.post("/confirm-booking", userAuthMiddleware_1.protectUser, userController_1.default.booking);
userRouter.get('/bookings/:id', userAuthMiddleware_1.protectUser, userController_1.default.getBookingList);
userRouter.get('/booking/user/:id', userAuthMiddleware_1.protectUser, userController_1.default.getBookingDetail);
userRouter.post('/cart/clear', userAuthMiddleware_1.protectUser, userController_1.default.clearCart);
userRouter.post('/booking/cancel/:id', userAuthMiddleware_1.protectUser, userController_1.default.cancelBooking);
userRouter.get('/reports/:id', userAuthMiddleware_1.protectUser, userController_1.default.reportList);
userRouter.get('/allbookings', userController_1.default.getAllBookings);
userRouter.put('/change-password', userController_1.default.changePassword);
exports.default = userRouter;
