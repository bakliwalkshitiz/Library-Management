import api from "../api/axios";

export const getUsers = () => api.get("/users");

export const deleteUser = (id: number) => api.delete(`/users/${id}`);

export const updateUser = (id: number, data: any) => api.put(`/users/${id}`, data);

export const updateAdminCredentials = (data: { currentPassword: string; email?: string; password?: string }) =>
  api.put("/users/me/admin-credentials", data);

export const updateMyPaymentInfo = (data: { upiId: string; qrImageUrl: string }) =>
  api.put("/users/me/payment", data);
