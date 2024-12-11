import { getAllDepartments, updateDepartment } from "../../../infrastructure/repositories/mongoDepartmentRepository";
import { Department } from "../../../infrastructure/database/dbModel/departmentModel";
import { IDepartment } from "../../entities/types/departmentType";


export default {

    addDepartment: async (departmentData: {
        departmentName: string;
        departmentDescription?: string;
    }): Promise<IDepartment> => {
        try {
            const newDepartment = new Department({
                name: departmentData.departmentName,
                description: departmentData.departmentDescription || "",
            });
            const savedDepartment = await newDepartment.save();
            return savedDepartment;
        } catch (error) {
            console.error("Error adding department:", error);
            throw new Error("Could not add department");
        }
    },
    getDepartments: async () => {
        try {
            const users = await getAllDepartments();
            return users;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error(
                "An unknown error occurred while fetching paginated users"
            );
        }
    },
    editDepartment: async (
        id: string,
        departmentData: { name: string; description?: string }
    ): Promise<IDepartment | null> => {
        const updatedDepartment = await updateDepartment(id, departmentData);
        if (!updatedDepartment) {
            throw new Error("Department not found or could not be updated");
        }
        return updatedDepartment;
    },
    deleteDepartment: async (id: string) => {
        try {
            if (!id) {
                throw new Error("Department ID is required");
            }
            const deletedDepartment = await Department.findByIdAndDelete(id);
            if (!deletedDepartment) {
                throw new Error("Department not found or could not be deleted");
            }
            return deletedDepartment;
        } catch (error) {
            console.error("Error deleting department:", error);
            throw new Error("Could not delete department");
        }
    },



}