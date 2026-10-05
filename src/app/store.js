import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import appointmentReducer from "../store/slices/appointmentSlice";
import categoryReducer from "../store/slices/categorySlice";
import expertReducer from "../store/slices/expertSlice";
import locationReducer from "../store/slices/locationSlice";
import roleReducer from "../store/slices/roleSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    appointments: appointmentReducer,
    categories: categoryReducer,
    experts: expertReducer,
    location: locationReducer,
    roles: roleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: {
        warnAfter: 128, // Fixes the ImmutableStateInvariantMiddleware performance warning
      },
      serializableCheck: false,
    }),
});