import { Request, Response } from "express";
import categoryInteractor from "../../domain/useCases/auth/categoryInteractor";


export default {

    // <-----------------------------##-USER--##//----------------------------------------------------->
    getCategory: async (req: Request, res: Response) => {
        try {
            const categories = await categoryInteractor.getCategoryList();
            if (!categories) {
                return res.status(404).json({ message: "No categories found" });
            }
            res.status(200).json({ categories });
        } catch (error) {
            console.error("Error fetching categories:", error);
            res.status(500).json({ message: "Server error" });
        }
    },


    // ##-ADMIN--##//

    addCategory: async (req: Request, res: Response) => {
        try {
            const { name, department } = req.body;
            if (!name || !department) {
                return res
                    .status(400)
                    .json({ error: "Category name and department are required" });
            }
            const newCategoryData = { name, department };
            const category = await categoryInteractor.addCategory(newCategoryData);
            return res
                .status(201)
                .json({ message: "Category added successfully", category });
        } catch (error: unknown) {
            console.error("Error adding category:", error);
            if (error instanceof Error) {
                return res.status(500).json({ error: error.message });
            } else {
                return res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    },
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
            const updatedCategory = await categoryInteractor.updateCategory(id, {
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
    deleteCategory: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: "Category ID is required" });
            }
            await categoryInteractor.deleteCategory(id);
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
    getCategoryCount: async (req: Request, res: Response) => {
        try {
            const categoryCounts = await categoryInteractor.countCategory();
            res.json(categoryCounts);
        } catch (error) {
            console.error("Failed to fetch department Count", error);
            res.status(500).json({ message: "Failed to fetch department Count" });
        }
    },
    getCategories: async (req: Request, res: Response): Promise<void> => {
        try {
            const categories = await categoryInteractor.getCategories(
            );
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
}