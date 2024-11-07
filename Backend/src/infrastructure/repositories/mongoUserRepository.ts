/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser } from "../../domain/entities/types/userType";
import { Encrypt } from "../../domain/helper/hashPassword";
import { Category } from "../database/dbModel/categoryModel";
import OTPModel from "../database/dbModel/otpModel";
import cartModel from "../database/dbModel/cartModel";
import { Service } from "../database/dbModel/serviceModel";
import { Users } from "../database/dbModel/userModel";
import mongoose, { Types } from "mongoose";
import Cart from "../database/dbModel/cartModel";
import BookingModel from "../database/dbModel/bookingModel";
import Patient from "../database/dbModel/patientModel";
import { IPatientInput } from "../../domain/entities/types/patientType";
import reportModel from "../database/dbModel/reportModel";
interface Service {
  serviceId: string;
  personIds: string[];
}

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

  // Fetch cart data and populate both serviceId and personIds
  const cartData = await Cart.findOne({ userId })
    .populate("services.serviceId") // Populate service details
    .populate("services.personIds"); // Populate user/patient details for personIds
  if (!cartData) {
    console.error("Cart not found");
    throw new Error("Cart not found");
  }
  return cartData;
};
export const userUpdatedCartInDb = async (id: string) => {
  const userId = id;

  // Fetch cart data and populate both serviceId and personIds
  const cartData = await Cart.findOne({ userId })
    .populate("services.serviceId")
    .populate("services.personIds")
    .exec();

  if (!cartData) {
    console.error("Cart not found");
    throw new Error("Cart not found");
  }

  // Collect all patient data
  let patientData: IPatientInput[] = [];

  // Use for...of loop to handle async/await properly
  for (const service of cartData.services) {
    const patientIds = service.personIds
      ?.filter((person) => person.model === "Patient") // Filter only patients
      .map((person) => person._id.toString()); // Map to get the _id
    // Fetch patient data based on the IDs
    if (patientIds && patientIds.length > 0) {
      const patients = await Patient.find({ _id: { $in: patientIds } })
        .select("name age contactNumber relationToUser") // Select necessary fields
        .exec();

      // Merge fetched patient data into the patientData array
      patientData = [...patientData, ...patients];
    }
  }
  return {
    cart: cartData,
    patients: patientData,
  };
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

// export const bookAppointment = async (
//   userId: string,
//   services: { _id: string }[],
//   appointmentDate: Date,
//   totalAmount: number,
//   status: string,
//   sessionId: string,
//   appointmentTimeSlot: string
// ) => {
//   try {
//     console.log(
//       userId,
//       services,
//       appointmentDate,
//       totalAmount,
//       status,
//       sessionId,
//       appointmentTimeSlot
//     );
//     const serviceIds = services.map(
//       (service) => new mongoose.Types.ObjectId(service._id)
//     );

//     const newBooking = new BookingModel({
//       user_id: new mongoose.Types.ObjectId(userId),
//       service_id: serviceIds,
//       booking_date: new Date(appointmentDate),
//       booking_time_slot: appointmentTimeSlot,
//       total_amount: totalAmount,
//       status,
//       stripe_session_id: sessionId,
//     });

//     // Save the booking to the database
//     const booked = await newBooking.save();
//     console.log("Booking saved successfully:", booked);
//     return booked;
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error("Error saving booking:", error.message);
//       throw new Error("Failed to book appointment");
//     } else {
//       console.error("Unexpected error:", error);
//       throw new Error("An unexpected error occurred");
//     }
//   }
// };

export const editUserInDb = async (id: string, fieldToChange: object) => {
  try {
    const editedUser = await Users.findByIdAndUpdate(
      id,
      { $set: fieldToChange },
      { new: true }
    );
    return editedUser;
  } catch (error) {
    console.error("Error updating user in the database:", error);

    throw new Error("Error updating user in the database");
  }
};

export const addPatientInDb = async (
  patientData: IPatientInput,
  userId: string
) => {
  try {
    const newPatient = new Patient({ ...patientData, userId });
    const addedPatient = await newPatient.save();
    return addedPatient;
  } catch (error) {
    console.error("Error saving patient to database:", error);
    throw new Error("Error saving patient to database");
  }
};
export const getFamilyDataInDb = async (id: string) => {
  try {
    const familyData = await Patient.find({ userId: id });
    return familyData;
  } catch (error) {
    console.error("Error fetching patient from database:", error);
    throw new Error("Error fetching patient from database");
  }
};
export const saveBooking = async ({
  stripe_session_id,
  user_id,
  booking_date,
  services,
  total_amount,
  booking_time_slot,
}: {
  stripe_session_id: string;
  user_id: string;
  booking_date: Date;
  services: {
    service_id: mongoose.Types.ObjectId;
    persons: mongoose.Types.ObjectId[];
  }[];
  total_amount: number;
  booking_time_slot: string;
}): Promise<unknown> => {
  try {
    const newBooking = new BookingModel({
      stripe_session_id,
      user_id: new mongoose.Types.ObjectId(user_id),
      booking_date,
      services,
      total_amount,
      status: "confirmed",
      booking_time_slot,
    });

    // Save the booking to the database
    const savedBooking = await newBooking.save();
    return savedBooking;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error saving booking: ${error.message}`);
    }
    throw error;
  }
};

export const BookingListInDb = async (id: string) => {
  try {
    // Find all bookings for the given user ID and populate relevant fields
    const bookings = await BookingModel.find({ user_id: id })
      .populate("user_id") // Populate user details
      .populate("services.service_id") // Populate service details
      .populate("services.persons") // Populate patient details
      .sort({ createdAt: -1 });
    return bookings;
  } catch (error) {
    console.error("Error fetching bookings from DB:", error);
    throw error;
  }
};
export const findBookingById = async (id: string) => {
  try {
    // Step 1: Find booking and apply lean() to avoid Mongoose document structure
    const booking = await BookingModel.findById(id)
      .populate("user_id", "name email") // Populate user details
      .populate("services.service_id", "name price") // Populate service details
      .lean();

    if (!booking) throw new Error("Booking not found");

    // Step 2: Collect person IDs from each service
    const personIds: Types.ObjectId[] = booking.services.flatMap((service: any) => service.persons);

    // Step 3: Populate persons with User and Patient models separately
    const [users, patients] = await Promise.all([
      Users.find({ _id: { $in: personIds } }, "name age gender").lean(),
      Patient.find({ _id: { $in: personIds } }, "name relationToUser age gender").lean(),
    ]);

    // Step 4: Map the user and patient data by their IDs
    const userMap = new Map(users.map((user) => [user._id.toString(), { ...user, relationToUser: "Self" }]));
    const patientMap = new Map(patients.map((patient) => [patient._id.toString(), patient]));

    // Step 5: Replace ObjectIds in `persons` with populated data
    booking.services.forEach((service: any) => {
      service.persons = service.persons.map((personId: Types.ObjectId) => {
        const idStr = personId.toString();
        return userMap.get(idStr) || patientMap.get(idStr) || { _id: personId, name: "Unknown" };
      });
    });
    return booking;
  } catch (error) {
    console.error("Error in findBookingById:", error);
    throw new Error("Error fetching booking from DB");
  }
};

export const clearCartInDb = async (userId: string) => {
  try {
    // Find the cart by userId and remove all services (clear the cart)
    await Cart.updateOne(
      { userId: userId }, // Find the cart by the user ID
      { $set: { services: [] } } // Set the services array to an empty array (clearing the cart)
    );
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw new Error("Error clearing the cart");
  }
};
export const cancelBookingInDb = async (id: string) => {
  try {
    const cancelledBooking = await BookingModel.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true }
    );
    return cancelledBooking;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw new Error("Failed to cancel booking");
  }
};

export const getCategories = async () => {
  try {
    const categoryList = await Category.find();
    return categoryList;
  } catch (error) {
    console.error("Error fetching categories from database:", error);
    throw error; // Re-throw to be handled by calling functions
  }
};

export const reportListInDb = async (bookingId: string): Promise<any[]> => {
  try {
    // Convert bookingId to ObjectId if it's a valid string
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new Error("Invalid booking ID format");
    }
    const objectId = new mongoose.Types.ObjectId(bookingId);

    // Query reports for specific bookingId and published status
    const reports = await reportModel.find({
      bookingId: objectId, 
      published: true,
    });

    if (reports.length === 0) {
      console.log(`No reports found for booking ID ${bookingId} with published status.`);
    } else {
      console.log("Reports fetched:", reports);
    }

    return reports;
  } catch (error) {
    console.error("Error fetching reports from database:", error);
    throw new Error("Failed to retrieve reports");
  }
};



