import axios, { type AxiosRequestHeaders, type InternalAxiosRequestConfig } from "axios";
import { getCurrentUser } from "../services/authService";

// Create an Axios instance
const axiosInstance = axios.create();

// Add a request interceptor to attach the Firebase token
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
   const user = await getCurrentUser()
    if (user) {
      try {
        const token = await user.getIdToken(); // Fetch the Firebase ID token
        if (config.headers) {
          (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error fetching Firebase token:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
