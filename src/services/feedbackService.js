import API_ENDPOINTS from "../constants/apiEndpoints";
import apiClient from "./apiClient";

export const createOrUpdateFeedbackRating = async (
  feedbackData
) => {
  const response = await apiClient.post(
    API_ENDPOINTS.FEEDBACK.CREATE_OR_UPDATE_FEEDBACK,
    feedbackData
  );

  return response.data;
};

export const getFeedbackRatingByAppointmentId =
  async (appointmentId) => {
    const response = await apiClient.get(
      API_ENDPOINTS.FEEDBACK.GET_FEEDBACK_BY_APPOINTMENT(
        appointmentId
      )
    );

    return response.data;
  };

export const getFeedbackRatingByExpertId =
  async (expertId) => {
    const response = await apiClient.get(
      API_ENDPOINTS.FEEDBACK.GET_FEEDBACK_BY_EXPERT(
        expertId
      )
    );

    return response.data;
  };