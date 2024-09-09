import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import userInteractor from "../../domain/useCases/auth/userInteractor";

export default {
  userRegistration: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userInteractor.registerUser(req.body);
      res.status(200).json({ message: "Registration Success", user });
    } catch (error: any) {
      console.log(error);
      if (error.message === "User already exists") {
        res.status(409).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  },

  verifyOTP: async (req: Request, res: Response) => {
    try {
      const response = await userInteractor.verifyUser(req.body);
      console.log("verifyOTP", response);
      res.status(200).json({ message: "Verify Success", response });
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  },
  resendOTP: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const response = await userInteractor.otpResend(email);
      res.status(200).json({ response });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  userLogin: async (req: Request, res: Response) => {
    console.log(req.body);
    try {
      const { email, password } = req.body;
      const response = await userInteractor.loginUser(email, password);
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
    } catch (error: any) {
      console.error("Controller error:", error.message);

      if (error.message === "User is not verified") {
        res.status(403).json({ message: "User is not verified" });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  },
};
