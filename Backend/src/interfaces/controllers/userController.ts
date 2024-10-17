import { Request, Response } from "express";
import userInteractor from "../../domain/useCases/auth/userInteractor";
import { Users } from "../../infrastructure/database/dbModel/userModel";
import Stripe from "stripe";
import { bookAppointment } from "../../infrastructure/repositories/mongoUserRepository";

const stripe = new Stripe(process.env.STRIPE_KEY as string, {
  apiVersion: undefined,
});

export default {
  getStatus: async (req: Request, res: Response) => {
    try {
      if (req.user) {
        res
          .status(200)
          .json({ message: "User is authenticated", user: req.user });
      } else {
        res.status(401).json({ message: "User is not authenticated" });
      }
    } catch (error) {
      console.error("Unexpected error in resendOTP:", error);
      res.status(500).json({ error: "Failed to get user status" });
    }
  },

  userRegistration: async (req: Request, res: Response) => {
    try {
      const user = await userInteractor.registerUser(req.body);
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
      const response = await userInteractor.verifyUser(req.body);
      res.status(200).json({ message: "Verify Success", response });
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
      const response = await userInteractor.otpResend(email);
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in userLogin:", error.message);
        if (error.message === "User is not verified") {
          res.status(403).json({ message: "User is not verified" });
        } else {
          res
            .status(500)
            .json({ message: error.message || "Internal Server Error" });
        }
      } else {
        console.error("Unexpected error in userLogin:", error);
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  },

  googleAuth: async (req: Request, res: Response) => {
    try {
      const response = await userInteractor.googleUser(req.body);
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
      const response = await userInteractor.forgotPassword(req.body.email);
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
      const response = await userInteractor.resetPassword(token, password);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  checkAuth: async (req: Request, res: Response) => {
    console.log("Hellooooo checkauth");
  },

  updateUser: async (req: Request, res: Response) => {
    const { name, address, mobile, age } = req.body; // Destructure all fields from the request body
    const { userId } = req.params;

    try {
      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.name = name || user.name;
      user.address = address || user.address;
      user.mobile = mobile || user.mobile;
      user.age = age || user.age;
      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  },

  getServiceDetail: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const fetchedServiceDetail = await userInteractor.getServiceData(id);
      res.status(200).json(fetchedServiceDetail);
    } catch (error) {
      console.error("Error fetching service detail :", error);
      res.status(500).json();
    }
  },
  getServices: async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const serviceList = await userInteractor.getServiceList(
        Number(page),
        Number(limit)
      );
      res.status(200).json(serviceList);
    } catch (error) {
      console.error("Failed to retrieve services", error);
      res.status(500).json({ message: "Failed to retrieve services" });
    }
  },
  addToCart: async (req: Request, res: Response) => {
    try {
      const { userId, serviceId } = req.body;
      await userInteractor.addToCart(userId, serviceId);
      res.status(200).json({ message: "successfully added to cart" });
    } catch (error) {
      console.error("Failed to add service to user cart", error);
      res.status(500).json({ message: "Failed to add service to user cart" });
    }
  },
  fetchCart: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const cart = await userInteractor.getCart(id);
      res.status(200).json(cart);
    } catch (error) {
      console.error("Failed to add service to user cart", error);
      res.status(500).json({ message: "Failed to add service to user cart" });
    }
  },
  removeCartItemById: async (req: Request, res: Response) => {
    try {
      const { userId, serviceId } = req.body;
      await userInteractor.removeCartItem(userId, serviceId);
      res.status(200).json();
    } catch (error) {
      console.error("Failed to remove service from user cart", error);
      res
        .status(500)
        .json({ message: "Failed to remove service from user cart" });
    }
  },

  bookNow: async (req: Request, res: Response) => {
    try {
      const { userId, services, appointmentDate, totalAmount } = req.body;

      // Create Stripe session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: "Service Booking",
              },
              unit_amount: totalAmount * 100, // Stripe expects the amount in cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
        metadata: {
          userId,
          services: JSON.stringify(services),
          appointmentDate,
        },
      });
      if (session) {
        const booking = await bookAppointment(
          userId,
          services,
          appointmentDate,
          totalAmount,
          "pending",
          session.id
        );
        console.log(booking);
      }
      res.json({ sessionId: session.id });
    } catch (error) {
      console.error("Error creating Stripe session:", error);
      res.status(500).json({ error: "Failed to create Stripe session" });
    }
  },
};
