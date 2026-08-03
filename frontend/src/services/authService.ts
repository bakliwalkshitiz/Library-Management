import api from "../api/axios";
import type { LoginRequest, LoginResponse, RegisterRequest } from "../types/auth";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<void> => {
  await api.post("/auth/register", data);
};
