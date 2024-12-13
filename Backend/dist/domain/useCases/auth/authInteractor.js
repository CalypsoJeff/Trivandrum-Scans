"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authInteractor = void 0;
const emailUtils_1 = require("../../../utils/emailUtils");
const otpUtils_1 = require("../../../utils/otpUtils");
const hashPassword_1 = require("../../helper/hashPassword");
const mongoAuthRepository_1 = __importDefault(require("../../../infrastructure/repositories/mongoAuthRepository"));
const jwtHelper_1 = require("../../helper/jwtHelper");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Define a type for the report objec
function createError(message, status) {
    const error = new Error(message);
    error.status = status;
    return error;
}
class authInteractor {
}
exports.authInteractor = authInteractor;
exports.default = {
    registerUser: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!userData.email || !userData.name) {
                throw new Error("Email and name are required");
            }
            const existingUser = yield mongoAuthRepository_1.default.checkExistingUser(userData.email, userData.name);
            if (existingUser && existingUser.is_verified == true) {
                throw new Error("User already exists");
            }
            const otp = yield (0, otpUtils_1.generateOTP)();
            console.log(`OTP: ${otp}`);
            const generatedAt = Date.now();
            yield (0, emailUtils_1.sendOTPEmail)(userData.email, otp, userData.name);
            yield mongoAuthRepository_1.default.saveOtp(userData.email, otp, generatedAt);
            const password = userData.password;
            const hashedPassword = yield hashPassword_1.Encrypt.cryptPassword(password);
            const savedUser = yield mongoAuthRepository_1.default.createUser(userData, hashedPassword);
            return savedUser;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in registerUser:", error.message);
                throw error;
            }
            else {
                console.error("Unexpected error in registerUser:", error);
                throw new Error("An unexpected error occurred");
            }
        }
    }),
    verifyUser: (data) => __awaiter(void 0, void 0, void 0, function* () {
        if (!data.otp) {
            throw new Error("no otp");
        }
        const storedOTP = yield mongoAuthRepository_1.default.getStoredOtp(data.email);
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
        const verifiedUser = yield mongoAuthRepository_1.default.verifyUser(data.email);
        if (!verifiedUser) {
            throw new Error("User verification failed");
        }
        const role = "user";
        const { token, refreshToken } = yield (0, jwtHelper_1.generateToken)(verifiedUser.id, data.email, role);
        const user = {
            id: verifiedUser.id,
            name: verifiedUser.name,
            email: verifiedUser.email,
            isBlocked: verifiedUser.is_blocked,
            isVerified: verifiedUser.is_verified,
        };
        return { token, refreshToken, user };
    }),
    otpResend: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newotp = yield (0, otpUtils_1.generateOTP)();
            const generatedAt = Date.now();
            const users = yield mongoAuthRepository_1.default.getUserByEmail(email);
            if (users && users.name) {
                yield (0, emailUtils_1.sendOTPEmail)(email, newotp, users.name);
                console.log("newOtp:", newotp);
                yield mongoAuthRepository_1.default.saveOtp(email, newotp, generatedAt);
            }
            else {
                throw new Error("Please signup again");
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in registerUser:", error.message);
                throw error;
            }
            else {
                console.error("Unexpected error in registerUser:", error);
                throw new Error("An unexpected error occurred");
            }
        }
    }),
    loginUser: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = yield mongoAuthRepository_1.default.getUserByEmail(email);
        if (!existingUser || !existingUser.password) {
            throw new Error("User not found");
        }
        const isValid = yield hashPassword_1.Encrypt.comparePassword(password, existingUser.password);
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
        const { token, refreshToken } = yield (0, jwtHelper_1.generateToken)(existingUser.id, email, role);
        const user = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            isBlocked: existingUser.is_blocked,
        };
        return { token, user, refreshToken };
    }),
    googleUser: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const savedUser = yield mongoAuthRepository_1.default.googleUser(userData);
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
                const { token, refreshToken } = (0, jwtHelper_1.generateToken)(savedUser.id, savedUser.email, role);
                return { user, token, refreshToken };
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in registerUser:", error.message);
                throw error;
            }
            else {
                console.error("Unexpected error in registerUser:", error);
                throw new Error("An unexpected error occurred");
            }
        }
    }),
    forgotPassword: (email) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield mongoAuthRepository_1.default.getUserByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        const resetToken = (0, jwtHelper_1.generateResetToken)(email);
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);
        yield user.save();
        yield (0, emailUtils_1.sendVerifyMail)(user.email || "", resetToken, user.name || "User");
        return { message: "Password reset email sent" };
    }),
    resetPassword: (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield mongoAuthRepository_1.default.getUserByResetToken(token);
        if (!user) {
            throw new Error("Invalid or expired reset token");
        }
        if (!user.email) {
            throw new Error("User email not found");
        }
        if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
            throw new Error("Reset token has expired");
        }
        const isTokenValid = (0, jwtHelper_1.validateResetToken)(token, user.email);
        if (!isTokenValid) {
            throw new Error("Invalid reset token");
        }
        const hashedPassword = yield hashPassword_1.Encrypt.cryptPassword(newPassword);
        yield mongoAuthRepository_1.default.updateUserPassword(user.id, hashedPassword);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        yield user.save();
        return { message: "Password has been reset successfully" };
    }),
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                throw { status: 401, message: "Refresh token not provided" };
            }
            try {
                // Verify the refresh token
                const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
                // Find the user by email
                const user = yield mongoAuthRepository_1.default.getUserByEmail(decoded.email);
                if (!user) {
                    throw { status: 404, message: "User not found" };
                }
                // Generate new tokens
                const { token: newAccessToken, refreshToken: newRefreshToken } = (0, jwtHelper_1.generateToken)(user.id, decoded.email, "user");
                return { accessToken: newAccessToken, refreshToken: newRefreshToken };
            }
            catch (err) {
                if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                    throw { status: 401, message: "Refresh token expired" };
                }
                if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                    throw { status: 403, message: "Invalid refresh token" };
                }
                throw { status: 500, message: "An unknown error occurred" };
            }
        });
    },
};
