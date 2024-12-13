"use strict";
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
const mongoUserRepository_1 = __importDefault(require("../../../infrastructure/repositories/mongoUserRepository"));
exports.default = {
    getStatus: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield mongoUserRepository_1.default.getStatus(id);
        }
        catch (error) {
            console.error(error.message);
            throw error;
        }
    }),
    editUser: (id, fieldToChange) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedUser = yield mongoUserRepository_1.default.editUserInDb(id, fieldToChange);
            return updatedUser;
        }
        catch (error) {
            console.error("Error updating user", error);
            throw new Error("Error updating user");
        }
    }),
    addPatient: (patientData, userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const addedPatient = yield mongoUserRepository_1.default.addPatientInDb(patientData, userId);
            return addedPatient; // Return the added patient
        }
        catch (error) {
            console.error("Error in adding patient: ", error);
            throw new Error("Error in adding patient");
        }
    }),
    getFamilyData: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const familyData = mongoUserRepository_1.default.getFamilyDataInDb(id);
            return familyData;
        }
        catch (error) {
            console.error("Error fetching patient: ", error);
            throw new Error("Error fetching patient");
        }
    }),
    // ##-ADMIN--##//
    userList: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield mongoUserRepository_1.default.getAllUsers();
            return users;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                throw error;
            }
            throw new Error("An unknown error occurred while fetching user list");
        }
    }),
    getUsers: (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield mongoUserRepository_1.default.getPaginatedUsers(page, limit);
            return users;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("An unknown error occurred while fetching paginated users");
        }
    }),
    updatedUserStatus: (userId, is_blocked) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedUser = yield mongoUserRepository_1.default.updateUserStatus(userId, is_blocked);
            return updatedUser;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("An unknown error occurred while updating user status in userInteractor.");
            }
        }
    }),
    getUserCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch user count from the repository
                const userCounts = yield mongoUserRepository_1.default.userCount();
                return userCounts;
            }
            catch (error) {
                console.error("Error fetching user count in interactor:", error);
                throw new Error("Failed to fetch user count");
            }
        });
    }
};
