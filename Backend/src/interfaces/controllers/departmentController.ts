import { Request, Response } from "express";
import { departmentCount } from "../../infrastructure/repositories/mongoDepartmentRepository";
import departmentInteractor from "../../domain/useCases/auth/departmentInteractor";


export default {
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
            const Department = await departmentInteractor.addDepartment(departmentData);
            res.status(200).json({ message: "Department Added Successfully", Department });
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
            const departments = await departmentInteractor.getDepartments();
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
            const updatedDepartment = await departmentInteractor.editDepartment(
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
            const deletedDepartment = await departmentInteractor.deleteDepartment(
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
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
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
}