import { Department, IDepartment } from "../database/dbModel/departmentModel";
class DepartmentRepository {
    async getAllDepartments(): Promise<IDepartment[]> {
        try {
            return await Department.find();
        } catch (error) {
            console.error("Error fetching all departments:", error);
            throw new Error("An error occurred while fetching all departments");
        }
    }
    async updateDepartment(
        id: string,
        updatedData: { name: string; description?: string }
    ): Promise<IDepartment | null> {
        try {
            if (!id) {
                throw new Error("Department ID is required");
            }
            const updatedDepartment = await Department.findByIdAndUpdate(
                id,
                { ...updatedData },
                { new: true, runValidators: true }
            );
            return updatedDepartment;
        } catch (error) {
            console.error("Error updating department:", error);
            throw new Error("An error occurred while updating the department");
        }
    }
    async deleteDepartment(id: string): Promise<IDepartment | null> {
        try {
            if (!id) {
                throw new Error("Department ID is required");
            }
            const deletedDepartment = await Department.findByIdAndDelete(id);
            return deletedDepartment;
        } catch (error) {
            console.error("Error deleting department:", error);
            throw new Error("An error occurred while deleting the department");
        }
    }
    async countDepartments(): Promise<number> {
        try {
            return await Department.countDocuments();
        } catch (error) {
            console.error("Error counting departments:", error);
            throw new Error("An error occurred while counting departments");
        }
    }
}

export default new DepartmentRepository();
