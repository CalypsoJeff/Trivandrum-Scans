"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categoryInteractor_1 = __importDefault(require("../../domain/useCases/auth/categoryInteractor"));
exports.default = {
    // <-----------------------------##-USER--##//----------------------------------------------------->
    getCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const categories = yield categoryInteractor_1.default.getCategoryList();
            if (!categories) {
                return res.status(404).json({ message: "No categories found" });
            }
            res.status(200).json({ categories });
        }
        catch (error) {
            console.error("Error fetching categories:", error);
            res.status(500).json({ message: "Server error" });
        }
    }),
    // ##-ADMIN--##//
    addCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, department } = req.body;
            if (!name || !department) {
                return res
                    .status(400)
                    .json({ error: "Category name and department are required" });
            }
            const newCategoryData = { name, department };
            const category = yield categoryInteractor_1.default.addCategory(newCategoryData);
            return res
                .status(201)
                .json({ message: "Category added successfully", category });
        }
        catch (error) {
            console.error("Error adding category:", error);
            if (error instanceof Error) {
                return res.status(500).json({ error: error.message });
            }
            else {
                return res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }),
    editCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            const updatedCategory = yield categoryInteractor_1.default.updateCategory(id, {
                name,
                department,
            });
            res
                .status(200)
                .json({ message: "Category updated successfully", updatedCategory });
        }
        catch (error) {
            console.error("Error updating category:", error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }),
    deleteCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: "Category ID is required" });
            }
            yield categoryInteractor_1.default.deleteCategory(id);
            res.status(200).json({ message: "Category deleted successfully" });
        }
        catch (error) {
            console.error("Error deleting category:", error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }),
    getCategoryCount: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const categoryCounts = yield categoryInteractor_1.default.countCategory();
            res.json(categoryCounts);
        }
        catch (error) {
            console.error("Failed to fetch department Count", error);
            res.status(500).json({ message: "Failed to fetch department Count" });
        }
    }),
    getCategories: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const categories = yield categoryInteractor_1.default.getCategories();
            res.status(200).json(categories);
        }
        catch (error) {
            console.error("Error fetching categories:", error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }),
};
