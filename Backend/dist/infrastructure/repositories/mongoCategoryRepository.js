"use strict";
// import { ICategory } from "../../domain/entities/types/categoryType";
// import { Category } from "../database/dbModel/categoryModel";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const categoryModel_1 = require("../database/dbModel/categoryModel");
class CategoryRepository {
    getPaginatedCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield categoryModel_1.Category.find()
                    .populate("department")
                    .lean()
                    .exec();
                const mappedCategories = categories.map((category) => (Object.assign(Object.assign({}, category), { _id: category._id.toString() })));
                return { categories: mappedCategories };
            }
            catch (error) {
                console.error("Error fetching paginated categories:", error);
                throw new Error("Error fetching paginated categories");
            }
        });
    }
    addCategory(categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newCategory = new categoryModel_1.Category({
                    name: categoryData.name,
                    department: categoryData.department,
                });
                const savedCategory = yield newCategory.save();
                const populatedCategory = yield categoryModel_1.Category.findById(savedCategory._id).populate("department");
                if (!populatedCategory) {
                    throw new Error("Could not populate department details for the new category.");
                }
                return populatedCategory.toObject();
            }
            catch (error) {
                console.error("Error adding category:", error);
                throw new Error("An error occurred while adding the category");
            }
        });
    }
    updateCategory(categoryId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCategory = yield categoryModel_1.Category.findByIdAndUpdate(categoryId, {
                    name: updateData.name,
                    department: updateData.department,
                }, { new: true }).populate("department");
                return updatedCategory ? updatedCategory.toObject() : null;
            }
            catch (error) {
                console.error("Error updating category:", error);
                throw new Error("An error occurred while updating the category");
            }
        });
    }
    deleteCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield categoryModel_1.Category.findByIdAndDelete(categoryId);
            }
            catch (error) {
                console.error("Error deleting category:", error);
                throw new Error("An error occurred while deleting the category");
            }
        });
    }
    getCategoryCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield categoryModel_1.Category.countDocuments();
            }
            catch (error) {
                console.error("Error counting categories:", error);
                throw new Error("An error occurred while counting categories");
            }
        });
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryList = yield categoryModel_1.Category.find();
                return categoryList;
            }
            catch (error) {
                console.error("Error fetching categories from database:", error);
                throw new Error("An error occurred while fetching categories");
            }
        });
    }
}
exports.default = new CategoryRepository();
