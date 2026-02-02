import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuth } from "../store/useUserStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type':'application/json'
  }
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
   
    let token = useAuth.getState().accessToken;
    if (!token) {
      token = sessionStorage.getItem("accessToken");
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  
    return config
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuth.getState().logOut()
    }
    return Promise.reject(error)
  }
)