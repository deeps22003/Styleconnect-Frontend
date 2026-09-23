const BASE_URL = 'https://localhost:7211/api';

/**
 * Safely retrieves Authorization and Content-Type headers from storage
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

/**
 * Parses ASP.NET Core & custom API errors safely without stream locking
 */
const handleResponseError = async (response) => {
  let errorMessage = `HTTP Error ${response.status}`;

  try {
    const textData = await response.text();

    if (textData) {
      try {
        const errorData = JSON.parse(textData);

        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.title || errorData.message) {
          errorMessage = errorData.title || errorData.message;
        } else if (errorData.errors && typeof errorData.errors === 'object') {
          // Extract ASP.NET model validation state errors
          const firstKey = Object.keys(errorData.errors)[0];
          if (firstKey && errorData.errors[firstKey].length > 0) {
            errorMessage = errorData.errors[firstKey][0];
          }
        }
      } catch {
        // Fallback for plain text responses
        errorMessage = textData;
      }
    }
  } catch {
    errorMessage = `Request failed with status ${response.status}`;
  }

  throw new Error(errorMessage);
};

/**
 * Helper to process API response bodies cleanly (handles 204 No Content)
 */
const parseResponse = async (response) => {
  if (!response.ok) {
    await handleResponseError(response);
  }

  // Handle 204 No Content or empty responses safely
  if (response.status === 204) {
    return { success: true };
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

// Named Export: GET Customer/User Appointments
export const getCustomerAppointments = async (userTypeOrId = 'Customer', userId = 1) => {
  let userType = userTypeOrId;
  let id = userId;

  // Polymorphic signature handling: pass just an ID -> getCustomerAppointments(5)
  if (typeof userTypeOrId === 'number' || (!isNaN(userTypeOrId) && !isNaN(parseFloat(userTypeOrId)))) {
    id = userTypeOrId;
    userType = 'Customer';
  }

  const response = await fetch(`${BASE_URL}/Appointments/${userType}/${id}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  return await parseResponse(response);
};

// Named Export: POST Create or Update Appointment
export const createOrUpdateAppointment = async (bookingData) => {
  const response = await fetch(`${BASE_URL}/CreateorUpdateAppointment`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingData)
  });

  return await parseResponse(response);
};

// Named Export: PATCH Update Status
export const updateStatus = async (appointmentId, status) => {
  const payload = typeof status === 'string' ? { status } : status;

  const response = await fetch(`${BASE_URL}/GetAppointmentStatus/${appointmentId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });

  return await parseResponse(response);
};

// Named Export: PATCH Cancel Appointment
export const cancelAppointment = async (appointmentId) => {
  const response = await fetch(`${BASE_URL}/GetAppointmentCancle/${appointmentId}`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });

  return await parseResponse(response);
};

// Default Export Bundle
export const appointmentService = {
  fetchAppointments: getCustomerAppointments,
  createAppointment: createOrUpdateAppointment,
  updateStatus,
  cancelAppointment
};

export default appointmentService;