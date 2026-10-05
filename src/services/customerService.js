// services/customerService.js
import API_ENDPOINTS from "../constants/apiEndpoints";
import apiClient from "./apiClient";

export const registerCustomer = async (
  data
) => {
  console.log(
    "Customer Registration Payload:",
    data
  );

  return data;
};

export const getCustomerById=async(customerId)=>{
  const response=await apiClient.get(
    API_ENDPOINTS.CUSTOMERS.GET_CUSTOMER_BY_ID(customerId)
  );
  return response.data.data;
}


export const getCustomerByUserId = async (userId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.CUSTOMERS.GET_CUSTOMER_BY_USERID(userId)
  );
  return response.data.data;
};