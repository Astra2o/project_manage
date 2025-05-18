import axios from "axios";
import { redirect, useRouter } from "next/navigation"; // next 13+ app router ka navigation

export const api = axios.create({
  baseURL: "/api", // apni API base URL daal lena
  headers: {
    "Content-Type": "application/json"
  }
});

// Request me token add karna
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response me error handle karna
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token hata do
      localStorage.removeItem("token");
      localStorage.removeItem("user");

        if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
