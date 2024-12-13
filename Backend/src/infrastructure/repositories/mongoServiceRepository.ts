import { IServiceResponse } from "../../domain/entities/types/serviceType";
import { Service } from "../database/dbModel/serviceModel";
import { Category } from "../database/dbModel/categoryModel";
class ServiceRepository {
  // ##-ADMIN--##
  async saveService(completeServiceData: IServiceResponse) {
    const service = new Service(completeServiceData);
    return await service.save();
  }
  async updateService(id: string, completeServiceData: IServiceResponse) {
    try {
      const existingService = await Service.findById(id);
      if (!existingService) {
        throw new Error("Service not found");
      }
      Object.assign(existingService, completeServiceData);
      return await existingService.save();
    } catch (error) {
      console.error("Error updating service:", error);
      throw new Error("Failed to update service");
    }
  }
  async getAllServicesWithCategoryDetails() {
    try {
      const services = await Service.find().lean();
      return {
        services: await Promise.all(
          services.map(async (service) => {
            const category = await Category.findById(service.category, "_id name").lean().exec();
            return {
              ...service,
              _id: service._id.toString(),
              category: category
                ? { _id: category._id.toString(), name: category.name }
                : { _id: "Unknown", name: "Unknown" },
            };
          })
        ),
      };
    } catch (error) {
      console.error("Error fetching all services:", error);
      throw new Error("Error fetching all services");
    }
  }
  async toggleServiceByID(id: string) {
    try {
      const service = await Service.findById(id);
      if (!service) {
        throw new Error("Service not found");
      }
      service.isAvailable = !service.isAvailable;
      return await service.save();
    } catch (error) {
      console.error("Error toggling service availability:", error);
      throw new Error("Error toggling service availability");
    }
  }
  // ##-USER--##
  async getService(id: string) {
    try {
      return await Service.findById(id).populate("category");
    } catch (error) {
      console.error("Error fetching service data:", error);
      throw new Error("Error fetching service data");
    }
  }
  async getPaginatedServices(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;
      const services = await Service.find({ isAvailable: true }).skip(skip).limit(limit).lean().exec();
      const totalServices = await Service.countDocuments();
      const totalPages = Math.ceil(totalServices / limit);
      return {
        services: await Promise.all(
          services.map(async (service) => {
            const category = await Category.findById(service.category, "_id name").lean().exec();
            return {
              ...service,
              _id: service._id.toString(),
              category: category
                ? { _id: category._id.toString(), name: category.name }
                : { _id: "Unknown", name: "Unknown" },
            };
          })
        ),
        totalPages,
        currentPage: page,
      };
    } catch (error) {
      console.error("Error fetching paginated services:", error);
      throw new Error("Error fetching paginated services");
    }
  }
}
export default new ServiceRepository();
