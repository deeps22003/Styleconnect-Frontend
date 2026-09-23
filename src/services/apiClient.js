import axios from 'axios';

// Base Axios instance matching backend service URL
const axiosInstance = axios.create({
  baseURL: 'https://localhost:7211/api',
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
const parseUserType = (userType) => {
  if (userType === 0 || userType === 1) return userType;
  const normalized = String(userType ?? '').trim().toLowerCase();
  if (normalized === 'expert' || normalized === '0') return 0;
  if (normalized === 'customer' || normalized === '1') return 1;
  return Number(userType) || 0;
};

// ALL API CALLS DEFINED DIRECTLY IN APICLIENT
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

  patch: async (url, data = {}) => {
    const response = await axiosInstance.patch(url, data);
    return response.data;
  },

  delete: async (url) => {
    const response = await axiosInstance.delete(url);
    return response.data;
  },

  // ==========================================
  // APPOINTMENTS ENDPOINTS (SWAGGER MATCHED)
  // ==========================================

  // POST: /api/CreateorUpdateAppointment
  createOrUpdateAppointment: async (appointmentData) => {
    const response = await axiosInstance.post('/CreateorUpdateAppointment', appointmentData);
    return response.data;
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

  // PATCH: /api/GetAppointmentStatus/{id}
  updateAppointmentStatus: async (id, statusData) => {
    const payload = typeof statusData === 'string' ? { status: statusData } : statusData;
    const response = await axiosInstance.patch(`/GetAppointmentStatus/${id}`, payload);
    return response.data;
  },

  // PATCH: /api/GetAppointmentCancle/{id}
  cancelAppointment: async (id, cancelData = {}) => {
    const response = await axiosInstance.patch(`/GetAppointmentCancle/${id}`, cancelData);
    return response.data;
  },

  // ==========================================
  // FEEDBACK & RATING ENDPOINTS
  // ==========================================

  // POST: /api/CreateorUpdateFeedbackRating
  createOrUpdateFeedbackRating: async (feedbackData) => {
    const response = await axiosInstance.post('/CreateorUpdateFeedbackRating', feedbackData);
    return response.data;
  },

  // GET: /api/GetFeedbackRating/{appointmentId}
  getFeedbackRatingByAppointmentId: async (appointmentId) => {
    const response = await axiosInstance.get(`/GetFeedbackRating/${appointmentId}`);
    return response.data;
  },
};

export default apiClient;