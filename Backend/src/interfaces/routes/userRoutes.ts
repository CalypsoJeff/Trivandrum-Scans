import { Router } from "express";
import userController from "../controllers/userController";
import { protectUser } from "../frameworks/webserver/middleware/userAuthMiddleware";
const userRouter = Router();
userRouter.post("/signup", userController.userRegistration);
userRouter.post("/otp-verification", userController.verifyOTP);
userRouter.post("/resend-otp", userController.resendOTP);
userRouter.post("/login", userController.userLogin);
userRouter.post("/googleAuth", userController.googleAuth);
userRouter.post("/forget-password", userController.forgotPassword);
userRouter.post("/reset-password", userController.reset_PasswordFn);
// Protected routes
userRouter.get("/getStatus", protectUser, userController.getStatus);
userRouter.get("/UserData/:id", protectUser, userController.getUserData);
userRouter.get("/familyData/:id", protectUser, userController.getFamilyData);
userRouter.put("/UserData/edit/:id", protectUser, userController.editUser);
userRouter.post("/patients/add", protectUser, userController.addPatient);
userRouter.post("/checkAuth", protectUser, userController.checkAuth);
userRouter.put("/updateuser/:userId", protectUser, userController.updateUser);
userRouter.get("/serviceList", protectUser, userController.getServices);
userRouter.get("/service/:id", protectUser, userController.getServiceDetail);
userRouter.post("/cart/add", protectUser, userController.addToCart);
userRouter.post("/cart/update/:id", protectUser, userController.updateCart);
userRouter.get("/cart/:id", protectUser, userController.fetchCart);
userRouter.get("/cart/latest/:id", protectUser, userController.fetchUpdatedCart);
userRouter.post("/cart/remove", protectUser, userController.removeCartItemById);
userRouter.post("/booknowcheckout", userController.bookNow);
userRouter.post("/confirm-booking",protectUser,userController.booking);
userRouter.get('/bookings/:id',protectUser,userController.getBookingList)
userRouter.get('/booking/user/:id',protectUser,userController.getBookingDetail)


// userRouter.post("/webhook", express.raw({ type: "application/json" }), userController.stripeWebhook);

export default userRouter;
