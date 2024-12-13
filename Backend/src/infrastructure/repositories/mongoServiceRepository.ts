// import { IServiceResponse } from "../../domain/entities/types/serviceType";
// import { Service } from "../database/dbModel/serviceModel";
// import { Category } from "../database/dbModel/categoryModel";



// // ##-ADMIN--##// 


// export const saveService = async (completeServiceData: IServiceResponse) => {
//     const service = new Service(completeServiceData);
//     return await service.save();
// };

// export const updateService = async (
//     id: string,
//     completeServiceData: IServiceResponse
// ) => {
//     try {
//         // Find the service by its ID
//         const existingService = await Service.findById(id);
//         if (!existingService) {
//             throw new Error("Service not found");
//         }

//         // Update the service fields
//         Object.assign(existingService, completeServiceData);

//         // Save the updated service
//         const updatedService = await existingService.save();

//         return updatedService;
//     } catch (error) {
//         console.error("Error updating service:", error);
//         throw new Error("Failed to update service");
//     }
// };

// export const getAllServicesWithCategoryDetails = async () => {
//     try {
//         // Fetch all services
//         const services = await Service.find().lean();

//         // Fetch category details for each service
//         const servicesWithCategoryDetails = await Promise.all(
//             services.map(async (service) => {
//                 const category = await Category.findById(service.category, "_id name")
//                     .lean()
//                     .exec(); // Fetch both ID and name
//                 return {
//                     ...service,
//                     _id: service._id.toString(), // Convert service _id to string
//                     category: category
//                         ? {
//                             _id: category._id.toString(), // Convert category _id to string
//                             name: category.name,
//                         }
//                         : { _id: "Unknown", name: "Unknown" }, // Default if category not found
//                 };
//             })
//         );

//         return {
//             services: servicesWithCategoryDetails,
//         };
//     } catch (error) {
//         console.error("Error fetching all services:", error);
//         throw new Error("Error fetching all services");
//     }
// };

// export const toggleServiceByID = async (id: string) => {
//     try {
//         const service = await Service.findById(id);
//         if (!service) {
//             throw new Error("Service not found");
//         }
//         // Toggle the availability status
//         service.isAvailable = !service.isAvailable;
//         return await service.save();
//     } catch (error) {
//         console.error("Error toggling services:", error);
//         throw new Error("Error toggling services");
//     }
// };

// // ##-USER--##// 

// export const getService = async (id: string) => {
//     try {
//         const serviceData = await Service.findById(id).populate("category");
//         return serviceData;
//     } catch (error) {
//         console.error("Error fetching service data from db", error);
//         throw new Error("Error fetching service data from db");
//     }
// };
// export const getPaginatedServices = async (page: number, limit: number) => {
//     try {
//         // Fetch services without population
//         const services = await Service.find({ isAvailable: true })
//             .skip((page - 1) * limit)
//             .limit(limit)
//             .lean()
//             .exec();

//         const totalServices = await Service.countDocuments();
//         const totalPages = Math.ceil(totalServices / limit);

//         // For each service, fetch category name and id using category ID
//         const servicesWithCategoryDetails = await Promise.all(
//             services.map(async (service) => {
//                 const category = await Category.findById(service.category, "_id name")
//                     .lean()
//                     .exec(); // Fetch both ID and name
//                 return {
//                     ...service,
//                     _id: service._id.toString(), // Convert service _id to string
//                     category: category
//                         ? {
//                             _id: category._id.toString(), // Convert category _id to string
//                             name: category.name,
//                         }
//                         : { _id: "Unknown", name: "Unknown" }, // Default if category not found
//                 };
//             })
//         );
//         return {
//             services: servicesWithCategoryDetails,
//             totalPages,
//             currentPage: page,
//         };
//     } catch (error) {
//         console.error("Error fetching paginated services:", error);
//         throw new Error("Error fetching paginated services");
//     }
// };



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
