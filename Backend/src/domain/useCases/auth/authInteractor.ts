import { sendOTPEmail, sendVerifyMail } from "../../../utils/emailUtils";
import { generateOTP } from "../../../utils/otpUtils";
import { Encrypt } from "../../helper/hashPassword";
import AuthRepository from "../../../infrastructure/repositories/mongoAuthRepository";
import { generateResetToken, generateToken, validateResetToken } from "../../helper/jwtHelper";
import { IUser } from "../../entities/types/userType";
import jwt from 'jsonwebtoken';

interface ErrorWithStatus extends Error {
    status?: number;
}

// Define a type for the report objec
function createError(message: string, status: number) {
    const error = new Error(message) as ErrorWithStatus;
    error.status = status;
    return error;
}

export class authInteractor{

    
}

export default {

    registerUser: async (userData: IUser) => {
        try {
            if (!userData.email || !userData.name) {
                throw new Error("Email and name are required");
            }
            const existingUser = await AuthRepository.checkExistingUser(
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
            await AuthRepository.saveOtp(userData.email, otp, generatedAt);
            const password = userData.password as string;
            const hashedPassword = await Encrypt.cryptPassword(password);
            const savedUser = await AuthRepository.createUser(userData, hashedPassword);
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
        const storedOTP = await AuthRepository.getStoredOtp(data.email);
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
        const verifiedUser = await AuthRepository.verifyUser(data.email);
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
            const users = await AuthRepository.getUserByEmail(email);
            if (users && users.name) {
                await sendOTPEmail(email, newotp, users.name);
                console.log("newOtp:", newotp);
                await AuthRepository.saveOtp(email, newotp, generatedAt);
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
        const existingUser = await AuthRepository.getUserByEmail(email);
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
            const savedUser = await AuthRepository.googleUser(userData);
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
        const user = await AuthRepository.getUserByEmail(email);
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
        const user = await AuthRepository.getUserByResetToken(token);
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
        await AuthRepository.updateUserPassword(user.id, hashedPassword);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
        return { message: "Password has been reset successfully" };
    },
    async refreshToken(refreshToken: string) {
        if (!refreshToken) {
            throw { status: 401, message: "Refresh token not provided" };
        }
        try {
            // Verify the refresh token
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY!) as {
                user: string;
                email: string;
                role: string;
            };

            // Find the user by email
            const user = await AuthRepository.getUserByEmail(decoded.email);
            if (!user) {
                throw { status: 404, message: "User not found" };
            }

            // Generate new tokens
            const { token: newAccessToken, refreshToken: newRefreshToken } = generateToken(
                user.id,
                decoded.email,
                "user"
            );

            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                throw { status: 401, message: "Refresh token expired" };
            }
            if (err instanceof jwt.JsonWebTokenError) {
                throw { status: 403, message: "Invalid refresh token" };
            }
            throw { status: 500, message: "An unknown error occurred" };
        }
    },
    
}