import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { getRoles } from "../../services/roleService";

export const fetchRoles = createAsyncThunk(
  "roles/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      return await getRoles();
    } catch (error) {
    return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Request failed"
    );
}

  }
);

const roleSlice = createSlice({
  name: "roles",

  initialState: {
    roles: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })

      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default roleSlice.reducer;