// import { addCategoryToDB, deleteCategoryFromDB, updateCategoryInDB, getPaginatedCategories, getCategories } from "../../../infrastructure/repositories/mongoCategoryRepository";
// import { ICategory, } from "../../entities/types/categoryType";


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



import CategoryRepository from "../../../infrastructure/repositories/mongoCategoryRepository";
import { ICategory } from "../../entities/types/categoryType";

export default {
  async addCategory(categoryData: { name: string; department: string }): Promise<ICategory> {
    try {
      if (!categoryData.name || !categoryData.department) {
        throw new Error("Category name and department are required");
      }
      return await CategoryRepository.addCategory(categoryData);
    } catch (error) {
      console.error("Error in addCategory:", error);
      throw new Error("An error occurred while adding the category");
    }
  },

  async updateCategory(categoryId: string, updateData: { name: string; department: string }) {
    try {
      if (!updateData.name || !updateData.department) {
        throw new Error("Category name and department are required");
      }
      return await CategoryRepository.updateCategory(categoryId, updateData);
    } catch (error) {
      console.error("Error in updateCategory:", error);
      throw new Error("An error occurred while updating the category");
    }
  },

  async deleteCategory(categoryId: string) {
    try {
      await CategoryRepository.deleteCategory(categoryId);
    } catch (error) {
      console.error("Error in deleteCategory:", error);
      throw new Error("An error occurred while deleting the category");
    }
  },

  async getCategories() {
    try {
      return await CategoryRepository.getPaginatedCategories();
    } catch (error) {
      console.error("Error in getCategories:", error);
      throw new Error("An error occurred while fetching paginated categories");
    }
  },

  async getCategoryList() {
    try {
      return await CategoryRepository.getCategories();
    } catch (error) {
      console.error("Error in getCategoryList:", error);
      throw new Error("An error occurred while fetching categories");
    }
  },
  async countCategory(){
    try {
      return await CategoryRepository.getCategoryCount();
    } catch (error) {
      console.error("Error in getCategoryCount:", error);
      throw new Error("An error occurred while fetching category count");
    }
  }
};
