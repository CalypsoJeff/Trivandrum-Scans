/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import userInteractor from "../../domain/useCases/auth/userInteractor";
import { Users } from "../../infrastructure/database/dbModel/userModel";
import adminInteractor from "../../domain/useCases/auth/adminInteractor";
import { userCount } from "../../infrastructure/repositories/mongoUserRepository";

export default {

  // ##-USER--##//
  getStatus: async (req: Request, res: Response) => {
    try {
      const id = req.query.id as string
      const response = await userInteractor.getStatus(id);
      res.status(200).json({ response })
    } catch (error: any) {

      console.log(error);
      res.status(500).json(error)
    }
  },
  checkAuth: async (req: Request, res: Response) => {
    console.log("Hellooooo checkauth");
  },
  updateUser: async (req: Request, res: Response) => {
    const { name, address, mobile, age } = req.body; // Destructure all fields from the request body
    const { userId } = req.params;
    try {
      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.name = name || user.name;
      user.address = address || user.address;
      user.mobile = mobile || user.mobile;
      user.age = age || user.age;
      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  },
  getUserData: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await Users.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching userdata:", error);
      res.status(500).json({ error: "Error fetching userdata" });
    }
  },
  editUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { fieldToChange } = req.body;
      const editedUser = await userInteractor.editUser(id, fieldToChange);
      res.status(200).json(editedUser);
    } catch (error) {
      console.error("Error updating user data:", error);
      res.status(500).json({ message: "Error updating user data" });
    }
  },
  addPatient: async (req: Request, res: Response) => {
    try {
      const { name, relationToUser, age, gender, contactNumber, userId } =
        req.body;
      const patientData = {
        name,
        relationToUser,
        age,
        gender,
        contactNumber,
        userId,
      };
      const addedPatient = await userInteractor.addPatient(patientData, userId);
      res.status(201).json(addedPatient);
    } catch (error) {
      console.error("Error adding patient data:", error);
      res.status(500).json({ message: "Failed to add patient", error });
    }
  },
  getFamilyData: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json({ message: "id not foundss" });
      }
      const familyData = await userInteractor.getFamilyData(id);
      res.status(200).json(familyData);
    } catch (error) {
      console.error("Error fetching family data:", error);
      res.status(500).json({ message: "Error fetching family data", error });
    }
  },


  // ##-ADMIN--##//
  getUsers: async (req: Request, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const users = await userInteractor.getUsers(Number(page), Number(limit));
      res.status(200).json(users);
    } catch (error: unknown) {
      console.error("Error fetching users:", error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  },

  blockUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const { is_blocked } = req.body;
      const updatedUser = await userInteractor.updatedUserStatus(
        userId,
        is_blocked
      );
      res.status(200).json(updatedUser);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message); // Safely access `message` only if it's an instance of `Error`
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  },
  getUserCount: async (req: Request, res: Response) => {
    try {
      const userCounts = await userCount();
      res.json(userCounts);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  },
};
