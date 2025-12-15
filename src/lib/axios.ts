import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

// 1. Create the Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  timeout: 10000, // 10 seconds timeout
});

// 2. Request Interceptor: Attaches the Token to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from LocalStorage (or Cookies/Session)
    // specific logic depends on how you store your JWT
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: Handles global errors (401, 403, 500)
apiClient.interceptors.response.use(
  (response) => {
    // Return the response directly if successful
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // Case: 401 Unauthorized (Token expired or invalid)
    if (error.response?.status === 401) {
      // Optional: Add logic here to refresh token automatically
      // or redirect to login
      if (typeof window !== 'undefined') {
         // Example: Redirect to login
         // window.location.href = '/login'; 
      }
    }

    // Case: 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;