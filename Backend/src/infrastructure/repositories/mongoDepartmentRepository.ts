import { Department, IDepartment } from "../database/dbModel/departmentModel";




// ##-ADMIN--##// 

export const getAllDepartments = async () => {
    try {
        return await Department.find();
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error(
            "An unknown error occurred while fetching all departments."
        );
    }
};

export const updateDepartment = async (
    id: string,
    updatedData: { name: string; description?: string }
): Promise<IDepartment | null> => {
    try {
        // Validate that the ID is provided
        if (!id) {
            throw new Error("Department ID is required");
        }

        // Find the department by ID and update it with the provided data (name, description)
        const updatedDepartment = await Department.findByIdAndUpdate(
            id, // The department ID to update
            { ...updatedData }, // The new data (name and description)
            { new: true, runValidators: true } // Return the updated document and validate input
        );

        // Return the updated department or null if not found
        return updatedDepartment;
    } catch (error) {
        console.error("Error updating department:", error);
        throw new Error("Could not update department");
    }
};
export const deleteDepartment = async (id: string) => {
    try {
        if (!id) {
            throw new Error("Department ID is required");
        }
        // Delete the department by ID and return the deleted department data
        const deletedDepartment = await Department.findByIdAndDelete(id);
        return deletedDepartment; // Returns null if the department is not found
    } catch (error) {
        console.error("Error deleting department:", error);
        throw new Error("Could not delete department");
    }
};
export const departmentCount = async () => {
    const departmentCount = await Department.countDocuments();
    return departmentCount;
};
