import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/apiClient';

// Helper to extract clean error message string from axios error responses
const formatErrorMessage = (error, defaultMsg) => {
  if (typeof error.response?.data === 'string') {
    return error.response.data;
  }
  
  const data = error.response?.data;
  if (data?.message || data?.title) {
    return data.message || data.title;
  }
  
  if (data?.errors && typeof data.errors === 'object') {
    const firstKey = Object.keys(data.errors)[0];
    if (firstKey && data.errors[firstKey].length > 0) {
      return data.errors[firstKey][0];
    }
  }

  return defaultMsg;
};

// Helper to resolve numerical status ID to human-readable string
const getStatusName = (statusId) => {
  const map = {
    1: 'Pending',
    2: 'Confirmed',
    3: 'Declined',
    4: 'Completed'
  };
  return map[statusId] || 'Pending';
};

// Helper to map status string to numeric ID
const getStatusId = (statusStr) => {
  if (typeof statusStr === 'number') return statusStr;
  if (!statusStr) return 1;

  const lower = String(statusStr).toLowerCase();
  if (lower.includes('confirm')) return 2;
  if (lower.includes('declin') || lower.includes('cancel')) return 3;
  if (lower.includes('complet')) return 4;
  return 1;
};

// 1. Fetch appointments by userType ('Customer' | 'Expert' | 0 | 1) and userId
export const fetchAppointmentsThunk = createAsyncThunk(
  'appointments/fetchAppointments',
  async (payload, { rejectWithValue }) => {
    try {
      let userType = 1; // Default to Customer (1)
      let userId = payload;

      // Handle object payload ({ userType, userId }) or primitive ID payload
      if (typeof payload === 'object' && payload !== null) {
        userType = payload.userType === 'Expert' || payload.userType === 0 ? 0 : 1;
        userId = payload.userId;
      }

      return await apiClient.getAppointmentsByUserTypeAndId(userType, userId);
    } catch (error) {
      return rejectWithValue(formatErrorMessage(error, 'Failed to fetch appointments'));
    }
  }
);

// 2. Create or Update Booking
export const createBookingThunk = createAsyncThunk(
  'appointments/createBooking',
  async (payload, { rejectWithValue }) => {
    try {
      return await apiClient.createOrUpdateAppointment(payload);
    } catch (error) {
      return rejectWithValue(formatErrorMessage(error, 'Failed to create booking'));
    }
  }
);

// Alias for backwards compatibility
export const createAppointmentThunk = createBookingThunk;

// 3. Update appointment details thunk
export const updateAppointmentThunk = createAsyncThunk(
  'appointments/updateAppointment',
  async (payload, { rejectWithValue }) => {
    try {
      return await apiClient.createOrUpdateAppointment(payload);
    } catch (error) {
      return rejectWithValue(formatErrorMessage(error, 'Failed to update appointment'));
    }
  }
);

// 4. Cancel appointment thunk
export const cancelAppointmentThunk = createAsyncThunk(
  'appointments/cancelAppointment',
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await apiClient.cancelAppointment(appointmentId);
      return { appointmentId, response };
    } catch (error) {
      return rejectWithValue(formatErrorMessage(error, 'Failed to cancel appointment'));
    }
  }
);

// 5. Update status thunk (Accept / Decline / Complete)
export const updateAppointmentStatusThunk = createAsyncThunk(
  'appointments/updateStatus',
  async ({ appointmentId, status, appointmentStatusId }, { rejectWithValue }) => {
    try {
      const rawStatus = appointmentStatusId ?? status;
      const targetStatusId = getStatusId(rawStatus);
      let response;

      // Route to cancel endpoint if status is 3 (Cancelled/Declined)
      if (targetStatusId === 3) {
        response = await apiClient.cancelAppointment(appointmentId);
      } else {
        const payload = {
          appointmentStatusId: targetStatusId
        };
        response = await apiClient.updateAppointmentStatus(appointmentId, payload);
      }

      return { 
        appointmentId, 
        status: typeof status === 'string' ? status : getStatusName(targetStatusId), 
        appointmentStatusId: targetStatusId, 
        response 
      };
    } catch (error) {
      return rejectWithValue(formatErrorMessage(error, 'Failed to update status'));
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
