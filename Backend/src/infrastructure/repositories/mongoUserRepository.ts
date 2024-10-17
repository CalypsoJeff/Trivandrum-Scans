import { IUser } from "../../domain/entities/types/userType";
import { Encrypt } from "../../domain/helper/hashPassword";
import { Category } from "../database/dbModel/categoryModel";
import OTPModel from "../database/dbModel/otpModel";
import cartModel from "../database/dbModel/cartModel";

import { Service } from "../database/dbModel/serviceModel";
import { Users } from "../database/dbModel/userModel";
import mongoose from "mongoose";
import Cart from "../database/dbModel/cartModel";
import BookingModel from "../database/dbModel/bookingModel";
// import BookingModel from "../database/dbModel/bookingModel";

export const checkExistingUser = async (email: string, name: string) => {
  const existingUser = await Users.findOne({
    $and: [{ email: email }, { name: name }],
  });
  return existingUser;
};

export const getUserbyEMail = async (email: string) => {
  return await Users.findOne({ email: email });
};

export const createUser = async (
  userData: IUser,
  hashedPassword: string
): Promise<IUser> => {
  console.log(`Saved User: ${userData}`);
  if (!userData.email || !userData.name) {
    throw new Error("Email and Name are required");
  }
  const email = userData.email as string;
  const name = userData.name as string;
  const existingUser = await checkExistingUser(email, name);
  if (existingUser) {
    if (existingUser.is_verified === false) {
      return existingUser;
    }
    throw new Error(`User already exist`);
  }
  if (!userData.name || !userData.email || !userData.password) {
    throw new Error("Name, Email, and Password are required fields");
  }
  const newUser = new Users({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
  });
  return await newUser.save();
};

export const verifyUserDb = async (email: string) => {
  const userData = await Users.findOneAndUpdate(
    { email: email },
    { $set: { is_verified: true } },
    { new: true }
  );
  return userData;
};

export const saveOtp = async (
  email: string,
  otp: string,
  generatedAt: number
) => {
  try {
    const otpForStore = new OTPModel({ otp, email, generatedAt });
    return await otpForStore.save();
  } catch (error) {
    console.error("Error saving OTP:", error);
    throw new Error("Error saving OTP");
  }
};

export const getStoredOTP = async (email: string) =>
  await OTPModel.findOne({ email: email }).sort({ createdAt: -1 }).limit(1);
// Function to handle Google User authentication and sign-up if user doesn't exist
export const googleUser = async (userData: IUser) => {
  try {
    if (!userData.email || !userData.name) {
      throw new Error("User data is incomplete");
    }

    // Check if the user already exists by email
    const existingUser = await Users.findOne({ email: userData.email });
    if (existingUser) {
      console.log("User already exists:", existingUser);
      return existingUser; // Return the existing user
    }

    // If user does not exist, create a new one
    const generatePass = Math.random().toString(36).slice(-8); // Generate a random password
    const hashedPassword = await Encrypt.cryptPassword(generatePass); // Hash the generated password

    const newUser = new Users({
      name: userData.name,
      email: userData.email,
      password: hashedPassword, // Save the hashed password
      is_google: true,
    });

    // Save the new user to the database
    return await newUser.save();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in googleUser:", error.message);
      throw error;
    } else {
      console.error("Unexpected error in googleUser:", error);
      throw new Error(
        "An unexpected error occurred during Google user authentication."
      );
    }
  }
};

export const resetPassword = async (email: string, token: string) => {
  const updatedData = await Users.updateOne(
    { email: email },
    { $set: { token: token } }
  );
  return updatedData;
};

export const getUserByResetToken = async (resetToken: string) => {
  try {
    // Find the user by reset token
    const user = await Users.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: new Date() },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by reset token:", error);
    throw new Error("Invalid or expired reset token");
  }
};

export const updateUserPassword = async (
  userId: string,
  hashedPassword: string
) => {
  try {
    // Find user by ID and update the password field
    const user = await Users.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true } // Return the updated user document
    );
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error updating password:", error);
    throw new Error("Error updating password");
  }
};
export const getService = async (id: string) => {
  try {
    const serviceData = await Service.findById(id).populate("category");
    return serviceData;
  } catch (error) {
    console.error("Error fetching service data from db", error);
    throw new Error("Error fetching service data from db");
  }
};
export const getPaginatedServices = async (page: number, limit: number) => {
  try {
    // Fetch services without population
    const services = await Service.find({ isAvailable: true })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    const totalServices = await Service.countDocuments();
    const totalPages = Math.ceil(totalServices / limit);

    // For each service, fetch category name and id using category ID
    const servicesWithCategoryDetails = await Promise.all(
      services.map(async (service) => {
        const category = await Category.findById(service.category, "_id name")
          .lean()
          .exec(); // Fetch both ID and name
        return {
          ...service,
          _id: service._id.toString(), // Convert service _id to string
          category: category
            ? {
                _id: category._id.toString(), // Convert category _id to string
                name: category.name,
              }
            : { _id: "Unknown", name: "Unknown" }, // Default if category not found
        };
      })
    );
    return {
      services: servicesWithCategoryDetails,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching paginated services:", error);
    throw new Error("Error fetching paginated services");
  }
};
export const addToCartInDb = async (userId: string, serviceId: string) => {
  try {
    const serviceObjectId = new mongoose.Types.ObjectId(serviceId);
    let cart = await cartModel.findOne({ userId });
    if (cart) {
      const serviceExists = cart.services.find(
        (service) => service.serviceId.equals(serviceObjectId) // Use equals method for ObjectId comparison
      );
      if (serviceExists) {
        return { success: false, message: "Service already in the cart" };
      } else {
        cart.services.push({ serviceId: serviceObjectId });
      }
    } else {
      cart = new cartModel({
        userId,
        services: [{ serviceId: serviceObjectId }],
      });
    }
    await cart.save();
    return { success: true, message: "Service added to cart" };
  } catch (error) {
    console.error("Error adding service to cart:", error);
    return { success: false, message: "Failed to add service to cart", error };
  }
};
export const userCartInDb = async (id: string) => {
  const userId = id;
  const cartData = await Cart.findOne({ userId }).populate(
    "services.serviceId"
  );
  if (!cartData) {
    console.error("cart not found");
    throw new Error("cart not found");
  }
  return cartData;
};
export const removeServiceFromCartinDb = async (
  userId: string,
  serviceId: string
) => {
  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: userId }, // Find cart by userId
      { $pull: { services: { serviceId: serviceId } } }, // Remove the service from services array
      { new: true } // Return the updated cart after removal
    ).populate("services.serviceId"); // Populate service details (optional)

    if (!updatedCart) {
      console.error("cart not found");
      throw new Error("cart not found");
    }
  } catch (error) {
    console.error("Error removing cart item:", error);
  }
};

export const bookAppointment = async (
  userId: string,
  services: { _id: string }[], // Array of services with `_id`
  appointmentDate: string,
  totalAmount: number,
  status: string, // "pending"
  sessionId: string // Stripe session ID
) => {
  try {
    console.log(
      userId,
      services,
      appointmentDate,
      totalAmount,
      status,
      sessionId
    );

    // Convert service IDs to Mongoose ObjectIds using 'new'
    const serviceIds = services.map(
      (service) => new mongoose.Types.ObjectId(service._id)
    );

    // Create a new booking entry in the database
    const newBooking = new BookingModel({
      user_id: new mongoose.Types.ObjectId(userId), // Ensure ObjectId for user
      service_id: serviceIds, // Ensure ObjectId array for services
      booking_date: new Date(appointmentDate), // Convert the date string into a Date object
      total_amount: totalAmount,
      status,
      stripe_session_id: sessionId,
    });

    // Save the booking to the database
    const booked = await newBooking.save();
    console.log("Booking saved successfully:", booked);
    return booked;
  } catch (error) {
    // Narrow the type of 'error' to 'Error'
    if (error instanceof Error) {
      console.error("Error saving booking:", error.message);
      throw new Error("Failed to book appointment");
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};
