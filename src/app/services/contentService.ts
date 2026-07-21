import { api } from "./api";
import type { ApiResponse, SiteContent } from "../types";

export const contentService = {
  get(): Promise<ApiResponse<SiteContent>> {
    return api.get("/content");
  },

  update(data: Partial<SiteContent>): Promise<ApiResponse<SiteContent>> {
    return api.put("/content", data);
  },
};
