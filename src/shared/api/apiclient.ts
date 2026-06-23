import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_PUBLIC_API_URL ||
  "http://localhost:5005/api";

export const AUTH_TOKEN_STORAGE_KEY = "token";

const getAuthToken = () => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      document.cookie = "lms_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie = "lms_user_roles=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    }

    return Promise.reject(error);
  }
);

export default apiClient;
