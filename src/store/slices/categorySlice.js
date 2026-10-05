import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { getCategories } from "../../services/categoryService";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, thunkAPI) => {
    try {
      return await getCategories();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch categories"
      );
    }
  }
);

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchCategories.fulfilled,
        (state, action) => {
          state.loading = false;
          state.categories = action.payload;
        }
      )

      .addCase(
        fetchCategories.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default categorySlice.reducer;