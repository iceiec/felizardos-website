import { api } from "./api";
import type { ApiResponse, AdminSettings } from "../types";

export const settingsService = {
  get(): Promise<ApiResponse<AdminSettings>> {
    return api.get("/settings");
  },

  update(data: Partial<AdminSettings>): Promise<ApiResponse<AdminSettings>> {
    return api.put("/settings", data);
  },
};
