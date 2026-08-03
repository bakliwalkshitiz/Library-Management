import api from "../api/axios";

export const getAuthors = () => api.get("/authors");

export const addAuthor = (data: any) => api.post("/authors", data);

export const updateAuthor = (id: number, data: any) => api.put(`/authors/${id}`, data);

export const deleteAuthor = (id: number) => api.delete(`/authors/${id}`);
