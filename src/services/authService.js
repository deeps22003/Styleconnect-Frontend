    // services/authService.js

    import API_ENDPOINTS from "../constants/apiEndpoints";
    import apiClient from "./apiClient";

    export const registerUser=async(payload)=>{
        try{
        const response=await apiClient.post(
            API_ENDPOINTS.AUTH.REGISTER_USER,
            payload
        );
        return response.data;
    }catch(error){
        throw error;
    }
    };

    export const loginUser=async(payload)=>{
        try{
            const response=await apiClient.post(
                API_ENDPOINTS.AUTH.LOGIN_USER,
                payload
            );
            return response.data
        }catch(error){
            throw error;
        }
    };

    export const refreshToken = async (refreshTokenValue) => {
        const response = await apiClient.post(
            API_ENDPOINTS.AUTH.REFRESH_ACCESS_TOKEN,
            {
            refreshToken: refreshTokenValue,
            }
        );

        return response.data;
    };