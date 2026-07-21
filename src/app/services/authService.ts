import { api, setToken, clearToken } from "./api";
import type { ApiResponse, AuthPayload } from "../types";

export const authService = {
  async login(email: string, password: string): Promise<AuthPayload> {
    const res = await api.post<ApiResponse<AuthPayload>>("/auth/login", {
      email,
      password,
    });
    setToken(res.data.token);
    return res.data;
  },

  logout(): void {
    clearToken();
  },
};
