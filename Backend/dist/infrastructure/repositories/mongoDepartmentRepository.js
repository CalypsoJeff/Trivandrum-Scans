"use strict";
// import { Department, IDepartment } from "../database/dbModel/departmentModel";
// // ##-ADMIN--##// 
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
// export const getAllDepartments = async () => {
//     try {
//         return await Department.find();
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             throw new Error(error.message);
//         }
//         throw new Error(
//             "An unknown error occurred while fetching all departments."
//         );
//     }
// };
// export const updateDepartment = async (
//     id: string,
//     updatedData: { name: string; description?: string }
// ): Promise<IDepartment | null> => {
//     try {
//         // Validate that the ID is provided
//         if (!id) {
//             throw new Error("Department ID is required");
//         }
//         // Find the department by ID and update it with the provided data (name, description)
//         const updatedDepartment = await Department.findByIdAndUpdate(
//             id, // The department ID to update
//             { ...updatedData }, // The new data (name and description)
//             { new: true, runValidators: true } // Return the updated document and validate input
//         );
//         // Return the updated department or null if not found
//         return updatedDepartment;
//     } catch (error) {
//         console.error("Error updating department:", error);
//         throw new Error("Could not update department");
//     }
// };
// export const deleteDepartment = async (id: string) => {
//     try {
//         if (!id) {
//             throw new Error("Department ID is required");
//         }
//         // Delete the department by ID and return the deleted department data
//         const deletedDepartment = await Department.findByIdAndDelete(id);
//         return deletedDepartment; // Returns null if the department is not found
//     } catch (error) {
//         console.error("Error deleting department:", error);
//         throw new Error("Could not delete department");
//     }
// };
// export const departmentCount = async () => {
//     const departmentCount = await Department.countDocuments();
//     return departmentCount;
// };
const departmentModel_1 = require("../database/dbModel/departmentModel");
class DepartmentRepository {
    getAllDepartments() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield departmentModel_1.Department.find();
            }
            catch (error) {
                console.error("Error fetching all departments:", error);
                throw new Error("An error occurred while fetching all departments");
            }
        });
    }
    updateDepartment(id, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    throw new Error("Department ID is required");
                }
                const updatedDepartment = yield departmentModel_1.Department.findByIdAndUpdate(id, Object.assign({}, updatedData), { new: true, runValidators: true });
                return updatedDepartment;
            }
            catch (error) {
                console.error("Error updating department:", error);
                throw new Error("An error occurred while updating the department");
            }
        });
    }
    deleteDepartment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    throw new Error("Department ID is required");
                }
                const deletedDepartment = yield departmentModel_1.Department.findByIdAndDelete(id);
                return deletedDepartment;
            }
            catch (error) {
                console.error("Error deleting department:", error);
                throw new Error("An error occurred while deleting the department");
            }
        });
    }
    countDepartments() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield departmentModel_1.Department.countDocuments();
            }
            catch (error) {
                console.error("Error counting departments:", error);
                throw new Error("An error occurred while counting departments");
            }
        });
    }
}
exports.default = new DepartmentRepository();
