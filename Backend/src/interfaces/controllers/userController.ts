import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import userInteractor from "../../domain/useCases/auth/userInteractor";
import { Users } from "../../infrastructure/database/dbModel/userModel";
import Stripe from "stripe";
import Cart from "../../infrastructure/database/dbModel/cartModel";
import { IServiceUpdate } from "../../domain/entities/types/serviceType";
import BookingModel from "../../infrastructure/database/dbModel/bookingModel";
import { generateToken } from "../../domain/helper/jwtHelper";
import { getUserbyEMail } from "../../infrastructure/repositories/mongoUserRepository";
const stripe = new Stripe(process.env.STRIPE_KEY as string, {});

export default {
  getStatus: async (req: Request, res: Response) => {
    try {
      if (req.user && req.user.user) {
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
      console.log(response);

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

  refreshToken: async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      console.log(refreshToken, 'refreshToken in request');
      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token not provided" });
      }
      try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY!) as { user: string, email: string, role: string };
        console.log(decoded, 'decoded refresh token data');

        const user = await getUserbyEMail(decoded.email);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const { token: newAccessToken, refreshToken: newRefreshToken } = generateToken(user.id, decoded.email, 'user');
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
        res.json({ accessToken: newAccessToken });

      } catch (err) {
        if (err instanceof Error) {
          if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Refresh token expired" });
          }
          return res.status(403).json({ message: "Invalid refresh token" });
        }
        // Handle non-Error types if necessary
        return res.status(500).json({ message: "An unknown error occurred" });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
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
  fetchUpdatedCart: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const cart = await userInteractor.getUpdatedCart(id);
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
      const {
        userId,
        services,
        appointmentDate,
        appointmentTimeSlot,
        totalAmount,
      } = req.body;
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: { name: "Service Booking" },
              unit_amount: totalAmount * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.CLIENT_URL
          }/appointment-success?session_id={CHECKOUT_SESSION_ID}&user_id=${userId}&appointment_date=${appointmentDate}&appointment_time_slot=${appointmentTimeSlot}&services=${encodeURIComponent(
            JSON.stringify(services)
          )}&amount=${totalAmount}`,

        cancel_url: `${process.env.CLIENT_URL}/appointment-failure`,

      });

      if (!session) {
        throw new Error("Failed to create Stripe session.");
      }
      res.json({ sessionId: session.id });
    } catch (error) {
      console.error("Error creating Stripe session:", error);
      res.status(500).json({ error: "Failed to create Stripe session" });
    }
  },

  getUserData: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await Users.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching userdata:", error);
      res.status(500).json({ error: "Error fetching userdata" });
    }
  },
  editUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { fieldToChange } = req.body;
      const editedUser = await userInteractor.editUser(id, fieldToChange);
      res.status(200).json(editedUser);
    } catch (error) {
      console.error("Error updating user data:", error);
      res.status(500).json({ message: "Error updating user data" });
    }
  },
  addPatient: async (req: Request, res: Response) => {
    try {
      const { name, relationToUser, age, gender, contactNumber, userId } =
        req.body;
      const patientData = {
        name,
        relationToUser,
        age,
        gender,
        contactNumber,
        userId,
      };
      const addedPatient = await userInteractor.addPatient(patientData, userId);
      res.status(201).json(addedPatient);
    } catch (error) {
      console.error("Error adding patient data:", error);
      res.status(500).json({ message: "Failed to add patient", error });
    }
  },
  getFamilyData: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json({ message: "id not foundss" });
      }
      const familyData = await userInteractor.getFamilyData(id);
      res.status(200).json(familyData);
    } catch (error) {
      console.error("Error fetching family data:", error);
      res.status(500).json({ message: "Error fetching family data", error });
    }
  },

  updateCart: async (req: Request, res: Response) => {
    const { id } = req.params; // Ensure `id` is being passed correctly (userId)
    const { services }: { services: IServiceUpdate[] } = req.body;
    try {
      // Fetch the cart by userId
      const cart = await Cart.findOne({ userId: id });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      services.forEach((serviceUpdate: IServiceUpdate) => {
        const { serviceId, personIds } = serviceUpdate;

        if (!personIds || personIds.length === 0) {
          return res
            .status(400)
            .json({ message: "No person IDs found for service" });
        }
        cart.services.forEach((cartService) => {
          if (cartService.serviceId.toString() === serviceId.toString()) {
            cartService.personIds = personIds.map((personId) => ({
              _id: personId, // Assign the ObjectId
              model: personId.toString() === id ? "User" : "Patient", // Check if the personId belongs to the User
            }));
          }
        });
      });
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      console.error("Error updating cart data:", error);
      res.status(500).json({ message: "Error updating cart data", error });
    }
  },

  booking: async (req: Request, res: Response) => {
    const {
      sessionId,
      userId,
      appointmentDate,
      services,
      amount,
      appointmentTimeSlot,
    } = req.body;
    try {
      const existingBooking = await BookingModel.findOne({
        stripe_session_id: sessionId,
      });
      if (existingBooking) {
        return res.status(400).json({ error: "Booking already confirmed." });
      }
      // Call the interactor to handle the booking logic
      const bookingResult = await userInteractor.confirmBooking({
        stripe_session_id: sessionId,
        user_id: userId,
        booking_date: appointmentDate,
        services: services,
        total_amount: amount,
        booking_time_slot: appointmentTimeSlot, // Pass booking time slot
      });
      return res.status(201).json(bookingResult);
    } catch (error) {
      console.error("Error confirming booking:", error);
      return res.status(500).json({ error: "Failed to confirm booking" });
    }
  },
  getBookingList: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const bookingList = await userInteractor.getBookingList(id);
      res.status(200).json(bookingList);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      return res.status(500).json({ error: "Failed to fetch booking list" });
    }
  },
  getBookingDetail: async (req: Request, res: Response) => {
    try {
      const { id } = req.params; // Extract the booking ID from the request params
      const booking = await userInteractor.getBookingById(id); // Pass the ID to the interactor to fetch details
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.status(200).json(booking); // Return booking details in the response
    } catch (error) {
      console.error("Error fetching booking details:", error);
      return res
        .status(500)
        .json({ message: "Failed to fetch booking details" });
    }
  },
  clearCart: async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      await userInteractor.clearCart(userId);
      res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Error clearing cart" });
    }
  },
  cancelBooking: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const cancelledBooking = await userInteractor.cancelBooking(id);
      if (!cancelledBooking) {
        return res.status(404).json({ error: "Booking not found or already cancelled" });
      }
      res.status(200).json({ message: "Booking successfully cancelled", booking: cancelledBooking });
    } catch (error) {
      console.error("Error in cancelBooking controller:", error);
      res.status(500).json({ error: "Failed to cancel booking" });
    }
  },
  getCategory: async (req: Request, res: Response) => {
    try {
      const categories = await userInteractor.getCategories();
      if (!categories) {
        return res.status(404).json({ message: "No categories found" });
      }
      res.status(200).json({ categories });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  reportList: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const reportList = await userInteractor.reportList(id);
      res.status(200).json(reportList);
    } catch (error) {
      console.error("Error in reportList controller:", error);
      res.status(500).json({ message: "Failed to fetch report list" });
    }
  }



};
