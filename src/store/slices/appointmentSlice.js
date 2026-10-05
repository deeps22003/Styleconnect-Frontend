import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createOrUpdateAppointment,
  getAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} from '../../services/appointmentService';

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

// Fetch appointments
export const fetchAppointmentsThunk = createAsyncThunk(
  "appointments/fetchAppointments",
  async (payload, { rejectWithValue }) => {
    try {
      let userType = 1;
      let userId = payload;

      if (typeof payload === "object" && payload !== null) {
        userType =
          payload.userType === "Expert" || payload.userType === 0
            ? 0
            : 1;

        userId = payload.userId;
      }

      const response = await getAppointments(userType, userId);

      console.log("Appointments API Success:", response);

      return response;
      // return await getAppointments(userType, userId);
    } catch (error) {
        console.log("Appointments Error:", error);
        console.log("Error Response:", error.response);
        console.log("Error Data:", error.response?.data);

        return rejectWithValue(
          formatErrorMessage(error, "Failed to fetch appointments")
        );
      }
  }
);

// Create Booking
export const createBookingThunk = createAsyncThunk(
  "appointments/createBooking",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("REQUEST PAYLOAD", payload);

      const response = await createOrUpdateAppointment(payload);

      return response;
    } catch (error) {
      console.log("API ERROR:", error);
      console.log("API ERROR RESPONSE:", error.response);
      console.log("API ERROR DATA:", error.response?.data);

      return rejectWithValue(
        error.response?.data ||
          error.message ||
          "Failed to create booking"
      );
    }
  }
);

// Alias
export const createAppointmentThunk = createBookingThunk;

// Update Appointment
export const updateAppointmentThunk = createAsyncThunk(
  "appointments/updateAppointment",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await createOrUpdateAppointment(
        payload
      );

      return response;
    } catch (error) {
      return rejectWithValue(
        formatErrorMessage(
          error,
          "Failed to update appointment"
        )
      );
    }
  }
);

// Cancel Appointment
export const cancelAppointmentThunk = createAsyncThunk(
  "appointments/cancelAppointment",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response =
        await cancelAppointment(
          appointmentId
        );

      return {
        appointmentId,
        response,
      };
    } catch (error) {
      return rejectWithValue(
        formatErrorMessage(
          error,
          "Failed to cancel appointment"
        )
      );
    }
  }
);

// Update Appointment Status
export const updateAppointmentStatusThunk =
  createAsyncThunk(
    "appointments/updateStatus",
    async (
      {
        appointmentId,
        status,
        appointmentStatusId,
      },
      { rejectWithValue }
    ) => {
      try {
        const rawStatus =
          appointmentStatusId ?? status;

        const targetStatusId =
          getStatusId(rawStatus);

        let response;

        if (targetStatusId === 3) {
          response =
            await cancelAppointment(
              appointmentId
            );
        } else {
          response =
            await updateAppointmentStatus(
              appointmentId,
              {
                appointmentStatusId:
                  targetStatusId,
              }
            );
        }

        return {
          appointmentId,
          status:
            typeof status === "string"
              ? status
              : getStatusName(
                  targetStatusId
                ),
          appointmentStatusId:
            targetStatusId,
          response,
        };
      } catch (error) {
        return rejectWithValue(
          formatErrorMessage(
            error,
            "Failed to update status"
          )
        );
      }
    }
  );

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(fetchAppointmentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAppointmentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Booking
      .addCase(createBookingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookingThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(createBookingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Appointment Details
      .addCase(updateAppointmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        const targetId = action.payload?.appointmentId || action.payload?.id;
        const index = state.items.findIndex(
          (item) => (item.appointmentId || item.id) === targetId
        );
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
      })
      .addCase(updateAppointmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel Appointment
      .addCase(cancelAppointmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelAppointmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { appointmentId } = action.payload;
        const target = state.items.find(
          (item) => (item.appointmentId || item.id) === appointmentId
        );
        if (target) {
          target.status = 'Declined';
          target.statusName = 'Declined';
          target.appointmentStatusName = 'Declined';
          target.appointmentStatusId = 3;
        }
      })
      .addCase(cancelAppointmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Status (Confirm / Decline / Complete)
      .addCase(updateAppointmentStatusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointmentStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { appointmentId, status, appointmentStatusId } = action.payload;
        const target = state.items.find(
          (item) => (item.appointmentId || item.id) === appointmentId
        );
        if (target) {
          const finalStatusId = typeof appointmentStatusId === 'number' 
            ? appointmentStatusId 
            : getStatusId(status);
            
          const resolvedStatusName = getStatusName(finalStatusId);

          target.appointmentStatusId = finalStatusId;
          target.status = resolvedStatusName;
          target.statusName = resolvedStatusName;
          target.appointmentStatusName = resolvedStatusName;
        }
      })
      .addCase(updateAppointmentStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer;