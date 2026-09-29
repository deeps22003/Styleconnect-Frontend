import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllExperts } from "../../services/expertService";

export const fetchExperts = createAsyncThunk(
  "experts/fetchExperts",
  async (_, thunkAPI) => {
    try {
      return await getAllExperts();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch experts"
      );
    }
  }
);

const expertSlice = createSlice({
  name: "experts",

  initialState: {
    experts: [],
    selectedExpert:null,
    bookingIntent:false,
    loading: false,
    error: null,
  },

 reducers: {
  setSelectedExpert: (state, action) => {
    state.selectedExpert = action.payload;
  },

  setBookingIntent: (state, action) => {
    state.bookingIntent = action.payload;
  },

  clearBookingFlow: (state) => {
    state.selectedExpert = null;
    state.bookingIntent = false;
  },
},

  extraReducers: (builder) => {
    builder
      .addCase(fetchExperts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchExperts.fulfilled, (state, action) => {
        state.loading = false;
        state.experts = action.payload.data;
      })

      .addCase(fetchExperts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedExpert,
  setBookingIntent,
  clearBookingFlow,
}=expertSlice.actions

export default expertSlice.reducer;