import {
  addToCartInDb,
  checkExistingUser,
  createUser,
  getPaginatedServices,
  getService,
  getStoredOTP,
  getUserbyEMail,
  getUserByResetToken,
  googleUser,
  removeServiceFromCartinDb,
  saveOtp,
  updateUserPassword,
  userCartInDb,
  verifyUserDb,
} from "../../../infrastructure/repositories/mongoUserRepository";
import { sendOTPEmail, sendVerifyMail } from "../../../utils/emailUtils";
import { log } from "console";
import { generateOTP } from "../../../utils/otpUtils";
import { IUser } from "../../entities/types/userType";
import { Encrypt } from "../../helper/hashPassword";
import {
  generateResetToken,
  generateToken,
  validateResetToken,
} from "../../helper/jwtHelper";
import {
} from "../../../infrastructure/repositories/mongoAdminRepository";
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
    console.log("UserData usecase");
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
      console.log(savedUser);
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
    console.log("body ", data);
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
    return await verifyUserDb(data.email);
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

  googleUser: async (userData: IUser) => {
    try {
      const savedUser = await googleUser(userData);
      console.log("Saved User:", savedUser);
      if (savedUser) {
        const user = {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
        };
        console.log("User Object:", user);
        if (!savedUser._id || !savedUser.email) {
          throw new Error("User not found");
        }
        if (savedUser.is_blocked) {
          throw createError("Account is Blocked", 403); //Forbidden
        }
        const role = "user";
        const { token, refreshToken } = generateToken(
          savedUser.id,
          savedUser.email,
          role
        );
        log(token, refreshToken, "refresh");
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
    console.log(resetToken, "this is reset token");
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
  addToCart: async(userId:string,serviceId:string)=>{
    try {
      await addToCartInDb(userId,serviceId);
    } catch (error) {
      console.error("Unexpected error in addToCart:", error);
        throw new Error("An unexpected error in addToCart");
    }
  },
  getCart:async(id:string)=>{
    try {
      const cartData = await userCartInDb(id);
      return cartData
    } catch (error) {
      console.error("Unexpected error in getCart:", error);
        throw new Error("An unexpected error in getCart");
    }
  },
  removeCartItem:async(userId:string,serviceId:string)=>{
    try {
      await removeServiceFromCartinDb(userId,serviceId);
    } catch (error) {
      console.error("Unexpected error in removing Cart:", error);
        throw new Error("An unexpected error in removing Cart");
    }
  }
};
