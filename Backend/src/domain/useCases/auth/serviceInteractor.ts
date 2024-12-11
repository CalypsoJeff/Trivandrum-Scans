import { getPaginatedServices, getService } from "../../../infrastructure/repositories/mongoServiceRepository";
import {
    IServiceRequest,
    IServiceResponse,
} from "../../entities/types/serviceType";
import { getAllServicesWithCategoryDetails, saveService, toggleServiceByID, updateService } from "../../../infrastructure/repositories/mongoServiceRepository";
import { uploadToS3 } from "../../../utils/s3Uploader";

export default {

    // ##-USER--##//
    getServiceData: async (id: string) => {
        const service = await getService(id);
        return service;
    },
    getServiceListUser: async (page: number, limit: number) => {
        try {
            const services = await getPaginatedServices(page, limit); // Update to use the new function
            return services;
        } catch (error) {
            console.error("Error fetching service list:", error);
            throw new Error("Error fetching service list");
        }
    },

    // ##-ADMIN--##//
    addServiceData: async (
        serviceData: IServiceRequest
    ): Promise<IServiceResponse> => {
        const {
            name,
            price,
            category,
            preTestPreparations,
            expectedResultDuration,
            description,
            serviceImage,
        } = serviceData;
        const serviceDataResult = await uploadToS3(serviceImage);
        const serviceImageUrl = serviceDataResult.Location;
        const completeServiceData = {
            name,
            price,
            category,
            preTestPreparations,
            expectedResultDuration,
            description,
            serviceImageUrl,
        };
        const savedService = await saveService(completeServiceData);
        return savedService;
    },
    editServiceData: async (
        id: string,
        serviceData: IServiceRequest
    ): Promise<IServiceResponse> => {
        try {
            let serviceImageUrl = null;
            if (serviceData.serviceImage) {
                const serviceDataResult = await uploadToS3(serviceData.serviceImage);
                serviceImageUrl = serviceDataResult.Location; // S3 image URL
            }
            const completeServiceData = {
                name: serviceData.name,
                price: serviceData.price,
                category: serviceData.category,
                preTestPreparations: serviceData.preTestPreparations,
                expectedResultDuration: serviceData.expectedResultDuration,
                description: serviceData.description,
                ...(serviceImageUrl && { serviceImageUrl }), // Add image URL only if it exists
            };
            const updatedService = await updateService(id, completeServiceData);
            return updatedService;
        } catch (error) {
            console.error("Error in editing service:", error);
            throw new Error("Failed to edit service data");
        }
    },
    getServiceList: async () => {
        try {
            const services = await getAllServicesWithCategoryDetails();
            return services;
        } catch (error) {
            console.error("Error fetching service list:", error);
            throw new Error("Error fetching service list");
        }
    },
    toggleService: async (id: string) => {
        try {
            const toggleStatus = await toggleServiceByID(id);
            return toggleStatus;
        } catch (error) {
            console.error("Error toggling service :", error);
            throw new Error("Error toggling service");
        }
    },

}