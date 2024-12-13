"use strict";
// import { Users } from "../database/dbModel/userModel";
// import { IUser, PaginatedUsers } from "../../domain/entities/types/userType";
// import Message from "../database/dbModel/messageModel";
// import { IPatientInput } from "../../domain/entities/types/patientType";
// import Patient from "../database/dbModel/patientModel";
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
// // ##-ADMIN--##//
// // Get All Users
// export const getAllUsers = async () => {
//     try {
//         return await Users.find();
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             throw new Error(error.message);
//         }
//         throw new Error("An unknown error occurred while fetching all users.");
//     }
// };
// // Get Paginated Users with proper typing
// export const getPaginatedUsers = async (
//     page: number,
//     limit: number
// ): Promise<PaginatedUsers> => {
//     try {
//         const users = await Users.find()
//             .skip((page - 1) * limit)
//             .limit(limit);
//         const totalUsers = await Users.countDocuments();
//         const totalPages = Math.ceil(totalUsers / limit);
//         return {
//             users,
//             totalPages,
//         };
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             throw new Error(error.message);
//         }
//         throw new Error(
//             "An unknown error occurred while fetching paginated users."
//         );
//     }
// };
// // Update User Status (Block/Unblock)
// export const updateUserStatus = async (
//     userId: string,
//     isBlocked: boolean
// ): Promise<IUser | null> => {
//     try {
//         const updatedUser = await Users.findByIdAndUpdate(
//             userId,
//             { is_blocked: isBlocked },
//             { new: true }
//         );
//         return updatedUser;
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             throw new Error(error.message);
//         } else {
//             throw new Error("An unknown error occurred while updating user status.");
//         }
//     }
// };
// export const userCount = async () => {
//     const userCount = await Users.countDocuments();
//     return userCount;
// };
// export const successMessagetoUser = async (chatId: string, content: string) => {
//     return await Message.create({
//         chat: chatId,
//         sender: '66ee588d1e1448fbea1f40bb',
//         senderModel: "Admin",
//         content,
//         createdAt: new Date(),
//     });
// }
// // ##-USER--##//
// export const getStatus = async (id: string) => {
//     const user = await Users.findOne({ _id: id })
//     console.log(user)
//     return user
// }
// export const editUserInDb = async (id: string, fieldToChange: object) => {
//     try {
//         const editedUser = await Users.findByIdAndUpdate(
//             id,
//             { $set: fieldToChange },
//             { new: true }
//         );
//         return editedUser;
//     } catch (error) {
//         console.error("Error updating user in the database:", error);
//         throw new Error("Error updating user in the database");
//     }
// };
// export const addPatientInDb = async (
//     patientData: IPatientInput,
//     userId: string
// ) => {
//     try {
//         const newPatient = new Patient({ ...patientData, userId });
//         const addedPatient = await newPatient.save();
//         return addedPatient;
//     } catch (error) {
//         console.error("Error saving patient to database:", error);
//         throw new Error("Error saving patient to database");
//     }
// };
// export const getFamilyDataInDb = async (id: string) => {
//     try {
//         const familyData = await Patient.find({ userId: id });
//         return familyData;
//     } catch (error) {
//         console.error("Error fetching patient from database:", error);
//         throw new Error("Error fetching patient from database");
//     }
// };
const userModel_1 = require("../database/dbModel/userModel");
const messageModel_1 = __importDefault(require("../database/dbModel/messageModel"));
const patientModel_1 = __importDefault(require("../database/dbModel/patientModel"));
class UserRepository {
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModel_1.Users.find();
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                throw new Error("An unknown error occurred while fetching all users.");
            }
        });
    }
    // Get Paginated Users with proper typing
    getPaginatedUsers(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userModel_1.Users.find()
                    .skip((page - 1) * limit)
                    .limit(limit);
                const totalUsers = yield userModel_1.Users.countDocuments();
                const totalPages = Math.ceil(totalUsers / limit);
                return {
                    users,
                    totalPages,
                };
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                throw new Error("An unknown error occurred while fetching paginated users.");
            }
        });
    }
    ;
    // Update User Status (Block/Unblock)
    updateUserStatus(userId, isBlocked) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield userModel_1.Users.findByIdAndUpdate(userId, { is_blocked: isBlocked }, { new: true });
                return updatedUser;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                else {
                    throw new Error("An unknown error occurred while updating user status.");
                }
            }
        });
    }
    ;
    userCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const userCount = yield userModel_1.Users.countDocuments();
            return userCount;
        });
    }
    ;
    successMessagetoUser(chatId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield messageModel_1.default.create({
                chat: chatId,
                sender: '66ee588d1e1448fbea1f40bb',
                senderModel: "Admin",
                content,
                createdAt: new Date(),
            });
        });
    }
    // ##-USER--##//
    getStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.Users.findOne({ _id: id });
            console.log(user);
            return user;
        });
    }
    editUserInDb(id, fieldToChange) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const editedUser = yield userModel_1.Users.findByIdAndUpdate(id, { $set: fieldToChange }, { new: true });
                return editedUser;
            }
            catch (error) {
                console.error("Error updating user in the database:", error);
                throw new Error("Error updating user in the database");
            }
        });
    }
    ;
    addPatientInDb(patientData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newPatient = new patientModel_1.default(Object.assign(Object.assign({}, patientData), { userId }));
                const addedPatient = yield newPatient.save();
                return addedPatient;
            }
            catch (error) {
                console.error("Error saving patient to database:", error);
                throw new Error("Error saving patient to database");
            }
        });
    }
    ;
    getFamilyDataInDb(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const familyData = yield patientModel_1.default.find({ userId: id });
                return familyData;
            }
            catch (error) {
                console.error("Error fetching patient from database:", error);
                throw new Error("Error fetching patient from database");
            }
        });
    }
}
exports.default = new UserRepository();
