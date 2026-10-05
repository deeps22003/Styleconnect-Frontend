import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";

// Async Thunks
export const fetchAppointmentsThunk = createAsyncThunk(
  "appointments/fetchAppointments",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiClient.getAppointments(userId);
      return Array.isArray(response) ? response : response?.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createBookingThunk = createAsyncThunk(
  "appointments/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await apiClient.createAppointment(bookingData);
      return response?.data || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAppointmentThunk = createAsyncThunk(
  "appointments/updateAppointment",
  async ({ appointmentId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.updateAppointment(appointmentId, updatedData);
      return response?.data || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAppointmentStatusThunk = createAsyncThunk(
  "appointments/updateAppointmentStatus",
  async ({ appointmentId, status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.updateAppointmentStatus(appointmentId, status);
      return response?.data || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial State
const initialState = {
  items: [],
  loading: false,
  error: null,
  selectedAppointment: null,
};

// Slice
const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedAppointment: (state, action) => {
      state.selectedAppointment = action.payload;
    },
    clearSelectedAppointment: (state) => {
      state.selectedAppointment = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Appointments
    builder
      .addCase(fetchAppointmentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAppointmentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Booking
    builder
      .addCase(createBookingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookingThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createBookingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Appointment
    builder
      .addCase(updateAppointmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (item) => item.appointmentId === action.payload.appointmentId || item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateAppointmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Appointment Status
    builder
      .addCase(updateAppointmentStatusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointmentStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (item) => item.appointmentId === action.payload.appointmentId || item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateAppointmentStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setSelectedAppointment, clearSelectedAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;
