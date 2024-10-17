import { IDepartment } from "./departmentType";

export interface ICategory {
  _id: string; // Category ID
  name: string; // Name of the category, e.g., CT Scan, MRI, etc.
  department: IDepartment["_id"]; // Reference to Department's ObjectId
  createdAt?: Date; // Timestamp when the category was created (Optional because Mongoose generates this)
  updatedAt?: Date; // Timestamp when the category was last updated (Optional because Mongoose generates this)
}
export interface PaginatedCategories {
  categories: ICategory[]; // Array of categories
  totalPages: number; // Total number of pages for pagination
}
