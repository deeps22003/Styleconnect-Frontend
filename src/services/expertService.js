// services/expertService.js
import API_ENDPOINTS from "../constants/apiEndpoints";
import apiClient from "./apiClient";

export const registerExpert = async (
  data
) => {
  console.log(
    "Expert Registration Payload:",
    data
  );

  return data;
};


export const getAllExperts=async()=>{
  try{
    const response=await apiClient.get(
      API_ENDPOINTS.EXPERTS.GET_ALLEXPERTS
    );
    return response.data;
  }catch(error){
    throw error;
  }
}

export const getExpertById=async(expertId)=>{
  try{
    const response=await apiClient.get(
     API_ENDPOINTS.EXPERTS.GET_EXPERT_BY_ID(expertId)
    );
    return response.data;
  }catch(error){
    throw error;
  }
}