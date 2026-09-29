import apiClient from './apiClient';

/**
 * Creates a new feedback/rating or updates an existing one.
 * @param {Object} feedbackData - { ratingId, appointmentId, ratingValue, comments }
 */
export const createOrUpdateFeedbackRating = async (feedbackData) => {
  const response = await apiClient.post('/api/CreateorUpdateFeedbackRating', feedbackData);
  return response.data;
};

/**
 * Gets feedback and rating details for a specific appointment ID.
 * @param {number|string} appointmentId 
 */
export const getFeedbackRatingByAppointmentId = async (appointmentId) => {
  const response = await apiClient.get(`/api/GetFeedbackRating/${appointmentId}`);
  return response.data;
};

/**
 * Gets all feedback and ratings for a specific expert ID (for Expert Dashboard).
 * @param {number|string} expertId 
 */
export const getFeedbackRatingByExpertId = async (expertId) => {
  const response = await apiClient.get(`/api/GetFeedbackRatingByExpert/${expertId}`);
  return response.data;
};