import axios from 'axios';

const BASE_URL = 'https://localhost:7211/api';

// Base Axios instance matching backend service URL
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach Bearer token if present
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle unauthenticated responses globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      if (window.location.pathname !== '/register' && window.location.pathname !== '/login') {
        window.location.href = '/register';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Parses userType strings/numbers to ASP.NET C# route integers:
 * 0 = Expert, 1 = Customer
 */
export const parseUserType = (userType) => {
  if (userType === 0 || userType === 1) return userType;
  const normalized = String(userType ?? '').trim().toLowerCase();
  if (normalized === 'expert' || normalized === '0') return 0;
  if (normalized === 'customer' || normalized === '1') return 1;
  return Number(userType) || 1; // Default to Customer (1) if ambiguous
};

// ==========================================
// ALL API CALLS DEFINED DIRECTLY IN APICLIENT
// ==========================================
export const apiClient = {
  // Generic HTTP Wrappers
  get: async (url, params = {}) => {
    const response = await axiosInstance.get(url, { params });
    return response.data;
  },

  post: async (url, data = {}) => {
    const response = await axiosInstance.post(url, data);
    return response.data;
  },

  put: async (url, data = {}) => {
    const response = await axiosInstance.put(url, data);
    return response.data;
  },

  patch: async (url, data = {}) => {
    const response = await axiosInstance.patch(url, data);
    return response.data;
  },

  delete: async (url) => {
    const response = await axiosInstance.delete(url);
    return response.data;
  },

  // ==========================================
  // SERVICE CATEGORY ENDPOINTS (/api/Category)
  // ==========================================

  // GET: /api/Category
  getCategories: async () => {
    try {
      const response = await axiosInstance.get('/Category');
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    } catch {
      return [];
    }
  },

  // GET: /api/Category/{id}
  getCategoryById: async (id) => {
    const response = await axiosInstance.get(`/Category/${id}`);
    return response.data;
  },

  // POST: /api/Category
  createCategory: async (categoryData) => {
    const response = await axiosInstance.post('/Category', categoryData);
    return response.data;
  },

  // PUT: /api/Category/{id}
  updateCategory: async (id, categoryData) => {
    const response = await axiosInstance.put(`/Category/${id}`, categoryData);
    return response.data;
  },

  // DELETE: /api/Category/{id}
  deleteCategory: async (id) => {
    const response = await axiosInstance.delete(`/Category/${id}`);
    return response.data;
  },

  // PUT: /api/Category/restore/{id}
  restoreCategory: async (id) => {
    const response = await axiosInstance.put(`/Category/restore/${id}`);
    return response.data;
  },

  // ==========================================
  // EXPERT ENDPOINTS WITH MULTI-ENDPOINT FALLBACK
  // ==========================================

  getExperts: async () => {
    const endpoints = [
      '/Auth/experts',
      '/Expert',
      '/Experts',
      '/User/experts',
      '/User'
    ];

    for (const url of endpoints) {
      try {
        const response = await axiosInstance.get(url);
        
        let list = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.data || []);

        if (url === '/User' && Array.isArray(list)) {
          list = list.filter((u) => 
            u.userType === 0 || 
            u.userType === '0' || 
            u.userType === 'Expert' || 
            u.role === 'Expert'
          );
        }

        if (list && list.length > 0) {
          return list;
        }
      } catch (error) {
        // Continue attempting remaining fallback endpoints
      }
    }

    return [];
  },

  // ==========================================
  // APPOINTMENTS ENDPOINTS
  // ==========================================

  // POST: /api/Appointments/CreateOrUpdate
  createOrUpdateAppointment: async (appointmentData) => {
    try {
      const response = await axiosInstance.post('/Appointments/CreateOrUpdate', appointmentData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        try {
          const response = await axiosInstance.post('/CreateOrUpdateAppointment', appointmentData);
          return response.data;
        } catch {
          const response = await axiosInstance.post('/CreateorUpdateAppointment', appointmentData);
          return response.data;
        }
      }
      throw error;
    }
  },

  // GET: /api/Appointments/{id}
  getAppointmentById: async (id) => {
    const response = await axiosInstance.get(`/Appointments/${id}`);
    return response.data;
  },

  // GET: /api/Appointments/{userType:int}/{userId:int}
  getAppointmentsByUserTypeAndId: async (userType, userId) => {
    const numericType = parseUserType(userType);
    const response = await axiosInstance.get(`/Appointments/${numericType}/${userId}`);
    return response.data;
  },

  // PATCH: /api/Appointments/{id}/status
  updateAppointmentStatus: async (id, statusData) => {
    const payload = typeof statusData === 'number' || typeof statusData === 'string' 
      ? { appointmentStatusId: Number(statusData) } 
      : statusData;

    try {
      const response = await axiosInstance.patch(`/Appointments/${id}/status`, payload);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        const response = await axiosInstance.patch(`/GetAppointmentStatus/${id}`, payload);
        return response.data;
      }
      throw error;
    }
  },

  // PATCH: /api/Appointments/{id}/cancel
  cancelAppointment: async (id, cancelData = {}) => {
    try {
      const response = await axiosInstance.patch(`/Appointments/${id}/cancel`, cancelData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        const response = await axiosInstance.patch(`/GetAppointmentCancle/${id}`, cancelData);
        return response.data;
      }
      throw error;
    }
  },

  // ==========================================
  // FEEDBACK & RATING ENDPOINTS
  // ==========================================

  // POST: /api/CreateOrUpdateFeedbackRating
  createOrUpdateFeedbackRating: async (feedbackData) => {
    const payload = {
      appointmentId: Number(feedbackData.appointmentId || feedbackData.id),
      ratingId: feedbackData.ratingId || feedbackData.feedbackId || 0,
      ratingValue: Number(feedbackData.ratingValue || feedbackData.rating || 5),
      comments: feedbackData.comments || feedbackData.review || ''
    };

    const response = await axiosInstance.post('/CreateOrUpdateFeedbackRating', payload);
    return response.data;
  },

  // GET: /api/GetFeedbackRating/{appointmentId}
  getFeedbackRatingByAppointmentId: async (appointmentId) => {
    if (!appointmentId) return null;

    try {
      const response = await axiosInstance.get(`/GetFeedbackRating/${appointmentId}`, {
        validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
      });

      if (response.status === 404 || !response.data) {
        return null;
      }

      return {
        ...response.data,
        appointmentId: response.data.appointmentId || appointmentId,
        feedbackId: response.data.feedbackId || response.data.id,
        ratingId: response.data.ratingId || response.data.feedbackId,
        ratingValue: response.data.ratingValue ?? response.data.rating ?? 5,
        comments: response.data.comments || response.data.review || ''
      };
    } catch (error) {
      return null;
    }
  },

  // GET: /api/GetFeedbackRatingByExpert/{expertId}
  getFeedbackRatingByExpertId: async (expertId) => {
    if (!expertId) return [];
    const response = await axiosInstance.get(`/GetFeedbackRatingByExpert/${expertId}`);
    return response.data || [];
  },
};

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
        } else if (errorData.message || errorData.title) {
          errorMessage = errorData.message || errorData.title;
        } else if (errorData.errors && typeof errorData.errors === 'object') {
          const firstKey = Object.keys(errorData.errors)[0];
          if (firstKey && errorData.errors[firstKey].length > 0) {
            errorMessage = errorData.errors[firstKey][0];
          }
        }
      } catch {
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

  if (response.status === 204) {
    return { success: true };
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

// Fixed Export: Guarantees userType is converted to integer (0 or 1)
export const getCustomerAppointments = async (userTypeOrId = 1, userId = 1) => {
  let userTypeInt = 1;
  let targetUserId = userId;

  if (typeof userTypeOrId === 'number' || (!isNaN(userTypeOrId) && !isNaN(parseFloat(userTypeOrId)))) {
    targetUserId = Number(userTypeOrId);
    userTypeInt = 1;
  } else {
    userTypeInt = parseUserType(userTypeOrId);
  }

  const response = await fetch(`${BASE_URL}/Appointments/${userTypeInt}/${targetUserId}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  return await parseResponse(response);
};

// Fixed Export: POST Create or Update Appointment
export const createOrUpdateAppointment = async (bookingData) => {
  let response = await fetch(`${BASE_URL}/Appointments/CreateOrUpdate`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingData)
  });

  if (response.status === 404) {
    response = await fetch(`${BASE_URL}/CreateOrUpdateAppointment`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });

    if (response.status === 404) {
      response = await fetch(`${BASE_URL}/CreateorUpdateAppointment`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(bookingData)
      });
    }
  }

  return await parseResponse(response);
};

// Fixed Export: PATCH Update Status
export const updateStatus = async (appointmentId, status) => {
  const payload = typeof status === 'number' || typeof status === 'string' 
    ? { appointmentStatusId: Number(status) } 
    : status;

  let response = await fetch(`${BASE_URL}/Appointments/${appointmentId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });

  if (response.status === 404) {
    response = await fetch(`${BASE_URL}/GetAppointmentStatus/${appointmentId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
  }

  return await parseResponse(response);
};

// Fixed Export: PATCH Cancel Appointment
export const cancelAppointment = async (appointmentId) => {
  let response = await fetch(`${BASE_URL}/Appointments/${appointmentId}/cancel`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });

  if (response.status === 404) {
    response = await fetch(`${BASE_URL}/GetAppointmentCancle/${appointmentId}`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
  }

  return await parseResponse(response);
};

export const appointmentService = {
  fetchAppointments: getCustomerAppointments,
  createAppointment: createOrUpdateAppointment,
  updateStatus,
  cancelAppointment
};

export default apiClient;