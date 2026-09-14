import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  updateTokens,
  clearAuthData,
} from "../utils/authStorage";

import API_ENDPOINTS from "../constants/apiEndpoints";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    const excludedUrls = [
      API_ENDPOINTS.AUTH.LOGIN_USER,
      API_ENDPOINTS.AUTH.REGISTER_USER,
      API_ENDPOINTS.AUTH.REFRESH_ACCESS_TOKEN,
    ];

    if (
      token &&
      !excludedUrls.includes(config.url)
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

   if (
  error.response?.status === 401 &&
  !originalRequest._retry &&
  originalRequest.url !==
    API_ENDPOINTS.AUTH.REFRESH_ACCESS_TOKEN &&
  originalRequest.url !==
    API_ENDPOINTS.AUTH.LOGIN_USER
) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          throw new Error("Refresh token not found");
        }

        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_ACCESS_TOKEN}`,
          {
            refreshToken,
          }
        );

        const newTokens = refreshResponse.data;

        updateTokens(newTokens);

        originalRequest.headers.Authorization =
          `Bearer ${newTokens.accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        clearAuthData();

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;