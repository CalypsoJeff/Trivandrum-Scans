import { IUser } from "../../domain/entities/types/userType";
import { Encrypt } from "../../domain/helper/hashPassword";
import OTPModel from "../database/dbModel/otpModel";
import { Users } from "../database/dbModel/userModel";
class AuthRepository {
  async checkExistingUser(email: string, name: string) {
    try {
      return await Users.findOne({
        $and: [{ email: email }, { name: name }],
      });
    } catch (error) {
      throw new Error("Email and Name are required" + error);
    }
  }
  async getUserByEmail(email: string) {
    return await Users.findOne({ email: email });
  }
  async createUser(userData: IUser, hashedPassword: string): Promise<IUser> {
    if (!userData.email || !userData.name) {
      throw new Error("Email and Name are required");
    }
    const existingUser = await this.checkExistingUser(userData.email, userData.name);
    if (existingUser) {
      if (existingUser.is_verified === false) {
        return existingUser;
      }
      throw new Error("User already exists");
    }
    if (!userData.name || !userData.email || !userData.password) {
      throw new Error("Name, Email, and Password are required fields");
    }
    const newUser = new Users({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    });
    return await newUser.save();
  }
  async verifyUser(email: string) {
    return await Users.findOneAndUpdate(
      { email: email },
      { $set: { is_verified: true } },
      { new: true }
    );
  }
  async saveOtp(email: string, otp: string, generatedAt: number) {
    try {
      const otpForStore = new OTPModel({ otp, email, generatedAt });
      return await otpForStore.save();
    } catch (error) {
      console.error("Error saving OTP:", error);
      throw new Error("Error saving OTP");
    }
  }
  async getStoredOtp(email: string) {
    return await OTPModel.findOne({ email: email }).sort({ createdAt: -1 }).limit(1);
  }
  async googleUser(userData: IUser) {
    try {
      if (!userData.email || !userData.name) {
        throw new Error("User data is incomplete");
      }
      const existingUser = await Users.findOne({ email: userData.email });
      if (existingUser) {
        console.log("User already exists:", existingUser);
        return existingUser;
      }
      const generatePass = Math.random().toString(36).slice(-8);
      const hashedPassword = await Encrypt.cryptPassword(generatePass);
      const newUser = new Users({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        is_google: true,
      });
      return await newUser.save();
    } catch (error) {
      console.error("Error in googleUser:", error);
      throw new Error("Error during Google user authentication");
    }
  }
  async resetPassword(email: string, token: string) {
    return await Users.updateOne(
      { email: email },
      { $set: { token: token } }
    );
  }
  async getUserByResetToken(resetToken: string) {
    try {
      return await Users.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: new Date() },
      });
    } catch (error) {
      console.error("Error fetching user by reset token:", error);
      throw new Error("Invalid or expired reset token");
    }
  }
  async updateUserPassword(userId: string, hashedPassword: string) {
    try {
      const user = await Users.findByIdAndUpdate(
        userId,
        { password: hashedPassword },
        { new: true }
      );

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      console.error("Error updating password:", error);
      throw new Error("Error updating password");
    }
  }
}
export default new AuthRepository();
