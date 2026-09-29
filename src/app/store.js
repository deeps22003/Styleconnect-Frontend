import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import categoryReducer from "../features/slices/categorySlice";
import expertReducer from "../features/slices/expertSlice";
import locationReducer from "../features/slices/loactionSlice";
import roleReducer from "../features/slices/roleSlice";
export const store=configureStore({
    reducer:{
        auth:authReducer,
        categories:categoryReducer,
        experts: expertReducer,
        location:locationReducer,
        roles:roleReducer,
    }
});