// import { getPaginatedServices, getService } from "../../../infrastructure/repositories/mongoServiceRepository";
// import {
//     IServiceRequest,
//     IServiceResponse,
// } from "../../entities/types/serviceType";
// import { getAllServicesWithCategoryDetails, saveService, toggleServiceByID, updateService } from "../../../infrastructure/repositories/mongoServiceRepository";
// import { uploadToS3 } from "../../../utils/s3Uploader";

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



import ServiceRepository from "../../../infrastructure/repositories/mongoServiceRepository";
import { IServiceRequest, IServiceResponse } from "../../entities/types/serviceType";
import { uploadToS3 } from "../../../utils/s3Uploader";

export default {
  // ##-USER--##
  async getServiceData(id: string) {
    try {
      return await ServiceRepository.getService(id);
    } catch (error) {
      console.error("Error fetching service data:", error);
      throw new Error("Failed to fetch service data");
    }
  },

  async getServiceListUser(page: number, limit: number) {
    try {
      return await ServiceRepository.getPaginatedServices(page, limit);
    } catch (error) {
      console.error("Error fetching service list:", error);
      throw new Error("Failed to fetch service list");
    }
  },

  // ##-ADMIN--##
  async addServiceData(serviceData: IServiceRequest): Promise<IServiceResponse> {
    try {
      const { Location } = await uploadToS3(serviceData.serviceImage);
      const completeServiceData = {
        ...serviceData,
        serviceImageUrl: Location,
      };
      return await ServiceRepository.saveService(completeServiceData);
    } catch (error) {
      console.error("Error adding service data:", error);
      throw new Error("Failed to add service data");
    }
  },

  async editServiceData(id: string, serviceData: IServiceRequest): Promise<IServiceResponse> {
    try {
      let serviceImageUrl = null;
      if (serviceData.serviceImage) {
        const { Location } = await uploadToS3(serviceData.serviceImage);
        serviceImageUrl = Location;
      }

      const completeServiceData = {
        ...serviceData,
        ...(serviceImageUrl && { serviceImageUrl }),
      };

      return await ServiceRepository.updateService(id, completeServiceData);
    } catch (error) {
      console.error("Error editing service data:", error);
      throw new Error("Failed to edit service data");
    }
  },

  async getServiceList() {
    try {
      return await ServiceRepository.getAllServicesWithCategoryDetails();
    } catch (error) {
      console.error("Error fetching service list:", error);
      throw new Error("Failed to fetch service list");
    }
  },

  async toggleService(id: string) {
    try {
      return await ServiceRepository.toggleServiceByID(id);
    } catch (error) {
      console.error("Error toggling service:", error);
      throw new Error("Failed to toggle service availability");
    }
  },
};
