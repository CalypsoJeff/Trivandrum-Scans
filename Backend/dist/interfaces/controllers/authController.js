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
const userModel_1 = require("../../infrastructure/database/dbModel/userModel");
const hashPassword_1 = require("../../domain/helper/hashPassword");
const adminInteractor_1 = __importDefault(require("../../domain/useCases/auth/adminInteractor"));
const authInteractor_1 = __importDefault(require("../../domain/useCases/auth/authInteractor"));
exports.default = {
    // ##-USER--##//
    userRegistration: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield authInteractor_1.default.registerUser(req.body);
            res.status(200).json({ message: "Registration Success", user });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in userRegistration:", error.message);
                if (error.message === "User already exists") {
                    res.status(409).json({ message: error.message });
                }
                else {
                    res
                        .status(500)
                        .json({ message: error.message || "Internal Server Error" });
                }
            }
            else {
                console.error("Unexpected error in userRegistration:", error);
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    }),
    verifyOTP: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userdata = yield authInteractor_1.default.verifyUser(req.body);
            res.status(200).json({ message: "Verify Success", userdata });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in verifyOTP:", error.message);
                res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            }
            else {
                console.error("Unexpected error in verifyOTP:", error);
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    }),
    resendOTP: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: "Email is required." });
            }
            const response = yield authInteractor_1.default.otpResend(email);
            res.status(200).json({ response });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in resendOTP:", error.message);
                res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            }
            else {
                console.error("Unexpected error in resendOTP:", error);
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    }),
    userLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const response = yield authInteractor_1.default.loginUser(email, password);
            const { token, refreshToken } = response;
            res.cookie("usertoken", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });
            res.status(200).json({ message: "Login success", response });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in userLogin:", error.message);
                if (error.message === "Account is Blocked") {
                    return res.status(403).json({ message: "Account is Blocked" });
                }
                if (error.message === "Invalid password") {
                    return res.status(401).json({ message: "Invalid password" });
                }
                if (error.message === "User not found") {
                    return res.status(404).json({ message: "User not found" });
                }
                if (error.message === "User is not verified") {
                    return res.status(403).json({ message: "User is not verified" });
                }
                return res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            }
            else {
                console.error("Unexpected error in userLogin:", error);
                return res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    }),
    googleAuth: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield authInteractor_1.default.googleUser(req.body);
            res.status(200).json({ message: "Google Auth Success", response });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in googleAuth:", error.message);
                res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            }
            else {
                console.error("Unexpected error in googleAuth:", error);
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    }),
    forgotPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield authInteractor_1.default.forgotPassword(req.body.email);
            res.status(200).json(response);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in forgotPassword:", error.message);
                res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            }
            else {
                console.error("Unexpected error in forgotPassword:", error);
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    }),
    reset_PasswordFn: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { token, password } = req.body;
            if (!token || !password) {
                return res
                    .status(400)
                    .json({ message: "Token and password are required." });
            }
            const response = yield authInteractor_1.default.resetPassword(token, password);
            res.status(200).json(response);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error in reset_PasswordFn:", error.message);
                res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            }
            else {
                console.error("Unexpected error in reset_PasswordFn:", error);
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    }),
    refreshToken: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const refreshToken = req.cookies.refreshToken;
            // Delegate logic to interactor
            const { accessToken, refreshToken: newRefreshToken } = yield authInteractor_1.default.refreshToken(refreshToken);
            // Set the new refresh token as an HTTP-only cookie
            res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true, sameSite: "strict" });
            // Respond with the new access token
            res.json({ accessToken });
        }
        catch (error) {
            if (error.status) {
                res.status(error.status).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    }),
    changePassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { currentPassword, newPassword, userId } = req.body;
        try {
            const user = yield userModel_1.Users.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (!user.password) {
                return res.status(400).json({ message: 'User password not set' });
            }
            const isMatch = yield hashPassword_1.Encrypt.comparePassword(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
            const hashedPassword = yield hashPassword_1.Encrypt.cryptPassword(newPassword);
            user.password = hashedPassword;
            yield user.save();
            res.status(200).json({ message: 'Password updated successfully' });
        }
        catch (error) {
            console.error('Error changing password:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),
    // ##-ADMIN--##//
    adminLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: "Admin Credentials missing" });
            }
            const Credentials = { email, password };
            const response = yield adminInteractor_1.default.loginAdmin(Credentials);
            res.status(200).json({ message: "Login Successful", response });
        }
        catch (error) {
            console.error("Error during admin login:", error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }),
};
