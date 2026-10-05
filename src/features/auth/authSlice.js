import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};
 const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        loginSuccess:(state,action)=>{
            const {userId,roleId,fullName,accessToken,refreshToken}=action.payload;
            state.user={
                userId,roleId,fullName
            };
            state.accessToken=accessToken;
            state.refreshToken=refreshToken;
            state.isAuthenticated=true;
        },
        logout:(state)=>{
            state.user=null;
            state.accessToken=null;
            state.refreshToken=null;
            state.isAuthenticated=false;
        }
    }
 });

 export const {loginSuccess,logout}=authSlice.actions;

 export default authSlice.reducer;