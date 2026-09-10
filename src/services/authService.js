// services/authService.js

import apiClient from "./apiClient";

export const registerUser=async(payload)=>{
    try{
    const response=await apiClient.post(
        "/Auth/register",
        payload
    );
    return response.data;
}catch(error){
    throw error;
}
};