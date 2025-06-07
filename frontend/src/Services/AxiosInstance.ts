import axios from "axios";
import { UserService } from "./UserService";

const AxiosInstance = axios.create();

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          UserService.LogOut();
          return Promise.reject(error);
        }

        const res = await axios.post("https://localhost:7085/api/User/refresh-token", {
          refreshToken,
        });
        
        const { token, refreshToken: newRefreshToken, userRole, userData } = res.data;
        
        // Update everything after refreshing
        localStorage.setItem("jwt", token);
        localStorage.setItem("refreshToken", newRefreshToken);
        localStorage.setItem("role", userRole);
        localStorage.setItem("userModel", JSON.stringify(userData));
        
        UserService.token = token;
        UserService.role = userRole;
        UserService.LoggedInUser = userData;

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        UserService.LogOut();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
export default AxiosInstance;
