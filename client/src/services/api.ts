import axios from "axios";
import {
  Drawing,
  CreateDrawingRequest,
  ApiResponse,
} from "../../../shared/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to:`,
      config.url,
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Response error:", error);
    if (error.response) {
      // Server responded with error status
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
    } else if (error.request) {
      // Request made but no response received
      console.error("No response received:", error.request);
    } else {
      // Something else happened
      console.error("Error message:", error.message);
    }
    return Promise.reject(error);
  },
);

export const drawingApi = {
  async getDrawings(): Promise<ApiResponse<Drawing[]>> {
    try {
      const response = await api.get<ApiResponse<Drawing[]>>("/api/drawings");
      return response.data;
    } catch (error) {
      console.error("Error fetching drawings:", error);
      return {
        success: false,
        error: "Failed to fetch drawings",
      };
    }
  },

  async getDrawing(id: string): Promise<ApiResponse<Drawing>> {
    try {
      const response = await api.get<ApiResponse<Drawing>>(
        `/api/drawings/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching drawing:", error);
      return {
        success: false,
        error: "Failed to fetch drawing",
      };
    }
  },

  async createDrawing(
    data: CreateDrawingRequest,
  ): Promise<ApiResponse<Drawing>> {
    try {
      const response = await api.post<ApiResponse<Drawing>>(
        "/api/drawings",
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating drawing:", error);
      return {
        success: false,
        error: "Failed to create drawing",
      };
    }
  },

  async deleteDrawing(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete<ApiResponse<null>>(
        `/api/drawings/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting drawing:", error);
      return {
        success: false,
        error: "Failed to delete drawing",
      };
    }
  },
};
