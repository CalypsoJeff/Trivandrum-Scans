// export const addCategory =
import END_POINTS from "../../constants/endpoints";
import { getCategoriesService } from '../services/category';

// Fetch all categories
export const getCategories =  () => {
    return  getCategoriesService(END_POINTS.GET_ALL_CATEGORY);
  };