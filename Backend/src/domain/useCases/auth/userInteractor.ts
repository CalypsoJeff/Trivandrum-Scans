/* eslint-disable @typescript-eslint/no-explicit-any */
// import { sendOTPEmail, sendVerifyMail } from "../../../utils/emailUtils";
// import { generateOTP } from "../../../utils/otpUtils";
// import { Encrypt } from "../../helper/hashPassword";
// import {
//   generateResetToken,
//   generateToken,
//   validateResetToken,
// } from "../../helper/jwtHelper";
import { IPatientInput } from "../../entities/types/patientType";
import { IUser, PaginatedUsers } from "../../entities/types/userType";
import UserRepository from "../../../infrastructure/repositories/mongoUserRepository";

export default {
  getStatus: async (id: string) => {
    try {
      return await UserRepository.getStatus(id)
    } catch (error: any) {
      console.error(error.message)
      throw error
    }
  },
  editUser: async (id: string, fieldToChange: object) => {
    try {
      const updatedUser = await UserRepository.editUserInDb(id, fieldToChange);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user", error);
      throw new Error("Error updating user");
    }
  },
  addPatient: async (patientData: IPatientInput, userId: string) => {
    try {
      const addedPatient = await UserRepository.addPatientInDb(patientData, userId);
      return addedPatient; // Return the added patient
    } catch (error) {
      console.error("Error in adding patient: ", error);
      throw new Error("Error in adding patient");
    }
  },
  getFamilyData: async (id: string) => {
    try {
      const familyData = UserRepository.getFamilyDataInDb(id);
      return familyData;
    } catch (error) {
      console.error("Error fetching patient: ", error);
      throw new Error("Error fetching patient");
    }
  },
  // ##-ADMIN--##//
  userList: async () => {
    try {
      const users = await UserRepository.getAllUsers();
      return users;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
        throw error;
      }
      throw new Error("An unknown error occurred while fetching user list");
    }
  },
  getUsers: async (page: number, limit: number): Promise<PaginatedUsers> => {
    try {
      const users = await UserRepository.getPaginatedUsers(page, limit);
      return users;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(
        "An unknown error occurred while fetching paginated users"
      );
    }
  },
  updatedUserStatus: async (
    userId: string,
    is_blocked: boolean
  ): Promise<IUser | null> => {
    try {
      const updatedUser = await UserRepository.updateUserStatus(userId, is_blocked);
      return updatedUser;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(
          "An unknown error occurred while updating user status in userInteractor."
        );
      }
    }
  },
  async getUserCount() {
    try {
      // Fetch user count from the repository
      const userCounts = await UserRepository.userCount();
      return userCounts;
    } catch (error) {
      console.error("Error fetching user count in interactor:", error);
      throw new Error("Failed to fetch user count");
    }
  }
}