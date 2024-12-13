/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { generateToken } from "../../domain/helper/jwtHelper";
import { Users } from "../../infrastructure/database/dbModel/userModel";
import { Encrypt } from "../../domain/helper/hashPassword";
import adminInteractor from "../../domain/useCases/auth/adminInteractor";
import authInteractor from "../../domain/useCases/auth/authInteractor";
export default {
    // ##-USER--##//
    userRegistration: async (req: Request, res: Response) => {
        try {
            const user = await authInteractor.registerUser(req.body);
            res.status(200).json({ message: "Registration Success", user });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error in userRegistration:", error.message);
                if (error.message === "User already exists") {
                    res.status(409).json({ message: error.message });
                } else {
                    res
                        .status(500)
                        .json({ message: error.message || "Internal Server Error" });
                }
            } else {
                console.error("Unexpected error in userRegistration:", error);
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    },
    verifyOTP: async (req: Request, res: Response) => {
        try {
            const userdata = await authInteractor.verifyUser(req.body);
            res.status(200).json({ message: "Verify Success", userdata });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error in verifyOTP:", error.message);
                res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            } else {
                console.error("Unexpected error in verifyOTP:", error);
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    },
    resendOTP: async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: "Email is required." });
            }
            const response = await authInteractor.otpResend(email);
            res.status(200).json({ response });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error in resendOTP:", error.message);
                res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            } else {
                console.error("Unexpected error in resendOTP:", error);
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    },
    userLogin: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const response = await authInteractor.loginUser(email, password);
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
        } catch (error: unknown) {
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
            } else {
                console.error("Unexpected error in userLogin:", error);
                return res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    },
    googleAuth: async (req: Request, res: Response) => {
        try {
            const response = await authInteractor.googleUser(req.body);
            res.status(200).json({ message: "Google Auth Success", response });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error in googleAuth:", error.message);
                res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            } else {
                console.error("Unexpected error in googleAuth:", error);
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    },
    forgotPassword: async (req: Request, res: Response) => {
        try {
            const response = await authInteractor.forgotPassword(req.body.email);
            res.status(200).json(response);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error in forgotPassword:", error.message);
                res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            } else {
                console.error("Unexpected error in forgotPassword:", error);
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    },
    reset_PasswordFn: async (req: Request, res: Response) => {
        try {
            const { token, password } = req.body;
            if (!token || !password) {
                return res
                    .status(400)
                    .json({ message: "Token and password are required." });
            }
            const response = await authInteractor.resetPassword(token, password);
            res.status(200).json(response);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error in reset_PasswordFn:", error.message);
                res
                    .status(500)
                    .json({ message: error.message || "Internal Server Error" });
            } else {
                console.error("Unexpected error in reset_PasswordFn:", error);
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    },
    refreshToken: async (req: Request, res: Response) => {
        try {
            const refreshToken = req.cookies.refreshToken;

            // Delegate logic to interactor
            const { accessToken, refreshToken: newRefreshToken } = await authInteractor.refreshToken(refreshToken);

            // Set the new refresh token as an HTTP-only cookie
            res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true, sameSite: "strict" });

            // Respond with the new access token
            res.json({ accessToken });
        } catch (error: any) {
            if (error.status) {
                res.status(error.status).json({ message: error.message });
            } else {
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    },
    changePassword: async (req: Request, res: Response) => {
        const { currentPassword, newPassword, userId } = req.body
        try {
            const user = await Users.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (!user.password) {
                return res.status(400).json({ message: 'User password not set' });
            }
            const isMatch = await Encrypt.comparePassword(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
            const hashedPassword = await Encrypt.cryptPassword(newPassword);
            user.password = hashedPassword;
            await user.save();

            res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            console.error('Error changing password:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // ##-ADMIN--##//

    adminLogin: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: "Admin Credentials missing" });
            }
            const Credentials = { email, password };
            const response = await adminInteractor.loginAdmin(Credentials);
            res.status(200).json({ message: "Login Successful", response });
        } catch (error: unknown) {
            console.error("Error during admin login:", error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    },



}