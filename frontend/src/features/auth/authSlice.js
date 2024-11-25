import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import authService from "./authService";
import Cookies from "js-cookie";
import { toast } from "sonner";
import axiosInstanceUser from "../../api/middlewares/axiosInstanceUser";
const API_URL = "http://localhost:5000/api/users";

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, userData);
      return response.data;
    } catch (error) {
      if (error.response.status === 409) {
        return rejectWithValue("User already exists");
      } else {
        return rejectWithValue(error.response.data);
      }
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.login(userData);
      Cookies.set("token", response.data.response.token);
      Cookies.set("refreshToken", response.data.response.refreshToken);
      return response.data;
    } catch (error) {
      console.log("Login slice error", error);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const GoogleAuth = createAsyncThunk(
  "auth/GoogleAuth",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/googleAuth`, userData);
      Cookies.set("token", response.data.response.token);
      Cookies.set("refreshToken", response.data.response.refreshToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/reset-password`, {
        token,
        password,
      });
      toast.success("Password reset successfully");
      return response.data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      toast.error(message || "Failed to reset password");
      return rejectWithValue(message);
    }
  }
);

export const clearUser = createAsyncThunk(
  "auth/clearUser",
  async (_, { dispatch }) => {
    dispatch(logoutUser());
    Cookies.remove("token");
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstanceUser.post("/checkAuth");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ userId, name, address, mobile, age }, { rejectWithValue }) => {
    try {
      const response = await axiosInstanceUser.put(`/updateuser/${userId}`, {
        name,
        address,
        mobile,
        age,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logoutUser(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.response.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : "Login failed";
      })
      .addCase(GoogleAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GoogleAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.response.user;
      })
      .addCase(GoogleAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? action.payload.message
          : "Password Reset failed";
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, logoutUser } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export default authSlice.reducer;
