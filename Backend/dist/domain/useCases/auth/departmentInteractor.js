"use strict";
// import { getAllDepartments, updateDepartment } from "../../../infrastructure/repositories/mongoDepartmentRepository";
// import { Department } from "../../../infrastructure/database/dbModel/departmentModel";
// import { IDepartment } from "../../entities/types/departmentType";
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
//     addDepartment: async (departmentData: {
//         departmentName: string;
//         departmentDescription?: string;
//     }): Promise<IDepartment> => {
//         try {
//             const newDepartment = new Department({
//                 name: departmentData.departmentName,
//                 description: departmentData.departmentDescription || "",
//             });
//             const savedDepartment = await newDepartment.save();
//             return savedDepartment;
//         } catch (error) {
//             console.error("Error adding department:", error);
//             throw new Error("Could not add department");
//         }
//     },
//     getDepartments: async () => {
//         try {
//             const users = await getAllDepartments();
//             return users;
//         } catch (error: unknown) {
//             if (error instanceof Error) {
//                 throw new Error(error.message);
//             }
//             throw new Error(
//                 "An unknown error occurred while fetching paginated users"
//             );
//         }
//     },
//     editDepartment: async (
//         id: string,
//         departmentData: { name: string; description?: string }
//     ): Promise<IDepartment | null> => {
//         const updatedDepartment = await updateDepartment(id, departmentData);
//         if (!updatedDepartment) {
//             throw new Error("Department not found or could not be updated");
//         }
//         return updatedDepartment;
//     },
//     deleteDepartment: async (id: string) => {
//         try {
//             if (!id) {
//                 throw new Error("Department ID is required");
//             }
//             const deletedDepartment = await Department.findByIdAndDelete(id);
//             if (!deletedDepartment) {
//                 throw new Error("Department not found or could not be deleted");
//             }
//             return deletedDepartment;
//         } catch (error) {
//             console.error("Error deleting department:", error);
//             throw new Error("Could not delete department");
//         }
//     },
// }
const mongoDepartmentRepository_1 = __importDefault(require("../../../infrastructure/repositories/mongoDepartmentRepository"));
const departmentModel_1 = require("../../../infrastructure/database/dbModel/departmentModel");
exports.default = {
    addDepartment(departmentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newDepartment = new departmentModel_1.Department({
                    name: departmentData.departmentName,
                    description: departmentData.departmentDescription || "",
                });
                return yield newDepartment.save();
            }
            catch (error) {
                console.error("Error adding department:", error);
                throw new Error("An error occurred while adding the department");
            }
        });
    },
    getDepartments() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield mongoDepartmentRepository_1.default.getAllDepartments();
            }
            catch (error) {
                console.error("Error fetching departments:", error);
                throw new Error("An error occurred while fetching departments");
            }
        });
    },
    editDepartment(id, departmentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedDepartment = yield mongoDepartmentRepository_1.default.updateDepartment(id, departmentData);
                if (!updatedDepartment) {
                    throw new Error("Department not found or could not be updated");
                }
                return updatedDepartment;
            }
            catch (error) {
                console.error("Error editing department:", error);
                throw new Error("An error occurred while editing the department");
            }
        });
    },
    deleteDepartment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedDepartment = yield mongoDepartmentRepository_1.default.deleteDepartment(id);
                if (!deletedDepartment) {
                    throw new Error("Department not found or could not be deleted");
                }
                return deletedDepartment;
            }
            catch (error) {
                console.error("Error deleting department:", error);
                throw new Error("An error occurred while deleting the department");
            }
        });
    },
    countDepartments() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield mongoDepartmentRepository_1.default.countDepartments();
            }
            catch (error) {
                console.error("Error counting departments:", error);
                throw new Error("An error occurred while counting departments");
            }
        });
    },
};
