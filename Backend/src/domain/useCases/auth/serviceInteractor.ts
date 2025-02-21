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
