import API_ENDPOINTS from "../constants/apiEndpoints"
import apiClient from "./apiClient"

export const getRoles=async()=>{
    const response=await apiClient.get(
        API_ENDPOINTS.ROLE.GET_ROLES
    );
    return response.data;
}