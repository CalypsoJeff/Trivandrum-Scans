/* eslint-disable @typescript-eslint/no-explicit-any */
// import { ICategory, PaginatedCategories } from "../../domain/entities/types/categoryType";
import { Types } from "mongoose";
import {
  ICategory,
} from "../../domain/entities/types/categoryType";
import { IServiceResponse } from "../../domain/entities/types/serviceType";
import { IUser, PaginatedUsers } from "../../domain/entities/types/userType";
import { Admin } from "../database/dbModel/adminModel";
import BookingModel from "../database/dbModel/bookingModel";
import { Category } from "../database/dbModel/categoryModel";
import { Department, IDepartment } from "../database/dbModel/departmentModel";
import { Service } from "../database/dbModel/serviceModel";
import { Users } from "../database/dbModel/userModel";
import Patient from "../database/dbModel/patientModel";
import reportModel from "../database/dbModel/reportModel";
import { sendReportPublishedEmail } from "../../utils/emailUtils";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IBooking } from "../../domain/entities/types/bookingType";
import Message from "../database/dbModel/messageModel";
// import mongoose from "mongoose";

// Find Admin by Email
export const findAdmin = async (email: string) => {
  return await Admin.findOne({ email });
};

// Get All Users
export const getAllUsers = async () => {
  try {
    return await Users.find();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred while fetching all users.");
  }
};

// Get Paginated Users with proper typing
export const getPaginatedUsers = async (
  page: number,
  limit: number
): Promise<PaginatedUsers> => {
  try {
    const users = await Users.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const totalUsers = await Users.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    return {
      users,
      totalPages,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(
      "An unknown error occurred while fetching paginated users."
    );
  }
};
export const getAllDepartments = async () => {
  try {
    return await Department.find();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(
      "An unknown error occurred while fetching all departments."
    );
  }
};

export const updateDepartment = async (
  id: string,
  updatedData: { name: string; description?: string }
): Promise<IDepartment | null> => {
  try {
    // Validate that the ID is provided
    if (!id) {
      throw new Error("Department ID is required");
    }

    // Find the department by ID and update it with the provided data (name, description)
    const updatedDepartment = await Department.findByIdAndUpdate(
      id, // The department ID to update
      { ...updatedData }, // The new data (name and description)
      { new: true, runValidators: true } // Return the updated document and validate input
    );

    // Return the updated department or null if not found
    return updatedDepartment;
  } catch (error) {
    console.error("Error updating department:", error);
    throw new Error("Could not update department");
  }
};
export const deleteDepartment = async (id: string) => {
  try {
    if (!id) {
      throw new Error("Department ID is required");
    }
    // Delete the department by ID and return the deleted department data
    const deletedDepartment = await Department.findByIdAndDelete(id);
    return deletedDepartment; // Returns null if the department is not found
  } catch (error) {
    console.error("Error deleting department:", error);
    throw new Error("Could not delete department");
  }
};

export const getPaginatedCategories = async (
) => {
  try {
    const categories = await Category.find()
      .populate("department")
      .lean()
      .exec();

    // Map over categories to explicitly cast _id to string
    const mappedCategories: ICategory[] = categories.map((category) => ({
      ...category,
      _id: category._id.toString(), // Convert _id to string
    }));

    return {
      categories: mappedCategories,
    };
  } catch (error) {
    console.error("Error fetching paginated categories:", error);
    throw new Error("Error fetching paginated categories");
  }
};

// Update User Status (Block/Unblock)
export const updateUserStatus = async (
  userId: string,
  isBlocked: boolean
): Promise<IUser | null> => {
  try {
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      { is_blocked: isBlocked },
      { new: true }
    );
    return updatedUser;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred while updating user status.");
    }
  }
};

// Database Interaction Layer for Adding a New Category
export const addCategoryToDB = async (categoryData: {
  name: string;
  department: string;
}): Promise<ICategory> => {
  try {
    // Create a new Category instance
    const newCategory = new Category({
      name: categoryData.name,
      department: categoryData.department,
    });
    // Save the new category to the database
    const savedCategory = await newCategory.save();
    const populatedCategory = await Category.findById(savedCategory._id).populate("department");
    if (!populatedCategory) {
      throw new Error("Failed to populate the newly created category.");
    }
    // Return the saved category as an object
    return populatedCategory.toObject() as ICategory;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred while adding a new category.");
    }
  }
};

// Update Category
export const updateCategoryInDB = async (
  categoryId: string,
  updateData: {
    name: string;
    department: string;
  }
): Promise<ICategory | null> => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      {
        name: updateData.name,
        department: updateData.department,
      },
      { new: true }
    ).populate("department");
    return updatedCategory ? (updatedCategory.toObject() as ICategory) : null; // Explicitly cast the result to ICategory
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred while updating the category.");
    }
  }
};

// Delete Category
export const deleteCategoryFromDB = async (
  categoryId: string
): Promise<void> => {
  try {
    await Category.findByIdAndDelete(categoryId);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred while deleting the category.");
    }
  }
};

export const userCount = async () => {
  const userCount = await Users.countDocuments();
  return userCount;
};
export const departmentCount = async () => {
  const departmentCount = await Department.countDocuments();
  return departmentCount;
};
export const categoryCount = async () => {
  const categoryCounts = await Category.countDocuments();
  return categoryCounts;
};

export const saveService = async (completeServiceData: IServiceResponse) => {
  const service = new Service(completeServiceData);
  return await service.save();
};

export const updateService = async (
  id: string,
  completeServiceData: IServiceResponse
) => {
  try {
    // Find the service by its ID
    const existingService = await Service.findById(id);
    if (!existingService) {
      throw new Error("Service not found");
    }
    // Update the service fields
    Object.assign(existingService, completeServiceData);
    // Save the updated service
    const updatedService = await existingService.save();

    return updatedService;
  } catch (error) {
    console.error("Error updating service:", error);
    throw new Error("Failed to update service");
  }
};

export const getAllServicesWithCategoryDetails = async () => {
  try {
    // Fetch all services
    const services = await Service.find().lean();

    // Fetch category details for each service
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
    };
  } catch (error) {
    console.error("Error fetching all services:", error);
    throw new Error("Error fetching all services");
  }
};

export const toggleServiceByID = async (id: string) => {
  try {
    const service = await Service.findById(id);
    if (!service) {
      throw new Error("Service not found");
    }
    // Toggle the availability status
    service.isAvailable = !service.isAvailable;
    return await service.save();
  } catch (error) {
    console.error("Error toggling services:", error);
    throw new Error("Error toggling services");
  }
};
export const getBookingsFromDb = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

    const bookings = await BookingModel.find()
      .populate("user_id")
      .populate("services.service_id")
      .sort({ booking_date: -1 })  // Sort by booking_date in descending order
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const totalBookings = await BookingModel.countDocuments();

    return { bookings, totalBookings };
  } catch (error) {
    console.error("Error fetching bookings from DB:", error);
    throw error;
  }
};

export const bookingDetailsInDb = async (id: string) => {
  try {
    // Fetch the booking without populating `persons`
    const booking = await BookingModel.findById(id)
      .populate("user_id") // Populating user details
      .populate("services.service_id") // Populating service details
      .lean(); // Convert to plain JS object

    if (!booking) throw new Error("Booking not found");

    // Collect person IDs from each service
    const personIds: Types.ObjectId[] = booking.services.flatMap(
      (service: any) => service.persons
    );

    // Fetch both users and patients by IDs
    const [users, patients] = await Promise.all([
      Users.find({ _id: { $in: personIds } }, "name age gender contactNumber").lean(),
      Patient.find(
        { _id: { $in: personIds } },
        "name relationToUser age gender contactNumber"
      ).lean(),
    ]);

    // Map users and patients by their IDs
    const userMap = new Map(
      users.map((user) => [user._id.toString(), { ...user, relationToUser: "Self" }])
    );
    const patientMap = new Map(
      patients.map((patient) => [patient._id.toString(), patient])
    );

    // Replace ObjectIds in `persons` with populated data
    booking.services.forEach((service: any) => {
      service.persons = service.persons.map((personId: Types.ObjectId) => {
        const idStr = personId.toString();
        // Return populated User or Patient, or fallback with basic details
        return (
          userMap.get(idStr) ||
          patientMap.get(idStr) || {
            _id: personId,
            name: "Unknown",
            relationToUser: "N/A",
          }
        );
      });
    });

    return booking;
  } catch (error) {
    console.error("Error fetching booking from DB:", error);
    throw new Error("Error fetching booking from DB");
  }
};
export const updateServiceBookinginDb = async (bookingId: string, serviceId: string, completed: boolean) => {
  try {
    const updatedBooking = await BookingModel.findOneAndUpdate(
      { _id: bookingId, "services.service_id": serviceId },  // Match booking and service
      { $set: { "services.$.completed": completed } },       // Use positional operator to set completion
      { new: true }                                          // Return updated document
    );

    return updatedBooking;
  } catch (error) {
    console.error("Database error updating service completion status:", error);
    throw new Error("Database error updating service completion status");
  }
};


export const getCompletedBookings = async () => {
  try {
    const bookings = await BookingModel.find({
      // Find bookings where every service has `completed: true`
      services: { $all: [{ $elemMatch: { completed: true } }] }
    })
      .populate('user_id')
      .populate('services.service_id')
      .populate('services.persons');

    console.log(bookings, "Filtered bookings with all services completed");

    return bookings;
  } catch (error) {
    console.error("Error fetching completed bookings:", error);
    throw error; // Propagate error for handling
  }
};

export const saveReport = async (reportData: any) => {
  const report = new reportModel(reportData);
  return await report.save();
};
export const getReportsFromDb = async () => {
  try {
    // Fetch reports and populate booking and user data
    const reportList = await reportModel
      .find()
      .populate("bookingId", "user_id booking_date")
      .populate({
        path: "bookingId",
        populate: { path: "user_id", select: "name" },
      }).sort({ uploadedAt: -1 });
    return reportList;
  } catch (error) {
    console.error("Error fetching reports from database:", error);
    throw error;
  }
};
export const updateReportInDb = async (reportId: string, updatedData: any) => {
  return await reportModel.findByIdAndUpdate(reportId, updatedData, { new: true });
};
// export const publishReportInDb = async (reportId:string) => {
//   return await reportModel.findByIdAndUpdate(
//     reportId,
//     { published: true },
//     { new: true } 
//   );
// };

// Function to publish report in the database and send an email notification
export const publishReportInDb = async (reportId: string): Promise<any> => {
  try {
    const updatedReport = await reportModel.findByIdAndUpdate(
      reportId,
      { published: true },
      { new: true }
    ).populate({
      path: "bookingId",
      populate: { path: "user_id", select: "email name" },
    });

    if (!updatedReport) {
      throw new Error("Report not found");
    }

    const booking = updatedReport.bookingId;
    if (!booking || !("user_id" in booking)) {
      throw new Error("Booking data not populated correctly.");
    }

    const user = booking.user_id as { email: string; name: string };
    if (!user.email || !user.name) {
      throw new Error("User data is not populated correctly.");
    }

    // Retrieve the first PDF URL from the reports array
    const reportFile = updatedReport.reports?.[0]; // You could also select a specific report if needed
    if (!reportFile || !reportFile.url) {
      throw new Error("No report file URL found in the reports array.");
    }

    const downloadLink = reportFile.url;

    // Send email with the actual S3 download link
    await sendReportPublishedEmail(user.email, reportId, user.name, downloadLink);
    console.log("Report published and email with download link sent to user.");

    return updatedReport;
  } catch (error) {
    console.error("Failed to publish report and send email:", error);
    throw error;
  }
};

export const successMessagetoUser = async (chatId: string, content: string) => {
  console.log(chatId, content, 'yesssssssss');

  return await Message.create({
    chat: chatId,
    sender: '66ee588d1e1448fbea1f40bb',
    senderModel: "Admin",
    content,
    createdAt: new Date(),
  });
}





