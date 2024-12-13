// import { ICategory } from "../../domain/entities/types/categoryType";
// import { Category } from "../database/dbModel/categoryModel";

// // ##-ADMIN--##// 
// export const getPaginatedCategories = async (
// ) => {
//     try {
//         const categories = await Category.find()
//             .populate("department")
//             .lean()
//             .exec();

//         // Map over categories to explicitly cast _id to string
//         const mappedCategories: ICategory[] = categories.map((category) => ({
//             ...category,
//             _id: category._id.toString(), // Convert _id to string
//         }));

//         return {
//             categories: mappedCategories,
//         };
//     } catch (error) {
//         console.error("Error fetching paginated categories:", error);
//         throw new Error("Error fetching paginated categories");
//     }
// };
// // Database Interaction Layer for Adding a New Category
// export const addCategoryToDB = async (categoryData: {
//     name: string;
//     department: string;
// }): Promise<ICategory> => {
//     try {
//         // Step 1: Create a new Category instance
//         const newCategory = new Category({
//             name: categoryData.name,
//             department: categoryData.department, // Save the department reference
//         });

//         // Step 2: Save the new category to the database
//         const savedCategory = await newCategory.save();

//         // Step 3: Populate the department details
//         const populatedCategory = await Category.findById(savedCategory._id).populate("department");

//         if (!populatedCategory) {
//             throw new Error("Could not populate department details for the new category.");
//         }

//         // Log the populated category with department details
//         console.log("Populated Category with Department Details:", populatedCategory);

//         // Step 4: Return the populated category as a plain object
//         return populatedCategory.toObject() as ICategory;
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             console.error("Error adding category:", error.message);
//             throw new Error(error.message);
//         } else {
//             console.error("An unknown error occurred while adding a new category.");
//             throw new Error("An unknown error occurred while adding a new category.");
//         }
//     }
// };
// // Update Category
// export const updateCategoryInDB = async (
//     categoryId: string,
//     updateData: {
//         name: string;
//         department: string;
//     }
// ): Promise<ICategory | null> => {
//     try {
//         const updatedCategory = await Category.findByIdAndUpdate(
//             categoryId,
//             {
//                 name: updateData.name,
//                 department: updateData.department,
//             },
//             { new: true }
//         ).populate('department');
//         return updatedCategory ? (updatedCategory.toObject() as ICategory) : null; // Explicitly cast the result to ICategory
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             throw new Error(error.message);
//         } else {
//             throw new Error("An unknown error occurred while updating the category.");
//         }
//     }
// };
// // Delete Category
// export const deleteCategoryFromDB = async (
//     categoryId: string
// ): Promise<void> => {
//     try {
//         await Category.findByIdAndDelete(categoryId);
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             throw new Error(error.message);
//         } else {
//             throw new Error("An unknown error occurred while deleting the category.");
//         }
//     }
// };
// export const categoryCount = async () => {
//     const categoryCounts = await Category.countDocuments();
//     return categoryCounts;
// };


// // ##-USER--##//
// export const getCategories = async () => {
//     try {
//         const categoryList = await Category.find();
//         return categoryList;
//     } catch (error) {
//         console.error("Error fetching categories from database:", error);
//         throw error; // Re-throw to be handled by calling functions
//     }
// };


import { ICategory } from "../../domain/entities/types/categoryType";
import { Category } from "../database/dbModel/categoryModel";

class CategoryRepository {
  async getPaginatedCategories() {
    try {
      const categories = await Category.find()
        .populate("department")
        .lean()
        .exec();

      const mappedCategories: ICategory[] = categories.map((category) => ({
        ...category,
        _id: category._id.toString(), // Convert _id to string
      }));

      return { categories: mappedCategories };
    } catch (error) {
      console.error("Error fetching paginated categories:", error);
      throw new Error("Error fetching paginated categories");
    }
  }

  async addCategory(categoryData: { name: string; department: string }): Promise<ICategory> {
    try {
      const newCategory = new Category({
        name: categoryData.name,
        department: categoryData.department,
      });

      const savedCategory = await newCategory.save();

      const populatedCategory = await Category.findById(savedCategory._id).populate("department");
      if (!populatedCategory) {
        throw new Error("Could not populate department details for the new category.");
      }

      return populatedCategory.toObject() as ICategory;
    } catch (error) {
      console.error("Error adding category:", error);
      throw new Error("An error occurred while adding the category");
    }
  }

  async updateCategory(
    categoryId: string,
    updateData: { name: string; department: string }
  ): Promise<ICategory | null> {
    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        {
          name: updateData.name,
          department: updateData.department,
        },
        { new: true }
      ).populate("department");

      return updatedCategory ? (updatedCategory.toObject() as ICategory) : null;
    } catch (error) {
      console.error("Error updating category:", error);
      throw new Error("An error occurred while updating the category");
    }
  }

  async deleteCategory(categoryId: string): Promise<void> {
    try {
      await Category.findByIdAndDelete(categoryId);
    } catch (error) {
      console.error("Error deleting category:", error);
      throw new Error("An error occurred while deleting the category");
    }
  }

  async getCategoryCount(): Promise<number> {
    try {
      return await Category.countDocuments();
    } catch (error) {
      console.error("Error counting categories:", error);
      throw new Error("An error occurred while counting categories");
    }
  }

  async getCategories() {
    try {
      const categoryList = await Category.find();
      return categoryList;
    } catch (error) {
      console.error("Error fetching categories from database:", error);
      throw new Error("An error occurred while fetching categories");
    }
  }
}

export default new CategoryRepository();
