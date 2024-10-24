import { Request, Response } from "express";
import adminInteractor from "../../domain/useCases/auth/adminInteractor";
import {
  categoryCount,
  departmentCount,
  userCount,
} from "../../infrastructure/repositories/mongoAdminRepository";

export default {
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

  getUsers: async (req: Request, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const users = await adminInteractor.getUsers(Number(page), Number(limit));
      res.status(200).json(users);
    } catch (error: unknown) {
      console.error("Error fetching users:", error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  },
  getCategories: async (req: Request, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const categories = await adminInteractor.getCategories(
        Number(page),
        Number(limit)
      );
      // console.log(categories);
      res.status(200).json(categories);
    } catch (error: unknown) {
      console.error("Error fetching categories:", error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  },

  blockUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const { is_blocked } = req.body;
      const updatedUser = await adminInteractor.updatedUserStatus(
        userId,
        is_blocked
      );
      res.status(200).json(updatedUser);
    } catch (error: unknown) {
      // Use `unknown` type for error handling
      if (error instanceof Error) {
        console.error(error.message); // Safely access `message` only if it's an instance of `Error`
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  },
  addDepartment: async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Department name is required" });
      }
      const departmentData = {
        departmentName: name,
        departmentDescription: description,
      };
      await adminInteractor.addDepartment(departmentData);
      res.status(200).json({ message: "Department Added Successfully" });
    } catch (error: unknown) {
      console.error("Error adding department:", error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  },

  departmentList: async (req: Request, res: Response) => {
    try {
      const departments = await adminInteractor.getDepartments();
      res.status(200).json(departments);
    } catch (error: unknown) {
      console.error("Error fetching department:", error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  },

  editDepartment: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      if (!id) {
        return res.status(400).json({ error: "Department ID is required" });
      }
      if (!name) {
        return res.status(400).json({ error: "Department name is required" });
      }
      const departmentData = { name, description };
      const updatedDepartment = await adminInteractor.editDepartment(
        id as string,
        departmentData
      );
      return res.status(200).json({
        message: "Department updated successfully",
        department: updatedDepartment,
      });
    } catch (error) {
      console.error("Error editing department:", error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  },
  deleteDepartment: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Department ID is required" });
      }
      // Call the interactor to handle the business logic and perform the delete
      const deletedDepartment = await adminInteractor.deleteDepartment(
        id as string
      );
      if (!deletedDepartment) {
        return res.status(404).json({ error: "Department not found" });
      }
      return res
        .status(200)
        .json({ message: "Department deleted successfully", id });
    } catch (error) {
      console.error("Error deleting department:", error);

      // Handle error and send appropriate response
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  },

  addCategory: async (req: Request, res: Response) => {
    try {
      const { name, department } = req.body;
      // Validate the input data
      if (!name || !department) {
        return res
          .status(400)
          .json({ error: "Category name and department are required" });
      }

      // Prepare the category data object
      const newCategoryData = { name, department };

      // Call the interactor layer to handle business logic
      const category = await adminInteractor.addCategory(newCategoryData);

      // Send success response
      return res
        .status(201)
        .json({ message: "Category added successfully", category });
    } catch (error: unknown) {
      console.error("Error adding category:", error);

      // Error handling
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      } else {
        return res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  },

  // Update Category
  editCategory: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, department } = req.body;
      if (!id) {
        return res.status(400).json({ error: "Category ID is required" });
      }
      if (!name || !department) {
        return res
          .status(400)
          .json({ error: "Category name and department are required" });
      }

      const updatedCategory = await adminInteractor.updateCategory(id, {
        name,
        department,
      });

      res
        .status(200)
        .json({ message: "Category updated successfully", updatedCategory });
    } catch (error: unknown) {
      console.error("Error updating category:", error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  },

  // Delete Category
  deleteCategory: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Category ID is required" });
      }
      await adminInteractor.deleteCategory(id);
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error: unknown) {
      console.error("Error deleting category:", error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  },

  getUserCount: async (req: Request, res: Response) => {
    try {
      const userCounts = await userCount();
      res.json(userCounts);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  },
  getDepartmentCount: async (req: Request, res: Response) => {
    try {
      const departmentCounts = await departmentCount();
      res.json(departmentCounts);
    } catch (error) {
      console.error("Failed to fetch department Count", error);
      res.status(500).json({ message: "Failed to fetch department Count" });
    }
  },
  getCategoryCount: async (req: Request, res: Response) => {
    try {
      const categoryCounts = await categoryCount();
      res.json(categoryCounts);
    } catch (error) {
      console.error("Failed to fetch department Count", error);
      res.status(500).json({ message: "Failed to fetch department Count" });
    }
  },
  addService: async (req: Request, res: Response) => {
    try {
      const {
        name,
        price,
        category,
        preTestPreparations,
        expectedResultDuration,
        description,
      } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const serviceImage = files?.serviceImage?.[0];

      if (!serviceImage) {
        console.error("Service Image is missing.");
        return res
          .status(400)
          .json({ message: "License document is required" });
      }
      const serviceData = {
        name,
        price,
        category,
        preTestPreparations,
        expectedResultDuration,
        description,
        serviceImage,
      };
      const result = await adminInteractor.addServiceData(serviceData);
      res.status(200).json({ message: "Service added successfully", result });
    } catch (error) {
      console.error("Failed to add service", error);
      res.status(500).json({ message: "Failed to add service" });
    }
  },

  editService: async (req: Request, res: Response) => {
    try {
      const { id } = req.params; // Get the service ID from the URL parameters
      const {
        name,
        price,
        category,
        preTestPreparations,
        expectedResultDuration,
        description,
      } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const serviceImage = files?.serviceImage?.[0];
      // Prepare service data, omit serviceImage if not provided
      const serviceData = {
        name,
        price,
        category,
        preTestPreparations,
        expectedResultDuration,
        description,
        ...(serviceImage && { serviceImage }), // Add only if image is provided
      };
      const result = await adminInteractor.editServiceData(id, serviceData);
      res.status(200).json({ message: "Service edited successfully", result });
    } catch (error) {
      console.error("Failed to edit service", error);
      res.status(500).json({ message: "Failed to edit service" });
    }
  },

  getServices: async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const serviceList = await adminInteractor.getServiceList(
        Number(page),
        Number(limit)
      );

      res.status(200).json(serviceList);
    } catch (error) {
      console.error("Failed to retrieve services", error);
      res.status(500).json({ message: "Failed to retrieve services" });
    }
  },
  toggleService:async(req:Request,res:Response)=>{
    try {
      const {id} = req.params;
      const toggled = adminInteractor.toggleService(id)
      res.status(200).json(toggled)
    } catch (error) {
      console.error("Failed to toggle services", error);
      res.status(500).json({ message: "Failed to toggle services" });
    }
  }
};
