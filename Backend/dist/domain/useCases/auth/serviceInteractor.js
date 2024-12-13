"use strict";
// import { getPaginatedServices, getService } from "../../../infrastructure/repositories/mongoServiceRepository";
// import {
//     IServiceRequest,
//     IServiceResponse,
// } from "../../entities/types/serviceType";
// import { getAllServicesWithCategoryDetails, saveService, toggleServiceByID, updateService } from "../../../infrastructure/repositories/mongoServiceRepository";
// import { uploadToS3 } from "../../../utils/s3Uploader";
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
//     // ##-USER--##//
//     getServiceData: async (id: string) => {
//         const service = await getService(id);
//         return service;
//     },
//     getServiceListUser: async (page: number, limit: number) => {
//         try {
//             const services = await getPaginatedServices(page, limit); // Update to use the new function
//             return services;
//         } catch (error) {
//             console.error("Error fetching service list:", error);
//             throw new Error("Error fetching service list");
//         }
//     },
//     // ##-ADMIN--##//
//     addServiceData: async (
//         serviceData: IServiceRequest
//     ): Promise<IServiceResponse> => {
//         const {
//             name,
//             price,
//             category,
//             preTestPreparations,
//             expectedResultDuration,
//             description,
//             serviceImage,
//         } = serviceData;
//         const serviceDataResult = await uploadToS3(serviceImage);
//         const serviceImageUrl = serviceDataResult.Location;
//         const completeServiceData = {
//             name,
//             price,
//             category,
//             preTestPreparations,
//             expectedResultDuration,
//             description,
//             serviceImageUrl,
//         };
//         const savedService = await saveService(completeServiceData);
//         return savedService;
//     },
//     editServiceData: async (
//         id: string,
//         serviceData: IServiceRequest
//     ): Promise<IServiceResponse> => {
//         try {
//             let serviceImageUrl = null;
//             if (serviceData.serviceImage) {
//                 const serviceDataResult = await uploadToS3(serviceData.serviceImage);
//                 serviceImageUrl = serviceDataResult.Location; // S3 image URL
//             }
//             const completeServiceData = {
//                 name: serviceData.name,
//                 price: serviceData.price,
//                 category: serviceData.category,
//                 preTestPreparations: serviceData.preTestPreparations,
//                 expectedResultDuration: serviceData.expectedResultDuration,
//                 description: serviceData.description,
//                 ...(serviceImageUrl && { serviceImageUrl }), // Add image URL only if it exists
//             };
//             const updatedService = await updateService(id, completeServiceData);
//             return updatedService;
//         } catch (error) {
//             console.error("Error in editing service:", error);
//             throw new Error("Failed to edit service data");
//         }
//     },
//     getServiceList: async () => {
//         try {
//             const services = await getAllServicesWithCategoryDetails();
//             return services;
//         } catch (error) {
//             console.error("Error fetching service list:", error);
//             throw new Error("Error fetching service list");
//         }
//     },
//     toggleService: async (id: string) => {
//         try {
//             const toggleStatus = await toggleServiceByID(id);
//             return toggleStatus;
//         } catch (error) {
//             console.error("Error toggling service :", error);
//             throw new Error("Error toggling service");
//         }
//     },
// }
const mongoServiceRepository_1 = __importDefault(require("../../../infrastructure/repositories/mongoServiceRepository"));
const s3Uploader_1 = require("../../../utils/s3Uploader");
exports.default = {
    // ##-USER--##
    getServiceData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield mongoServiceRepository_1.default.getService(id);
            }
            catch (error) {
                console.error("Error fetching service data:", error);
                throw new Error("Failed to fetch service data");
            }
        });
    },
    getServiceListUser(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield mongoServiceRepository_1.default.getPaginatedServices(page, limit);
            }
            catch (error) {
                console.error("Error fetching service list:", error);
                throw new Error("Failed to fetch service list");
            }
        });
    },
    // ##-ADMIN--##
    addServiceData(serviceData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { Location } = yield (0, s3Uploader_1.uploadToS3)(serviceData.serviceImage);
                const completeServiceData = Object.assign(Object.assign({}, serviceData), { serviceImageUrl: Location });
                return yield mongoServiceRepository_1.default.saveService(completeServiceData);
            }
            catch (error) {
                console.error("Error adding service data:", error);
                throw new Error("Failed to add service data");
            }
        });
    },
    editServiceData(id, serviceData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let serviceImageUrl = null;
                if (serviceData.serviceImage) {
                    const { Location } = yield (0, s3Uploader_1.uploadToS3)(serviceData.serviceImage);
                    serviceImageUrl = Location;
                }
                const completeServiceData = Object.assign(Object.assign({}, serviceData), (serviceImageUrl && { serviceImageUrl }));
                return yield mongoServiceRepository_1.default.updateService(id, completeServiceData);
            }
            catch (error) {
                console.error("Error editing service data:", error);
                throw new Error("Failed to edit service data");
            }
        });
    },
    getServiceList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield mongoServiceRepository_1.default.getAllServicesWithCategoryDetails();
            }
            catch (error) {
                console.error("Error fetching service list:", error);
                throw new Error("Failed to fetch service list");
            }
        });
    },
    toggleService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield mongoServiceRepository_1.default.toggleServiceByID(id);
            }
            catch (error) {
                console.error("Error toggling service:", error);
                throw new Error("Failed to toggle service availability");
            }
        });
    },
};
