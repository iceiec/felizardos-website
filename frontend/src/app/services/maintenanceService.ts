import { api } from "./api";
import type { ApiResponse, MaintenanceItem, MaintenanceStatus } from "../types";

export const maintenanceService = {
  getAll(): Promise<ApiResponse<MaintenanceItem[]>> {
    return api.get("/maintenance");
  },

  getByFacility(facilityId: string): Promise<ApiResponse<MaintenanceItem[]>> {
    return api.get(`/maintenance?facilityId=${facilityId}`);
  },

  create(
    data: Omit<MaintenanceItem, "_id" | "id" | "createdAt" | "updatedAt">
  ): Promise<ApiResponse<MaintenanceItem>> {
    return api.post("/maintenance", data);
  },

  update(id: string, data: Partial<MaintenanceItem>): Promise<ApiResponse<MaintenanceItem>> {
    return api.put(`/maintenance/${id}`, data);
  },

  updateStatus(id: string, status: MaintenanceStatus): Promise<ApiResponse<MaintenanceItem>> {
    return api.patch(`/maintenance/${id}/status`, { status });
  },

  delete(id: string): Promise<ApiResponse<null>> {
    return api.delete(`/maintenance/${id}`);
  },
};
