import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
 
import {
  getStates,
  getDistrictsByState,
  getCitiesByDistrict,
  getAreasByCity,
} from "../../services/locationService";
 
export const fetchStates = createAsyncThunk(
  "location/fetchStates",
  async (_, { rejectWithValue }) => {
    try {
      return await getStates();
    } catch (error) {
    return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Request failed"
    );
}

  }
);
 
export const fetchDistrictsByState = createAsyncThunk(
  "location/fetchDistrictsByState",
  async (stateId, { rejectWithValue }) => {
    try {
      return await getDistrictsByState(stateId);
    } catch (error) {
    return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Request failed"
    );
}

  }
);
 
export const fetchCitiesByDistrict = createAsyncThunk(
  "location/fetchCitiesByDistrict",
  async (districtId, { rejectWithValue }) => {
    try {
      return await getCitiesByDistrict(districtId);
    } catch (error) {
    return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Request failed"
    );
}

  }
);
 
export const fetchAreasByCity = createAsyncThunk(
  "location/fetchAreasByCity",
  async (cityId, { rejectWithValue }) => {
    try {
      return await getAreasByCity(cityId);
    } catch (error) {
    return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Request failed"
    );
}

  }
);
 
const initialState = {
  states: [],
  districts: [],
  cities: [],
  areas: [],
  loading: false,
  error: null,
};
 
const locationSlice = createSlice({
  name: "location",
  initialState,
 
  reducers: {
    clearDistricts: (state) => {
      state.districts = [];
    },
 
    clearCities: (state) => {
      state.cities = [];
    },
 
    clearAreas: (state) => {
      state.areas = [];
    },
  },
 
  extraReducers: (builder) => {
    builder
 
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
      })
 
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading = false;
        state.states = action.payload;
      })
 
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
 
      .addCase(
        fetchDistrictsByState.fulfilled,
        (state, action) => {
          state.districts = action.payload;
        }
      )
 
      .addCase(
        fetchCitiesByDistrict.fulfilled,
        (state, action) => {
          state.cities = action.payload;
        }
      )
 
      .addCase(
        fetchAreasByCity.fulfilled,
        (state, action) => {
          state.areas = action.payload;
        }
      );
  },
});
 
export const {
  clearDistricts,
  clearCities,
  clearAreas,
} = locationSlice.actions;
 
export default locationSlice.reducer;
 