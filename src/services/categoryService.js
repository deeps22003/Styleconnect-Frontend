import API_ENDPOINTS from "../constants/apiEndpoints"
import apiClient from "./apiClient"

export const getCategories=async()=>{
    try{
        const response=await apiClient.get(
            API_ENDPOINTS.CATEGORY.GET_CATEGORIES
        );
        return response.data.data;
    }catch(error){
        throw error;
    }
}