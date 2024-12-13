import { Admin } from "../database/dbModel/adminModel";
class AdminRepository {
  /**
   * Find Admin by Email
   * @param email - Admin's email
   * @returns Admin document or null
   */
  async findAdmin(email: string) {
    return await Admin.findOne({ email });
  }
}
export default new AdminRepository();
