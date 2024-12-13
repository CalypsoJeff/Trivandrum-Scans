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
const serviceInteractor_1 = __importDefault(require("../../domain/useCases/auth/serviceInteractor"));
// import { Service } from "../../infrastructure/database/dbModel/serviceModel";
exports.default = {
    // ##-USER--##//
    getServiceDetail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const fetchedServiceDetail = yield serviceInteractor_1.default.getServiceData(id);
            res.status(200).json(fetchedServiceDetail);
        }
        catch (error) {
            console.error("Error fetching service detail :", error);
            res.status(500).json();
        }
    }),
    getServices: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { page = 1, limit = 10 } = req.query;
            const serviceList = yield serviceInteractor_1.default.getServiceListUser(Number(page), Number(limit));
            res.status(200).json(serviceList);
        }
        catch (error) {
            console.error("Failed to retrieve services", error);
            res.status(500).json({ message: "Failed to retrieve services" });
        }
    }),
    //   getAllServices: async (req: Request, res: Response) => {
    //     try {
    //       const services = await Service.find({ isAvailable: true });
    //       res.status(200).json(services)
    //     } catch (error) {
    //       console.error('Error fetching services:', error);
    //       res.status(500).json({ message: 'Internal server error' });
    //     }
    //   },
    // ##-ADMIN--##//
    addService: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { name, price, category, preTestPreparations, expectedResultDuration, description, } = req.body;
            const files = req.files;
            const serviceImage = (_a = files === null || files === void 0 ? void 0 : files.serviceImage) === null || _a === void 0 ? void 0 : _a[0];
            if (!serviceImage) {
                console.error("Service Image is missing.");
                return res
                    .status(400)
                    .json({ message: "License document is required" });
            }
            const serviceData = {
                name, price, category, preTestPreparations, expectedResultDuration, description, serviceImage,
            };
            const result = yield serviceInteractor_1.default.addServiceData(serviceData);
            res.status(200).json({ message: "Service added successfully", result });
        }
        catch (error) {
            console.error("Failed to add service", error);
            res.status(500).json({ message: "Failed to add service" });
        }
    }),
    editService: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { id } = req.params; // Get the service ID from the URL parameters
            const { name, price, category, preTestPreparations, expectedResultDuration, description, } = req.body;
            const files = req.files;
            const serviceImage = (_a = files === null || files === void 0 ? void 0 : files.serviceImage) === null || _a === void 0 ? void 0 : _a[0];
            const serviceData = Object.assign({ name,
                price,
                category,
                preTestPreparations,
                expectedResultDuration,
                description }, (serviceImage && { serviceImage }));
            const result = yield serviceInteractor_1.default.editServiceData(id, serviceData);
            res.status(200).json({ message: "Service edited successfully", result });
        }
        catch (error) {
            console.error("Failed to edit service", error);
            res.status(500).json({ message: "Failed to edit service" });
        }
    }),
    getServicesAdmin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const serviceList = yield serviceInteractor_1.default.getServiceList();
            res.status(200).json(serviceList);
        }
        catch (error) {
            console.error("Failed to retrieve services", error);
            res.status(500).json({ message: "Failed to retrieve services" });
        }
    }),
    toggleService: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const toggled = serviceInteractor_1.default.toggleService(id);
            res.status(200).json(toggled);
        }
        catch (error) {
            console.error("Failed to toggle services", error);
            res.status(500).json({ message: "Failed to toggle services" });
        }
    }),
};
