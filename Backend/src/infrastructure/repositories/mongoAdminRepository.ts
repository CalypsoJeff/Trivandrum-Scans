import { Admin } from "../database/dbModel/adminModel";

// Find Admin by Email
export const findAdmin = async (email: string) => {
  return await Admin.findOne({ email });
};
