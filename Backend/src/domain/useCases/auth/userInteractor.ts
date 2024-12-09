/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addPatientInDb,
  addToCartInDb,
  BookingListInDb,
  cancelBookingInDb,
  checkExistingUser,
  clearCartInDb,
  createUser,
  editUserInDb,
  findBookingById,
  getCategories,
  getFamilyDataInDb,
  getPaginatedServices,
  getService,
  getStatus,
  getStoredOTP,
  getUserbyEMail,
  getUserByResetToken,
  googleUser,
  removeServiceFromCartinDb,
  reportListInDb,
  saveBooking,
  saveOtp,
  updateUserPassword,
  userCartInDb,
  userUpdatedCartInDb,
  verifyUserDb,
} from "../../../infrastructure/repositories/mongoUserRepository";
import { sendOTPEmail, sendVerifyMail } from "../../../utils/emailUtils";
import { generateOTP } from "../../../utils/otpUtils";
import { IUser } from "../../entities/types/userType";
import { Encrypt } from "../../helper/hashPassword";
import {
  generateResetToken,
  generateToken,
  validateResetToken,
} from "../../helper/jwtHelper";
import { } from "../../../infrastructure/repositories/mongoAdminRepository";
import { IPatientInput } from "../../entities/types/patientType";
import Stripe from "stripe";
import mongoose from "mongoose";
const stripe = new Stripe(process.env.STRIPE_KEY as string, {});
interface ErrorWithStatus extends Error {
  status?: number;
}
function createError(message: string, status: number) {
  const error = new Error(message) as ErrorWithStatus;
  error.status = status;
  return error;
}
export default {
  registerUser: async (userData: IUser) => {
    try {
      if (!userData.email || !userData.name) {
        throw new Error("Email and name are required");
      }
      const existingUser = await checkExistingUser(
        userData.email,
        userData.name
      );
      if (existingUser && existingUser.is_verified == true) {
        throw new Error("User already exists");
      }
      const otp = await generateOTP();
      console.log(`OTP: ${otp}`);
      const generatedAt = Date.now();
      await sendOTPEmail(userData.email, otp, userData.name);
      await saveOtp(userData.email, otp, generatedAt);
      const password = userData.password as string;
      const hashedPassword = await Encrypt.cryptPassword(password);
      const savedUser = await createUser(userData, hashedPassword);
      return savedUser;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in registerUser:", error.message);
        throw error;
      } else {
        console.error("Unexpected error in registerUser:", error);
        throw new Error("An unexpected error occurred");
      }
    }
  },
  verifyUser: async (data: { otp: string; email: string }) => {
    if (!data.otp) {
      throw new Error("no otp");
    }
    const storedOTP = await getStoredOTP(data.email);
    console.log("Stored OTP: ", storedOTP);
    if (!storedOTP || storedOTP.otp !== data.otp) {
      console.log("invalid otp");
      throw new Error("Invalid Otp");
    }
    const otpGeneratedAt = storedOTP.generatedAt;
    const currentTime = Date.now();
    const otpAge = currentTime - otpGeneratedAt.getTime();
    const expireOTP = 1 * 60 * 1000;
    if (otpAge > expireOTP) {
      throw new Error("OTP Expired");
    }
    const verifiedUser = await verifyUserDb(data.email);
    if (!verifiedUser) {
      throw new Error("User verification failed");
    }
    const role = "user";
    const { token, refreshToken } = await generateToken(
      verifiedUser.id,
      data.email,
      role
    );
    const user = {
      id: verifiedUser.id,
      name: verifiedUser.name,
      email: verifiedUser.email,
      isBlocked: verifiedUser.is_blocked,
      isVerified: verifiedUser.is_verified,
    };
    return { token, refreshToken, user };
  },
  otpResend: async (email: string) => {
    try {
      const newotp = await generateOTP();
      const generatedAt = Date.now();
      const users = await getUserbyEMail(email);
      if (users && users.name) {
        await sendOTPEmail(email, newotp, users.name);
        console.log("newOtp:", newotp);
        await saveOtp(email, newotp, generatedAt);
      } else {
        throw new Error("Please signup again");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in registerUser:", error.message);
        throw error;
      } else {
        console.error("Unexpected error in registerUser:", error);
        throw new Error("An unexpected error occurred");
      }
    }
  },
  loginUser: async (email: string, password: string) => {
    const existingUser = await getUserbyEMail(email);
    if (!existingUser || !existingUser.password) {
      throw new Error("User not found");
    }
    const isValid = await Encrypt.comparePassword(
      password,
      existingUser.password
    );
    if (!isValid) {
      throw new Error("Invalid password");
    }
    if (existingUser && existingUser.is_blocked) {
      throw new Error("Account is Blocked");
    }
    if (existingUser.is_verified == false) {
      throw new Error(`User is not verified.Register!`);
    }
    const role = "user";
    const { token, refreshToken } = await generateToken(
      existingUser.id,
      email,
      role
    );
    const user = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      isBlocked: existingUser.is_blocked,
    };
    return { token, user, refreshToken };
  },
  getStatus: async (id: string) => {
    try {
      return await getStatus(id)
    } catch (error: any) {
      console.error(error.message)
      throw error
    }
  },
  googleUser: async (userData: IUser) => {
    try {
      const savedUser = await googleUser(userData);
      if (savedUser) {
        const user = {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
        };
        if (!savedUser._id || !savedUser.email) {
          throw new Error("User not found");
        }
        if (savedUser.is_blocked) {
          throw createError("Account is Blocked", 403);
        }
        const role = "user";
        const { token, refreshToken } = generateToken(
          savedUser.id,
          savedUser.email,
          role
        );
        return { user, token, refreshToken };
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in registerUser:", error.message);
        throw error;
      } else {
        console.error("Unexpected error in registerUser:", error);
        throw new Error("An unexpected error occurred");
      }
    }
  },
  forgotPassword: async (email: string) => {
    const user = await getUserbyEMail(email);
    if (!user) {
      throw new Error("User not found");
    }
    const resetToken = generateResetToken(email);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();
    await sendVerifyMail(user.email || "", resetToken, user.name || "User");
    return { message: "Password reset email sent" };
  },
  resetPassword: async (token: string, newPassword: string) => {
    const user = await getUserByResetToken(token);
    if (!user) {
      throw new Error("Invalid or expired reset token");
    }
    if (!user.email) {
      throw new Error("User email not found");
    }
    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      throw new Error("Reset token has expired");
    }
    const isTokenValid = validateResetToken(token, user.email);
    if (!isTokenValid) {
      throw new Error("Invalid reset token");
    }
    const hashedPassword = await Encrypt.cryptPassword(newPassword);
    await updateUserPassword(user.id, hashedPassword);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    return { message: "Password has been reset successfully" };
  },
  getServiceData: async (id: string) => {
    const service = await getService(id);
    return service;
  },
  getServiceList: async (page: number, limit: number) => {
    try {
      const services = await getPaginatedServices(page, limit); // Update to use the new function
      return services;
    } catch (error) {
      console.error("Error fetching service list:", error);
      throw new Error("Error fetching service list");
    }
  },
  addToCart: async (userId: string, serviceId: string) => {
    try {
      await addToCartInDb(userId, serviceId);
    } catch (error) {
      console.error("Unexpected error in addToCart:", error);
      throw new Error("An unexpected error in addToCart");
    }
  },
  getCart: async (id: string) => {
    try {
      const cartData = await userCartInDb(id);
      return cartData;
    } catch (error) {
      console.error("Unexpected error in getCart:", error);
      throw new Error("An unexpected error in getCart");
    }
  },
  getUpdatedCart: async (id: string) => {
    try {
      const cartData = await userUpdatedCartInDb(id);
      return cartData;
    } catch (error) {
      console.error("Unexpected error in getCart:", error);
      throw new Error("An unexpected error in getCart");
    }
  },
  removeCartItem: async (userId: string, serviceId: string) => {
    try {
      await removeServiceFromCartinDb(userId, serviceId);
    } catch (error) {
      console.error("Unexpected error in removing Cart:", error);
      throw new Error("An unexpected error in removing Cart");
    }
  },
  editUser: async (id: string, fieldToChange: object) => {
    try {
      const updatedUser = await editUserInDb(id, fieldToChange);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user", error);
      throw new Error("Error updating user");
    }
  },
  addPatient: async (patientData: IPatientInput, userId: string) => {
    try {
      const addedPatient = await addPatientInDb(patientData, userId);
      return addedPatient; // Return the added patient
    } catch (error) {
      console.error("Error in adding patient: ", error);
      throw new Error("Error in adding patient");
    }
  },
  getFamilyData: async (id: string) => {
    try {
      const familyData = getFamilyDataInDb(id);
      return familyData;
    } catch (error) {
      console.error("Error fetching patient: ", error);
      throw new Error("Error fetching patient");
    }
  },

  getCategories: async () => {
    try {
      return await getCategories();
    } catch (error) {
      console.error("Error in userInteractor getCategories:", error);
      throw error; // Re-throw to be handled by the controller
    }
  },
  confirmBooking: async ({
    stripe_session_id,
    user_id,
    booking_date,
    services,
    total_amount,
    booking_time_slot,
  }: {
    stripe_session_id: string;
    user_id: string;
    booking_date: Date;
    services: {
      serviceId: string;
      personIds: { _id: string }[];
    }[];
    total_amount: number;
    booking_time_slot: string;
  }): Promise<{ success: boolean; booking: unknown }> => {
    try {
      const session = await stripe.checkout.sessions.retrieve(stripe_session_id);
      if (!session || session.payment_status !== "paid") {
        throw new Error("Payment not completed or unsuccessful.");
      }
      const paymentIntentId = session.payment_intent
        ? (typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent.id)
        : null;
      if (!paymentIntentId) {
        throw new Error("Payment Intent ID is missing.");
      }
      const servicesWithObjectIds = services.map((service) => ({
        service_id: new mongoose.Types.ObjectId(service.serviceId),
        persons: service.personIds.map(
          (person) => new mongoose.Types.ObjectId(person._id)
        ),
      }));
      const savedBooking = await saveBooking({
        stripe_session_id,
        paymentIntentId,
        user_id,
        booking_date,
        services: servicesWithObjectIds,
        total_amount,
        booking_time_slot,
      });
      return { success: true, booking: savedBooking };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error confirming booking: ${error.message}`);
      }
      throw error;
    }
  },
  getBookingList: async (id: string) => {
    try {
      return await BookingListInDb(id);
    } catch (error) {
      console.error("Error in getBookingList:", error);
      throw error;
    }
  },
  getBookingById: async (id: string) => {
    try {
      const booking = await findBookingById(id); // Call repository to get booking details
      return booking;
    } catch (error) {
      console.error("Error in userInteractor:", error);
      throw new Error("Failed to fetch booking details");
    }
  },
  clearCart: async (userId: string) => {
    try {
      await clearCartInDb(userId);
    } catch (error) {
      console.error("Error in clearing cart from interactor:", error);
      throw error;
    }
  },
  cancelBooking: async (id: string) => {
    try {
      const cancelledBooking = await cancelBookingInDb(id);
      if (!cancelledBooking) {
        throw new Error("Booking not found or already cancelled");
      }
      if (cancelledBooking.paymentIntentId) {
        try {
          const refund = await stripe.refunds.create({
            payment_intent: cancelledBooking.paymentIntentId,
          });
          console.log(refund.id, 'refund successfull ');
        } catch (error) {
          console.error("Error in refund:", error);
        }
      } else {
        console.log('no payment intent id found ');
      }
      return cancelledBooking;
    } catch (error) {
      console.error("Error in cancelBooking:", error);
      throw error;
    }
  },
  reportList: async (id: string) => {
    try {
      const reportList = await reportListInDb(id);
      return reportList;
    } catch (error) {
      console.error("Error in reportList interactor:", error);
      throw new Error("Failed to fetch report list");
    }
  }
};
