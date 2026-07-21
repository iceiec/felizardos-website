import { api } from "./api";
import type { ApiResponse, Facility } from "../types";

export const facilityService = {
  getAll(): Promise<ApiResponse<Facility[]>> {
    return api.get("/facilities");
  },

  getById(id: string): Promise<ApiResponse<Facility>> {
    return api.get(`/facilities/${id}`);
  },

  create(data: Omit<Facility, "_id" | "createdAt" | "updatedAt">): Promise<ApiResponse<Facility>> {
    return api.post("/facilities", data);
  },

  update(id: string, data: Partial<Facility>): Promise<ApiResponse<Facility>> {
    return api.put(`/facilities/${id}`, data);
  },

  toggleStatus(id: string, status: Facility["status"]): Promise<ApiResponse<Facility>> {
    return api.patch(`/facilities/${id}/status`, { status });
  },

  toggleLanding(id: string, showOnLanding: boolean): Promise<ApiResponse<Facility>> {
    return api.patch(`/facilities/${id}/landing`, { showOnLanding });
  },

  delete(id: string): Promise<ApiResponse<null>> {
    return api.delete(`/facilities/${id}`);
  },
};
