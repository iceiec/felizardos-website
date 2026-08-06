import { api } from "./api";
import type { ApiResponse, Schedule, BookingStatus } from "../types";

export const scheduleService = {
  getAll(): Promise<ApiResponse<Schedule[]>> {
    return api.get("/schedules");
  },

  getByFacility(facilityId: string): Promise<ApiResponse<Schedule[]>> {
    return api.get(`/schedules?facilityId=${facilityId}`);
  },

  getByDate(date: string): Promise<ApiResponse<Schedule[]>> {
    return api.get(`/schedules?date=${date}`);
  },

  create(schedule: Omit<Schedule, "id">): Promise<ApiResponse<Schedule>> {
    return api.post("/schedules", schedule);
  },

  createInquiry(schedule: Omit<Schedule, "id">): Promise<ApiResponse<Schedule>> {
    return api.post("/schedules/inquiry", schedule);
  },

  update(id: string, data: Partial<Schedule>): Promise<ApiResponse<Schedule>> {
    return api.put(`/schedules/${id}`, data);
  },

  updateStatus(id: string, status: BookingStatus): Promise<ApiResponse<Schedule>> {
    return api.patch(`/schedules/${id}/status`, { status });
  },

  delete(id: string): Promise<ApiResponse<null>> {
    return api.delete(`/schedules/${id}`);
  },
};
