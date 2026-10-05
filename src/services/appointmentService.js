import API_ENDPOINTS from "../constants/apiEndpoints";
import apiClient from "./apiClient";
 
export const getAppointments = async (userType, userId) => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.APPOINTMENTS.GET_USER_APPOINTMENTS(
        userType,
        userId
      )
    );
 
    return response.data;
  } catch (error) {
    throw error;
  }
};
 
export const getAppointmentById = async (appointmentId) => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.APPOINTMENTS.GET_APPOINTMENT_BY_ID(
        appointmentId
      )
    );
 
    return response.data;
  } catch (error) {
    throw error;
  }
};
 
export const createOrUpdateAppointment = async (appointmentData) => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.APPOINTMENTS.CREATE_OR_UPDATE_APPOINTMENT,
      appointmentData
    );
 
    return response.data;
  } catch (error) {
    throw error;
  }
};
 
export const updateAppointmentStatus = async (
  appointmentId,
  statusData
) => {
  try {
    const response = await apiClient.patch(
      API_ENDPOINTS.APPOINTMENTS.UPDATE_APPOINTMENT_STATUS(
        appointmentId
      ),
      statusData
    );
 
    return response.data;
  } catch (error) {
    throw error;
  }
};
 
export const cancelAppointment = async (appointmentId) => {
  try {
    const response = await apiClient.patch(
      API_ENDPOINTS.APPOINTMENTS.CANCEL_APPOINTMENT(
        appointmentId
      )
    );
 
    return response.data;
  } catch (error) {
    throw error;
  }
};