// import { findAdmin } from "../../../infrastructure/repositories/mongoAdminRepository";
// import { io } from '../../../server';
// import { Encrypt } from "../../helper/hashPassword";
// import { generateToken } from "../../helper/jwtHelper";
// import { successMessagetoUser } from "../../../infrastructure/repositories/mongoUserRepository";

// export default {
//   loginAdmin: async (cred: { email: string; password: string }) => {
//     try {
//       const admin = await findAdmin(cred.email);
//       if (!admin || !admin.password) {
//         throw new Error("Admin not found or password is missing");
//       }
//       const isValid = await Encrypt.comparePassword(
//         cred.password,
//         admin.password
//       );
//       if (!isValid) {
//         throw new Error("Invalid password");
//       }
//       const role = "admin";
//       const tokenData = await generateToken(admin.id, cred.email, role);
//       return {
//         admin,
//         token: tokenData.token,
//         refreshToken: tokenData.refreshToken,
//       };
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         console.error(`Error: ${error.message}`);
//         throw error;
//       } else {
//         console.error("An unknown error occurred");
//         throw new Error("An unknown error occurred");
//       }
//     }
//   },
//   successMessage: async (chatId: string, content: string) => {
//     const newMessage = await successMessagetoUser(chatId, content);
//     io.to(chatId).emit("receiveMessage", newMessage);
//     return newMessage;
//   }
// };



import AdminRepository from "../../../infrastructure/repositories/mongoAdminRepository";
import UserRepository from "../../../infrastructure/repositories/mongoUserRepository";
import { io } from '../../../server';
import { Encrypt } from "../../helper/hashPassword";
import { generateToken } from "../../helper/jwtHelper";

export default {
  /**
   * Login Admin
   * @param cred - Admin credentials
   * @returns Admin details with tokens
   */
  loginAdmin: async (cred: { email: string; password: string }) => {
    try {
      const admin = await AdminRepository.findAdmin(cred.email);
      if (!admin || !admin.password) {
        throw new Error("Admin not found or password is missing");
      }
      const isValid = await Encrypt.comparePassword(
        cred.password,
        admin.password
      );
      if (!isValid) {
        throw new Error("Invalid password");
      }
      const role = "admin";
      const tokenData = await generateToken(admin.id, cred.email, role);
      return {
        admin,
        token: tokenData.token,
        refreshToken: tokenData.refreshToken,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
        throw error;
      } else {
        console.error("An unknown error occurred");
        throw new Error("An unknown error occurred");
      }
    }
  },
  /**
   * Send Success Message
   * @param chatId - Chat room ID
   * @param content - Message content
   * @returns New message
   */
  successMessage: async (chatId: string, content: string) => {
    const newMessage = await UserRepository.successMessagetoUser(chatId, content);
    io.to(chatId).emit("receiveMessage", newMessage);
    return newMessage;
  }
};
