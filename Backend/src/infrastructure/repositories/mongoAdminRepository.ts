// import { ICategory, PaginatedCategories } from "../../domain/entities/types/categoryType";
import {
  ICategory,
  PaginatedCategories,
} from "../../domain/entities/types/categoryType";
import { IServiceResponse } from "../../domain/entities/types/serviceType";
import { IUser, PaginatedUsers } from "../../domain/entities/types/userType";
import { Admin } from "../database/dbModel/adminModel";
import BookingModel from "../database/dbModel/bookingModel";
import { Category } from "../database/dbModel/categoryModel";
import { Department, IDepartment } from "../database/dbModel/departmentModel";
import { Service } from "../database/dbModel/serviceModel";
import { Users } from "../database/dbModel/userModel";
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
  page: number,
  limit: number
): Promise<PaginatedCategories> => {
  try {
    const categories = await Category.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("department")
      .lean()
      .exec();

    const totalCategories = await Category.countDocuments();
    const totalPages = Math.ceil(totalCategories / limit);

    // Map over categories to explicitly cast _id to string
    const mappedCategories: ICategory[] = categories.map((category) => ({
      ...category,
      _id: category._id.toString(), // Convert _id to string
    }));

    return {
      categories: mappedCategories,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching paginated categories:", error); // Log the error
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
      department: categoryData.department, // Ensure department is saved in the category
    });

    // Save the new category to the database
    const savedCategory = await newCategory.save();

    // Return the saved category as an object
    return savedCategory.toObject() as ICategory;
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
    );
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
    console.log(
      "reached hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
    );

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

// Get paginated services and populate category names
// Manually fetching category names based on category IDs
export const getPaginatedServicesWithCategoryDetails = async (
  page: number,
  limit: number
) => {
  try {
    // Fetch services without population
    const services = await Service.find()
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
    const booking = await BookingModel.findById(id)
      .populate("user_id") // Populating user details
      .populate("services.service_id") // Populating service details
      .populate("services.persons", "name relationToUser age gender contactNumber") // Populating patient details
      .lean(); // Using lean for better performance (optional)

    return booking;
  } catch (error) {
    console.error("Error fetching booking from DB:", error);
    throw error;
  }
};

