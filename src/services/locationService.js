import API_ENDPOINTS from "../constants/apiEndpoints"
import apiClient from "./apiClient"

export const getStates=async()=>{
    const response=await apiClient.get(
        API_ENDPOINTS.LOCATION.GET_STATES
    );
    return response.data.data;
};

export const getDistrictsByState=async(stateId)=>{
    const response=await apiClient.get(
        API_ENDPOINTS.LOCATION.GET_DISTRICTS_BY_STATEID(stateId)
    );
    return response.data.data;
};

export const getCitiesByDistrict=async(districtId)=>{
    const response=await apiClient.get(
        API_ENDPOINTS.LOCATION.GET_CITIES_BY_DISTRICTID(districtId)
    );
  
    return response.data.data;
};

export const getAreasByCity=async(cityId)=>{
    const response=await apiClient.get(
        API_ENDPOINTS.LOCATION.GET_AREAS_BY_CITYID(cityId)
    );
    return response.data.data;
};

export const createAddress=async(addressData)=>{
    const response=await apiClient.post(
        API_ENDPOINTS.LOCATION.CREATE_ADDRESS,
        addressData
    );
      console.log("CREATE ADDRESS RESPONSE");
console.log(response);
    return response.data;
}