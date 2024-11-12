import { Department } from "../../../infrastructure/database/dbModel/departmentModel";
import {
  addCategoryToDB,
  bookingDetailsInDb,
  deleteCategoryFromDB,
  findAdmin,
  getAllDepartments,
  getAllUsers,
  getBookingsFromDb,
  getCompletedBookings,
  getPaginatedCategories,
  getPaginatedServicesWithCategoryDetails,
  getPaginatedUsers,
  getReportsFromDb,
  publishReportInDb,
  saveReport,
  saveService,
  successMessagetoUser,
  toggleServiceByID,
  updateCategoryInDB,
  updateDepartment,
  updateReportInDb,
  updateService,
  updateServiceBookinginDb,
  updateUserStatus,
} from "../../../infrastructure/repositories/mongoAdminRepository";
import { uploadToS3 } from "../../../utils/s3Uploader";
import { io } from '../../../server';
import // ICategory,
  // PaginatedCategories,
  "../../entities/types/categoryType";
import {
  ICategory,
  PaginatedCategories,
} from "../../entities/types/categoryType";
import { IDepartment } from "../../entities/types/departmentType";
import {
  IServiceRequest,
  IServiceResponse,
} from "../../entities/types/serviceType";
import { IUser, PaginatedUsers } from "../../entities/types/userType";
import { Encrypt } from "../../helper/hashPassword";
import { generateToken } from "../../helper/jwtHelper";

export default {
  loginAdmin: async (cred: { email: string; password: string }) => {
    try {
      const admin = await findAdmin(cred.email);
      if (!admin || !admin.password) {
        throw new Error("Admin not found or password is missing");
      }
      const isValid = await Encrypt.comparePassword(
        cred.password,
        admin.password
      );
      if (!isValid) {
        throw new Error("Invalid password");
      }
      const role = "admin";
      const tokenData = await generateToken(admin.id, cred.email, role);
      return {
        admin,
        token: tokenData.token,
        refreshToken: tokenData.refreshToken,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
        throw error;
      } else {
        console.error("An unknown error occurred");
        throw new Error("An unknown error occurred");
      }
    }
  },

  userList: async () => {
    try {
      const users = await getAllUsers();
      return users;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
        throw error;
      }
      throw new Error("An unknown error occurred while fetching user list");
    }
  },

  getUsers: async (page: number, limit: number): Promise<PaginatedUsers> => {
    try {
      const users = await getPaginatedUsers(page, limit);
      return users;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(
        "An unknown error occurred while fetching paginated users"
      );
    }
  },
  getCategories: async (
    page: number,
    limit: number
  ): Promise<PaginatedCategories> => {
    try {
      // Call the function to fetch paginated categories
      const categories = await getPaginatedCategories(page, limit);
      return categories;
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Log and rethrow the error if known
        console.error(`Error: ${error.message}`);
        throw new Error(error.message);
      }
      // Handle unexpected errors
      throw new Error(
        "An unknown error occurred while fetching paginated categories"
      );
    }
  },

  updatedUserStatus: async (
    userId: string,
    is_blocked: boolean
  ): Promise<IUser | null> => {
    try {
      const updatedUser = await updateUserStatus(userId, is_blocked);
      return updatedUser;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(
          "An unknown error occurred while updating user status in userInteractor."
        );
      }
    }
  },

  addDepartment: async (departmentData: {
    departmentName: string;
    departmentDescription?: string;
  }): Promise<IDepartment> => {
    try {
      const newDepartment = new Department({
        name: departmentData.departmentName,
        description: departmentData.departmentDescription || "",
      });
      const savedDepartment = await newDepartment.save();
      return savedDepartment;
    } catch (error) {
      console.error("Error adding department:", error);
      throw new Error("Could not add department");
    }
  },
  getDepartments: async () => {
    try {
      const users = await getAllDepartments();
      return users;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(
        "An unknown error occurred while fetching paginated users"
      );
    }
  },
  editDepartment: async (
    id: string,
    departmentData: { name: string; description?: string }
  ): Promise<IDepartment | null> => {
    // Call the repository to update the department
    const updatedDepartment = await updateDepartment(id, departmentData);

    // Handle if the department is not found
    if (!updatedDepartment) {
      throw new Error("Department not found or could not be updated");
    }

    return updatedDepartment;
  },

  deleteDepartment: async (id: string) => {
    try {
      if (!id) {
        throw new Error("Department ID is required");
      }

      // Attempt to delete the department by ID
      const deletedDepartment = await Department.findByIdAndDelete(id);

      if (!deletedDepartment) {
        throw new Error("Department not found or could not be deleted");
      }

      return deletedDepartment; // Return the deleted department object
    } catch (error) {
      console.error("Error deleting department:", error);
      throw new Error("Could not delete department");
    }
  },
  // Interactor Layer for Adding a New Category
  addCategory: async (categoryData: {
    name: string;
    department: string;
  }): Promise<ICategory> => {
    try {
      // Validate category data
      if (!categoryData.name || !categoryData.department) {
        throw new Error("Category name and department are required");
      }

      // Call the function that interacts with the database
      const newCategory = await addCategoryToDB(categoryData);
      return newCategory;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred while adding the category.");
      }
    }
  },

  // Update Category
  updateCategory: async (
    categoryId: string,
    updateData: {
      name: string;
      department: string;
    }
  ) => {
    try {
      if (!updateData.name || !updateData.department) {
        throw new Error("Category name and department are required");
      }
      const updatedCategory = await updateCategoryInDB(categoryId, updateData);
      return updatedCategory;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(
          "An unknown error occurred while updating the category."
        );
      }
    }
  },

  // Delete Category
  deleteCategory: async (categoryId: string) => {
    try {
      await deleteCategoryFromDB(categoryId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(
          "An unknown error occurred while deleting the category."
        );
      }
    }
  },

  addServiceData: async (
    serviceData: IServiceRequest
  ): Promise<IServiceResponse> => {
    const {
      name,
      price,
      category,
      preTestPreparations,
      expectedResultDuration,
      description,
      serviceImage,
    } = serviceData;
    const serviceDataResult = await uploadToS3(serviceImage);
    const serviceImageUrl = serviceDataResult.Location;

    const completeServiceData = {
      name,
      price,
      category,
      preTestPreparations,
      expectedResultDuration,
      description,
      serviceImageUrl,
    };
    const savedService = await saveService(completeServiceData);
    return savedService;
  },

  // In the interactor
  editServiceData: async (
    id: string,
    serviceData: IServiceRequest
  ): Promise<IServiceResponse> => {
    try {
      let serviceImageUrl = null;

      // If a new service image was uploaded, upload it to S3
      if (serviceData.serviceImage) {
        const serviceDataResult = await uploadToS3(serviceData.serviceImage);
        serviceImageUrl = serviceDataResult.Location; // S3 image URL
      }

      // Build complete data to update, including new image URL if applicable
      const completeServiceData = {
        name: serviceData.name,
        price: serviceData.price,
        category: serviceData.category,
        preTestPreparations: serviceData.preTestPreparations,
        expectedResultDuration: serviceData.expectedResultDuration,
        description: serviceData.description,
        ...(serviceImageUrl && { serviceImageUrl }), // Add image URL only if it exists
      };

      // Call repository to update service by ID
      const updatedService = await updateService(id, completeServiceData);

      return updatedService;
    } catch (error) {
      console.error("Error in editing service:", error);
      throw new Error("Failed to edit service data");
    }
  },

  getServiceList: async (page: number, limit: number) => {
    try {
      const services = await getPaginatedServicesWithCategoryDetails(
        page,
        limit
      ); // Update to use the new function
      return services;
    } catch (error) {
      console.error("Error fetching service list:", error);
      throw new Error("Error fetching service list");
    }
  },
  toggleService: async (id: string) => {
    try {
      const toggleStatus = await toggleServiceByID(id);
      return toggleStatus;
    } catch (error) {
      console.error("Error toggling service :", error);
      throw new Error("Error toggling service");
    }
  },
  getBookingList: async (page = 1, limit = 10) => {
    // eslint-disable-next-line no-useless-catch
    try {
      return await getBookingsFromDb(page, limit);
    } catch (error) {
      throw error;
    }
  },
  fetchBookingDetails: async (id: string) => {
    try {
      const bookingDetails = await bookingDetailsInDb(id);
      return bookingDetails;
    } catch (error) {
      console.error("Error fetching booking details:", error);
      throw error;
    }
  },
  updateServiceBooking: async (bookingId: string, serviceId: string, completed: boolean) => {
    try {
      const updatedBooking = await updateServiceBookinginDb(bookingId, serviceId, completed);
      return updatedBooking;
    } catch (error) {
      console.error("Error in service booking update:", error);
      throw new Error("Error in service booking update");
    }
  },
  CompletedBooking: async () => {
    try {
      const completedBookings = await getCompletedBookings();
      return completedBookings;
    } catch (error) {
      console.error("Error in CompletedBooking:", error);
      throw error;
    }
  },
  addReportData: async ({ bookingId, reportFiles }: { bookingId: string; reportFiles: Express.Multer.File[] }) => {
    const reports = [];

    // Upload each file to S3 and collect its metadata
    for (const reportFile of reportFiles) {
      const reportData = await uploadToS3(reportFile);
      const reportUrl = reportData.Location;

      reports.push({
        filename: reportFile.originalname,
        mimetype: reportFile.mimetype,
        size: reportFile.size,
        url: reportUrl,
      });
    }

    // Prepare the complete report data for the database
    const completeReportData = {
      bookingId,
      reports,
    };

    // Save report data to the database
    const savedReport = await saveReport(completeReportData);
    return savedReport;
  },

  reportList: async () => {
    return await getReportsFromDb();
  },
  editReportData: async ({ editReportId, bookingId, reportFiles }: { editReportId: string; bookingId: string; reportFiles: Express.Multer.File[] }) => {
    const reports = [];

    // Upload each file and store details in the reports array
    for (const reportFile of reportFiles) {
      const reportData = await uploadToS3(reportFile);
      const reportUrl = reportData.Location;

      reports.push({
        filename: reportFile.originalname,
        mimetype: reportFile.mimetype,
        size: reportFile.size,
        url: reportUrl,
      });
    }

    // Prepare the updated data object
    const updatedReportData = {
      bookingId,
      reports,
    };

    // Update the report in the database
    const updatedReport = await updateReportInDb(editReportId, updatedReportData);
    return updatedReport;
  },
  publishReport: async (reportId: string) => {
    return await publishReportInDb(reportId);
  },
  successMessage:async(chatId:string,content:string)=>{
     // Save the message in the database
     const newMessage = await successMessagetoUser(chatId, content);

     // Emit the message to the specified chat room via Socket.IO
     io.to(chatId).emit("receiveMessage", newMessage);
 
     return newMessage;
  }
};
