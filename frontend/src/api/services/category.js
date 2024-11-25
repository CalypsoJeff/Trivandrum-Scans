import CONFIG_KEYS from "../../../config";
import axiosInstanceAdmin from "../middlewares/axiosInstanceAdmin";

export const getCategoriesService = async (endpoint) => {
  const response = await axiosInstanceAdmin.get(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}`,
    
  );
  return response.data.categories;
};
