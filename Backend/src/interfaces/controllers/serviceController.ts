import { Request, Response } from "express";
import serviceInteractor from "../../domain/useCases/auth/serviceInteractor";
// import { Service } from "../../infrastructure/database/dbModel/serviceModel";



export default {

  // ##-USER--##//

  getServiceDetail: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const fetchedServiceDetail = await serviceInteractor.getServiceData(id);
      res.status(200).json(fetchedServiceDetail);
    } catch (error) {
      console.error("Error fetching service detail :", error);
      res.status(500).json();
    }
  },
  getServices: async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const serviceList = await serviceInteractor.getServiceListUser(
        Number(page),
        Number(limit)
      );
      res.status(200).json(serviceList);
    } catch (error) {
      console.error("Failed to retrieve services", error);
      res.status(500).json({ message: "Failed to retrieve services" });
    }
  },

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
  addService: async (req: Request, res: Response) => {
    try {
      const {
        name,
        price,
        category,
        preTestPreparations,
        expectedResultDuration,
        description,
      } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const serviceImage = files?.serviceImage?.[0];
      if (!serviceImage) {
        console.error("Service Image is missing.");
        return res
          .status(400)
          .json({ message: "License document is required" });
      }
      const serviceData = {
        name, price, category, preTestPreparations, expectedResultDuration, description, serviceImage,
      };
      const result = await serviceInteractor.addServiceData(serviceData);
      res.status(200).json({ message: "Service added successfully", result });
    } catch (error) {
      console.error("Failed to add service", error);
      res.status(500).json({ message: "Failed to add service" });
    }
  },
  editService: async (req: Request, res: Response) => {
    try {
      const { id } = req.params; // Get the service ID from the URL parameters
      const { name, price, category, preTestPreparations, expectedResultDuration, description, } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const serviceImage = files?.serviceImage?.[0];
      const serviceData = {
        name,
        price,
        category,
        preTestPreparations,
        expectedResultDuration,
        description,
        ...(serviceImage && { serviceImage }), // Add only if image is provided
      };
      const result = await serviceInteractor.editServiceData(id, serviceData);
      res.status(200).json({ message: "Service edited successfully", result });
    } catch (error) {
      console.error("Failed to edit service", error);
      res.status(500).json({ message: "Failed to edit service" });
    }
  },
  getServicesAdmin: async (req: Request, res: Response) => {
    try {
      const serviceList = await serviceInteractor.getServiceList(
      );
      res.status(200).json(serviceList);
    } catch (error) {
      console.error("Failed to retrieve services", error);
      res.status(500).json({ message: "Failed to retrieve services" });
    }
  },
  toggleService: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const toggled = serviceInteractor.toggleService(id);
      res.status(200).json(toggled);
    } catch (error) {
      console.error("Failed to toggle services", error);
      res.status(500).json({ message: "Failed to toggle services" });
    }
  },
}