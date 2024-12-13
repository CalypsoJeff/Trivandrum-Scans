"use strict";
// import { addCategoryToDB, deleteCategoryFromDB, updateCategoryInDB, getPaginatedCategories, getCategories } from "../../../infrastructure/repositories/mongoCategoryRepository";
// import { ICategory, } from "../../entities/types/categoryType";
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
// export default {
//     // ##-ADMIN--##//
//     addCategory: async (categoryData: {
//         name: string;
//         department: string;
//     }): Promise<ICategory> => {
//         try {
//             // Validate category data
//             if (!categoryData.name || !categoryData.department) {
//                 throw new Error("Category name and department are required");
//             }
//             const newCategory = await addCategoryToDB(categoryData);
//             return newCategory;
//         } catch (error: unknown) {
//             if (error instanceof Error) {
//                 console.error(`Error: ${error.message}`);
//                 throw new Error(error.message);
//             } else {
//                 throw new Error("An unknown error occurred while adding the category.");
//             }
//         }
//     },
//     updateCategory: async (
//         categoryId: string,
//         updateData: {
//             name: string;
//             department: string;
//         }
//     ) => {
//         try {
//             if (!updateData.name || !updateData.department) {
//                 throw new Error("Category name and department are required");
//             }
//             const updatedCategory = await updateCategoryInDB(categoryId, updateData);
//             return updatedCategory;
//         } catch (error: unknown) {
//             if (error instanceof Error) {
//                 throw new Error(error.message);
//             } else {
//                 throw new Error(
//                     "An unknown error occurred while updating the category."
//                 );
//             }
//         }
//     },
//     deleteCategory: async (categoryId: string) => {
//         try {
//             await deleteCategoryFromDB(categoryId);
//         } catch (error: unknown) {
//             if (error instanceof Error) {
//                 throw new Error(error.message);
//             } else {
//                 throw new Error(
//                     "An unknown error occurred while deleting the category."
//                 );
//             }
//         }
//     },
//     getCategories: async (
//     ) => {
//         try {
//             const categories = await getPaginatedCategories();
//             return categories;
//         } catch (error: unknown) {
//             if (error instanceof Error) {
//                 console.error(`Error: ${error.message}`);
//                 throw new Error(error.message);
//             }
//             throw new Error(
//                 "An unknown error occurred while fetching paginated categories"
//             );
//         }
//     },
//     // ##-USER--##//
//     getCategory: async () => {
//         try {
//             return await getCategories();
//         } catch (error) {
//             console.error("Error in userInteractor getCategories:", error);
//             throw error; // Re-throw to be handled by the controller
//         }
//     },
// }
const mongoCategoryRepository_1 = __importDefault(require("../../../infrastructure/repositories/mongoCategoryRepository"));
exports.default = {
    addCategory(categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!categoryData.name || !categoryData.department) {
                    throw new Error("Category name and department are required");
                }
                return yield mongoCategoryRepository_1.default.addCategory(categoryData);
            }
            catch (error) {
                console.error("Error in addCategory:", error);
                throw new Error("An error occurred while adding the category");
            }
        });
    },
    updateCategory(categoryId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!updateData.name || !updateData.department) {
                    throw new Error("Category name and department are required");
                }
                return yield mongoCategoryRepository_1.default.updateCategory(categoryId, updateData);
            }
            catch (error) {
                console.error("Error in updateCategory:", error);
                throw new Error("An error occurred while updating the category");
            }
        });
    },
    deleteCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoCategoryRepository_1.default.deleteCategory(categoryId);
            }
            catch (error) {
                console.error("Error in deleteCategory:", error);
                throw new Error("An error occurred while deleting the category");
            }
        });
    },
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield mongoCategoryRepository_1.default.getPaginatedCategories();
            }
            catch (error) {
                console.error("Error in getCategories:", error);
                throw new Error("An error occurred while fetching paginated categories");
            }
        });
    },
    getCategoryList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield mongoCategoryRepository_1.default.getCategories();
            }
            catch (error) {
                console.error("Error in getCategoryList:", error);
                throw new Error("An error occurred while fetching categories");
            }
        });
    },
    countCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield mongoCategoryRepository_1.default.getCategoryCount();
            }
            catch (error) {
                console.error("Error in getCategoryCount:", error);
                throw new Error("An error occurred while fetching category count");
            }
        });
    }
};
