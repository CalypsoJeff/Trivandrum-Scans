import {
  checkExistingUser,
  createUser,
  getStoredOTP,
  getUserbyEMail,
  saveOtp,
  verifyUserDb,
} from "../../../infrastructure/repositories/mongoUserRepository";
import sendOTPEmail from "../../../utils/emailUtils";
import { generateOTP } from "../../../utils/otpUtils";
import { IUser } from "../../entities/types/userType";
import { Encrypt } from "../../helper/hashPassword";
import { generateToken } from "../../helper/jwtHelper";

export default {
  registerUser: async (userData: IUser) => {
    console.log("UserData usecase");
    try {
      if (!userData.email || !userData.name) {
        throw new Error("Email and name are required");
      }

      const existingUser = await checkExistingUser(
        userData.email,
        userData.name
      );
      if (existingUser && existingUser.is_verified == true) {
        throw new Error("User already exists");
      }
      const otp = await generateOTP();
      console.log(`OTP: ${otp}`);

      const generatedAt = Date.now();
      await sendOTPEmail(userData.email, otp, userData.name);
      const savedOtp = await saveOtp(userData.email, otp, generatedAt);
      const password = userData.password as string;
      const hashedPassword = await Encrypt.cryptPassword(password);
      const savedUser = await createUser(userData, hashedPassword);
      console.log(savedUser);
      return savedUser;
    } catch (error: any) {
      throw error;
    }
  },

  verifyUser: async (data: { otp: string; email: string }) => {
    console.log("body ", data);
    if (!data.otp) {
      throw new Error("no otp");
    }
    const storedOTP = await getStoredOTP(data.email);
    console.log("Stored OTP: ", storedOTP);
    if (!storedOTP || storedOTP.otp !== data.otp) {
      console.log("invalid otp");
      throw new Error("Invalid Otp");
    }
    const otpGeneratedAt = storedOTP.generatedAt;
    const currentTime = Date.now();
    const otpAge = currentTime - otpGeneratedAt.getTime();
    const expireOTP = 1 * 60 * 1000;
    if (otpAge > expireOTP) {
      throw new Error("OTP Expired");
    }
    return await verifyUserDb(data.email);
  },
  otpResend:async(email:string) => {
    try {
        const newotp = await generateOTP();
        const generatedAt = Date.now();
        const users = await getUserbyEMail(email)
        if(users && users.name){
            await sendOTPEmail(email, newotp, users.name)
            console.log('newOtp:',newotp);
            
            await saveOtp(email,newotp,generatedAt)
        }else{
            throw new Error('Please signup again')
        }
        
    } catch (error) {
        throw new Error('Failed to resend otp')
    }
},
loginUser: async(email:string, password:string) => {
    const existingUser = await getUserbyEMail(email);
    if(!existingUser || !existingUser.password){
        throw new Error('User not found');
    }
    const isValid = await Encrypt.comparePassword(password , existingUser.password);
    if (!isValid) {
        throw new Error("Invalid password");
    }
    if(existingUser && existingUser.is_blocked){
        throw new Error('Account is Blocked');
    }
    if(existingUser.is_verified == false){
        throw new Error(`User is not verified.Register!`)
    }

    const {token,refreshToken} = await generateToken(existingUser.id , email)
    const user = {
        id:existingUser.id,
        name:existingUser.name,
        email:existingUser.email,
        isBlocked:existingUser.is_blocked
    }
    return {token,user,refreshToken}
},


};
