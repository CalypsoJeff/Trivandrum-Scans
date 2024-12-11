/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendOTPEmail, sendVerifyMail } from "../../../utils/emailUtils";
import { generateOTP } from "../../../utils/otpUtils";
import { Encrypt } from "../../helper/hashPassword";
import {
  generateResetToken,
  generateToken,
  validateResetToken,
} from "../../helper/jwtHelper";
import { } from "../../../infrastructure/repositories/mongoAdminRepository";
import { IPatientInput } from "../../entities/types/patientType";
import { checkExistingUser, createUser, getStoredOTP, getUserbyEmail, getUserByResetToken, googleUser, saveOtp, updateUserPassword, verifyUserDb } from "../../../infrastructure/repositories/mongoAuthRepository";
import { addPatientInDb, editUserInDb, getFamilyDataInDb, getStatus } from "../../../infrastructure/repositories/mongoUserRepository";
import { getAllUsers, getPaginatedUsers, updateUserStatus } from "../../../infrastructure/repositories/mongoUserRepository";
import { IUser, PaginatedUsers } from "../../entities/types/userType";

interface ErrorWithStatus extends Error {
  status?: number;
}

// Define a type for the report objec
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
      const users = await getUserbyEmail(email);
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
    const existingUser = await getUserbyEmail(email);
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
    const user = await getUserbyEmail(email);
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
  // ##-ADMIN--##//

  userList: async () => {
    try {
      const users = await getAllUsers();
      return users;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
        throw error;
      }
      throw new Error("An unknown error occurred while fetching user list");
    }
  },
  getUsers: async (page: number, limit: number): Promise<PaginatedUsers> => {
    try {
      const users = await getPaginatedUsers(page, limit);
      return users;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(
        "An unknown error occurred while fetching paginated users"
      );
    }
  },

  updatedUserStatus: async (
    userId: string,
    is_blocked: boolean
  ): Promise<IUser | null> => {
    try {
      const updatedUser = await updateUserStatus(userId, is_blocked);
      return updatedUser;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(
          "An unknown error occurred while updating user status in userInteractor."
        );
      }
    }
  },
}