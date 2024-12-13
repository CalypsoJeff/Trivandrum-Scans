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
