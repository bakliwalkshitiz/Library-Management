import api from "../api/axios";

export const getCategories = () => api.get("/categories");
export const addCategory = (data: { name: string }) => api.post("/categories", data);
export const updateCategory = (id: number, data: { name: string }) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id: number) => api.delete(`/categories/${id}`);
