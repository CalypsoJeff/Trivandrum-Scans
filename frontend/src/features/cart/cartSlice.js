import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstanceUser from "../../api/middlewares/axiosInstanceUser";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (cartData, { rejectWithValue }) => {
    try {
      const response = await axiosInstanceUser.post("/cart/add", cartData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, serviceId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstanceUser.post("/cart/remove", {
        userId,
        serviceId,
      });
      return response.data; // Return updated cart
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    user: null,
    loading: false,
    error: null,
    cart: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder;
  },
});
// export const { xc } = cartSlice.actions;

export default cartSlice.reducer;
