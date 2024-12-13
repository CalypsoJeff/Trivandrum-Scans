"use strict";
// import { IServiceResponse } from "../../domain/entities/types/serviceType";
// import { Service } from "../database/dbModel/serviceModel";
// import { Category } from "../database/dbModel/categoryModel";
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
const serviceModel_1 = require("../database/dbModel/serviceModel");
const categoryModel_1 = require("../database/dbModel/categoryModel");
class ServiceRepository {
    // ##-ADMIN--##
    saveService(completeServiceData) {
        return __awaiter(this, void 0, void 0, function* () {
            const service = new serviceModel_1.Service(completeServiceData);
            return yield service.save();
        });
    }
    updateService(id, completeServiceData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingService = yield serviceModel_1.Service.findById(id);
                if (!existingService) {
                    throw new Error("Service not found");
                }
                Object.assign(existingService, completeServiceData);
                return yield existingService.save();
            }
            catch (error) {
                console.error("Error updating service:", error);
                throw new Error("Failed to update service");
            }
        });
    }
    getAllServicesWithCategoryDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const services = yield serviceModel_1.Service.find().lean();
                return {
                    services: yield Promise.all(services.map((service) => __awaiter(this, void 0, void 0, function* () {
                        const category = yield categoryModel_1.Category.findById(service.category, "_id name").lean().exec();
                        return Object.assign(Object.assign({}, service), { _id: service._id.toString(), category: category
                                ? { _id: category._id.toString(), name: category.name }
                                : { _id: "Unknown", name: "Unknown" } });
                    }))),
                };
            }
            catch (error) {
                console.error("Error fetching all services:", error);
                throw new Error("Error fetching all services");
            }
        });
    }
    toggleServiceByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const service = yield serviceModel_1.Service.findById(id);
                if (!service) {
                    throw new Error("Service not found");
                }
                service.isAvailable = !service.isAvailable;
                return yield service.save();
            }
            catch (error) {
                console.error("Error toggling service availability:", error);
                throw new Error("Error toggling service availability");
            }
        });
    }
    // ##-USER--##
    getService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield serviceModel_1.Service.findById(id).populate("category");
            }
            catch (error) {
                console.error("Error fetching service data:", error);
                throw new Error("Error fetching service data");
            }
        });
    }
    getPaginatedServices(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const services = yield serviceModel_1.Service.find({ isAvailable: true }).skip(skip).limit(limit).lean().exec();
                const totalServices = yield serviceModel_1.Service.countDocuments();
                const totalPages = Math.ceil(totalServices / limit);
                return {
                    services: yield Promise.all(services.map((service) => __awaiter(this, void 0, void 0, function* () {
                        const category = yield categoryModel_1.Category.findById(service.category, "_id name").lean().exec();
                        return Object.assign(Object.assign({}, service), { _id: service._id.toString(), category: category
                                ? { _id: category._id.toString(), name: category.name }
                                : { _id: "Unknown", name: "Unknown" } });
                    }))),
                    totalPages,
                    currentPage: page,
                };
            }
            catch (error) {
                console.error("Error fetching paginated services:", error);
                throw new Error("Error fetching paginated services");
            }
        });
    }
}
exports.default = new ServiceRepository();
