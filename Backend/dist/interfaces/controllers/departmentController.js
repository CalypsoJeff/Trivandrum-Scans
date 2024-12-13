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
const departmentInteractor_1 = __importDefault(require("../../domain/useCases/auth/departmentInteractor"));
exports.default = {
    addDepartment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, description } = req.body;
            if (!name) {
                return res.status(400).json({ error: "Department name is required" });
            }
            const departmentData = {
                departmentName: name,
                departmentDescription: description,
            };
            const Department = yield departmentInteractor_1.default.addDepartment(departmentData);
            res.status(200).json({ message: "Department Added Successfully", Department });
        }
        catch (error) {
            console.error("Error adding department:", error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }),
    departmentList: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const departments = yield departmentInteractor_1.default.getDepartments();
            res.status(200).json(departments);
        }
        catch (error) {
            console.error("Error fetching department:", error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }),
    editDepartment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            if (!id) {
                return res.status(400).json({ error: "Department ID is required" });
            }
            if (!name) {
                return res.status(400).json({ error: "Department name is required" });
            }
            const departmentData = { name, description };
            const updatedDepartment = yield departmentInteractor_1.default.editDepartment(id, departmentData);
            return res.status(200).json({
                message: "Department updated successfully",
                department: updatedDepartment,
            });
        }
        catch (error) {
            console.error("Error editing department:", error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }),
    deleteDepartment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: "Department ID is required" });
            }
            const deletedDepartment = yield departmentInteractor_1.default.deleteDepartment(id);
            if (!deletedDepartment) {
                return res.status(404).json({ error: "Department not found" });
            }
            return res
                .status(200)
                .json({ message: "Department deleted successfully", id });
        }
        catch (error) {
            console.error("Error deleting department:", error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "An unexpected error occurred" });
            }
        }
    }),
    getDepartmentCount: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const departmentCounts = yield departmentInteractor_1.default.countDepartments();
            res.json(departmentCounts);
        }
        catch (error) {
            console.error("Failed to fetch department Count", error);
            res.status(500).json({ message: "Failed to fetch department Count" });
        }
    }),
};
