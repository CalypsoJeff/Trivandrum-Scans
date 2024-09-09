import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import authService from './authService';
import Cookies from 'js-cookie'
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/signup', userData);
      console.log(response.data);
      
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
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.login(userData);
      console.log("Login Slice response", response);

      // Set cookies after successful login
      Cookies.set('token', response.data.response.token);
      Cookies.set('refreshToken', response.data.response.refreshToken);

      return response.data;
    } catch (error) {
      console.log("Login slice error", error);
      
      // Handle server errors or custom errors from API
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);


export const clearUser = createAsyncThunk(
  'auth/clearUser',
  async(_,{dispatch}) => {
    dispatch(logoutUser());
    Cookies.remove('token')
  }
)

const authSlice = createSlice({
  name: 'auth',
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
        
      }).addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        console.log("slice login",action);
        state.user = action.payload.response.user; 
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log("slice login eeree",action);
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Login failed';
      });
  },
});

export const { clearError, logoutUser } = authSlice.actions;

export default authSlice.reducer;
