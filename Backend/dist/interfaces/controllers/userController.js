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
const userInteractor_1 = __importDefault(require("../../domain/useCases/auth/userInteractor"));
const userModel_1 = require("../../infrastructure/database/dbModel/userModel");
// import { userCount } from "../../infrastructure/repositories/mongoUserRepository";
exports.default = {
    // ##-USER--##//
    getStatus: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.query.id;
            const response = yield userInteractor_1.default.getStatus(id);
            res.status(200).json({ response });
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }),
    checkAuth: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Hellooooo checkauth");
    }),
    updateUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, address, mobile, age } = req.body; // Destructure all fields from the request body
        const { userId } = req.params;
        try {
            const user = yield userModel_1.Users.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            user.name = name || user.name;
            user.address = address || user.address;
            user.mobile = mobile || user.mobile;
            user.age = age || user.age;
            const updatedUser = yield user.save();
            res.status(200).json(updatedUser);
        }
        catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({ message: "Failed to update user" });
        }
    }),
    getUserData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const user = yield userModel_1.Users.findById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(user);
        }
        catch (error) {
            console.error("Error fetching userdata:", error);
            res.status(500).json({ error: "Error fetching userdata" });
        }
    }),
    editUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { fieldToChange } = req.body;
            const editedUser = yield userInteractor_1.default.editUser(id, fieldToChange);
            res.status(200).json(editedUser);
        }
        catch (error) {
            console.error("Error updating user data:", error);
            res.status(500).json({ message: "Error updating user data" });
        }
    }),
    addPatient: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, relationToUser, age, gender, contactNumber, userId } = req.body;
            const patientData = {
                name,
                relationToUser,
                age,
                gender,
                contactNumber,
                userId,
            };
            const addedPatient = yield userInteractor_1.default.addPatient(patientData, userId);
            res.status(201).json(addedPatient);
        }
        catch (error) {
            console.error("Error adding patient data:", error);
            res.status(500).json({ message: "Failed to add patient", error });
        }
    }),
    getFamilyData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(404).json({ message: "id not foundss" });
            }
            const familyData = yield userInteractor_1.default.getFamilyData(id);
            res.status(200).json(familyData);
        }
        catch (error) {
            console.error("Error fetching family data:", error);
            res.status(500).json({ message: "Error fetching family data", error });
        }
    }),
    // ##-ADMIN--##//
    getUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { page = 1, limit = 10 } = req.query;
            const users = yield userInteractor_1.default.getUsers(Number(page), Number(limit));
            res.status(200).json(users);
        }
        catch (error) {
            console.error("Error fetching users:", error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }),
    blockUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            const { is_blocked } = req.body;
            const updatedUser = yield userInteractor_1.default.updatedUserStatus(userId, is_blocked);
            res.status(200).json(updatedUser);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error.message); // Safely access `message` only if it's an instance of `Error`
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }),
    getUserCount: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userCounts = yield userInteractor_1.default.getUserCount();
            // Respond with the user count
            res.json(userCounts);
        }
        catch (error) {
            console.error("Failed to fetch user count:", error);
            res.status(500).json({ message: "Failed to fetch user count" });
        }
    }),
};
