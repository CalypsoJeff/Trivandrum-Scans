"use strict";
// import { IUser } from "../../domain/entities/types/userType";
// import { Encrypt } from "../../domain/helper/hashPassword";
// import OTPModel from "../database/dbModel/otpModel";
// import { Users } from "../database/dbModel/userModel";
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
const hashPassword_1 = require("../../domain/helper/hashPassword");
const otpModel_1 = __importDefault(require("../database/dbModel/otpModel"));
const userModel_1 = require("../database/dbModel/userModel");
class AuthRepository {
    checkExistingUser(email, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModel_1.Users.findOne({
                    $and: [{ email: email }, { name: name }],
                });
            }
            catch (error) {
                throw new Error("Email and Name are required" + error);
            }
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.Users.findOne({ email: email });
        });
    }
    createUser(userData, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userData.email || !userData.name) {
                throw new Error("Email and Name are required");
            }
            const existingUser = yield this.checkExistingUser(userData.email, userData.name);
            if (existingUser) {
                if (existingUser.is_verified === false) {
                    return existingUser;
                }
                throw new Error("User already exists");
            }
            if (!userData.name || !userData.email || !userData.password) {
                throw new Error("Name, Email, and Password are required fields");
            }
            const newUser = new userModel_1.Users({
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
            });
            return yield newUser.save();
        });
    }
    verifyUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.Users.findOneAndUpdate({ email: email }, { $set: { is_verified: true } }, { new: true });
        });
    }
    saveOtp(email, otp, generatedAt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otpForStore = new otpModel_1.default({ otp, email, generatedAt });
                return yield otpForStore.save();
            }
            catch (error) {
                console.error("Error saving OTP:", error);
                throw new Error("Error saving OTP");
            }
        });
    }
    getStoredOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield otpModel_1.default.findOne({ email: email }).sort({ createdAt: -1 }).limit(1);
        });
    }
    googleUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userData.email || !userData.name) {
                    throw new Error("User data is incomplete");
                }
                const existingUser = yield userModel_1.Users.findOne({ email: userData.email });
                if (existingUser) {
                    console.log("User already exists:", existingUser);
                    return existingUser;
                }
                const generatePass = Math.random().toString(36).slice(-8);
                const hashedPassword = yield hashPassword_1.Encrypt.cryptPassword(generatePass);
                const newUser = new userModel_1.Users({
                    name: userData.name,
                    email: userData.email,
                    password: hashedPassword,
                    is_google: true,
                });
                return yield newUser.save();
            }
            catch (error) {
                console.error("Error in googleUser:", error);
                throw new Error("Error during Google user authentication");
            }
        });
    }
    resetPassword(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.Users.updateOne({ email: email }, { $set: { token: token } });
        });
    }
    getUserByResetToken(resetToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModel_1.Users.findOne({
                    resetPasswordToken: resetToken,
                    resetPasswordExpires: { $gt: new Date() },
                });
            }
            catch (error) {
                console.error("Error fetching user by reset token:", error);
                throw new Error("Invalid or expired reset token");
            }
        });
    }
    updateUserPassword(userId, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.Users.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
                if (!user) {
                    throw new Error("User not found");
                }
                return user;
            }
            catch (error) {
                console.error("Error updating password:", error);
                throw new Error("Error updating password");
            }
        });
    }
}
exports.default = new AuthRepository();
