import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const bookAppointment = createAsyncThunk(
  "booking/bookAppointment",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/booking",
        bookingData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create the booking slice
const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    selectedDate: null,
  },
  reducers: {
    setSelectedDate(state, action) {
      state.selectedDate = action.payload;
    },
    clearSelectedDate(state) {
      state.selectedDate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bookAppointment.pending, (state) => {
        state.bookingStatus = "loading";
      })
      .addCase(bookAppointment.fulfilled, (state) => {
        state.bookingStatus = "succeeded";
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.bookingStatus = "failed";
        state.bookingError = action.payload;
      });
  },
});

// Export the actions and reducer
export const { setSelectedDate, clearSelectedDate } = bookingSlice.actions;
export default bookingSlice.reducer;
