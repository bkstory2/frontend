// src/api/axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || "http://localhost:7789/api/board",
  timeout: 10000,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 공통 에러 처리
    if (error.response) {
      console.error("API Error:", error.response.data.message || error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
