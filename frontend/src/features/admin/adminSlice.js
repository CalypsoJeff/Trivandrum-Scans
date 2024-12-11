import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import adminService from "./adminService";
import axiosInstanceAdmin from "../../api/middlewares/axiosInstanceAdmin";

export const loginAdmin = createAsyncThunk(
  "admin/loginAdmin",
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await adminService.adminLogin(adminData);
      Cookies.set("admintoken", response.response.token);
      Cookies.set("adminRefreshtoken", response.response.refreshToken);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async () => {
  const response = await axios.get(
    // "http://localhost:5000/api/admin/userlist"
    "http://localhost:5000/api/admin/userlist"
  );
  return response.data;
});
export const fetchCategories = createAsyncThunk(
  "admin/fetchCategories",
  async () => {
    const response = await axios.get(
      // "http://localhost:5000/api/admin/categoryList"
      "http://localhost:5000/api/admin/categoryList"
    );
    return response.data;
  }
);

export const toggleUserStatus = createAsyncThunk(
  "admin/toggleUserStatus",
  async ({ userId, isBlocked }) => {
    const response = await axios.post(
      // "http://localhost:5000/api/admin/block-user",
      "http://localhost:5000/api/admin/block-user",

      { userId, is_blocked: isBlocked }
    );
    return response.data;
  }
);
export const addDepartment = createAsyncThunk(
  "admin/addDepartment",
  async (departmentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstanceAdmin.post(
        "/add-Department",
        departmentData
      );
      return response.data.Department;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editDepartment = createAsyncThunk(
  "admin/editDepartment",
  async (departmentData, { rejectWithValue }) => {
    const { _id, ...data } = departmentData;
    try {
      const response = await axiosInstanceAdmin.put(
        `/edit-department/${_id}`,
        data
      );
      return response.data.department;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  "admin/deleteDepartment",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstanceAdmin.delete(
        `/delete-department/${id}`
      );
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addCategory = createAsyncThunk(
  "admin/addCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axiosInstanceAdmin.post(
        "/add-category",
        categoryData
      );
      console.log(response.data, "in add slice response");
      return response.data.category;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editCategory = createAsyncThunk(
  "admin/editCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const { id, ...data } = categoryData;
      const response = await axiosInstanceAdmin.put(
        `/edit-category/${id}`,
        data
      );
      console.log(response.data, "in edit slice response");
      return response.data.updatedCategory;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "admin/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstanceAdmin.delete(
        `/delete-category/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const addService = createAsyncThunk(
  "admin/addService",
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await adminService.addService(serviceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateService = createAsyncThunk(
  "admin/updateService",
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await adminService.updateService(serviceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const clearAdmin = createAsyncThunk(
  "admin/clearAdmin",
  async (_, { dispatch }) => {
    dispatch(logoutAdmin());
    Cookies.remove("admintoken");
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admin: null,
    status: "idle",
    error: null,
    categories: [],
    categoriesStatus: "idle",
    categoriesError: null,
    departments: [],
    departmentsStatus: "idle",
    departmentsError: null,
    chatRequestCount: 0,
  },
  reducers: {
    logoutAdmin(state) {
      state.admin = null;
      state.loading = false;
      state.error = null;
    },
    setChatRequestCount(state, action) {
      state.chatRequestCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.response.admin;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.admin = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const index = state.admin.findIndex(
          (admin) => admin._id === action.payload._id
        );
        if (index !== -1) {
          state.admin[index] = action.payload;
        }
      })
      .addCase(clearAdmin.fulfilled, (state) => {
        state.admin = null;
      })
      // Add Category
      .addCase(addCategory.pending, (state) => {
        state.categoriesStatus = "loading";
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categoriesStatus = "succeeded";
        state.categories.push(action.payload); // Add the new category to the state
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.categoriesStatus = "failed";
        state.categoriesError = action.payload; // Store the error message
      })
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesStatus = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesStatus = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesStatus = "failed";
        state.categoriesError = action.error.message;
      })
      // Edit Department
      .addCase(editDepartment.pending, (state) => {
        state.departmentsStatus = "loading";
      })
      .addCase(editDepartment.fulfilled, (state, action) => {
        state.departmentsStatus = "succeeded";
        const index = state.departments.findIndex(
          (department) => department._id === action.payload._id
        );
        if (index !== -1) {
          state.departments[index] = action.payload; // Update the department in the state
        }
      })
      .addCase(editDepartment.rejected, (state, action) => {
        state.departmentsStatus = "failed";
        state.departmentsError = action.payload;
      })
      .addCase(deleteDepartment.pending, (state) => {
        state.departmentsStatus = "loading";
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.departmentsStatus = "succeeded";
        state.departments = state.departments.filter(
          (department) => department._id !== action.payload.id
        );
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.departmentsStatus = "failed";
        state.departmentsError = action.payload;
      });
  },
});
export const { logoutAdmin, setChatRequestCount } = adminSlice.actions;
export const selectAdmin = (state) => state.admin.admin;

export default adminSlice.reducer;
