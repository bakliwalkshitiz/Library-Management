import api from "../api/axios";
import type { BookRequest } from "../types/book";

export const getBooks = () => api.get("/books");
export const getMyBooks = () => api.get("/books/mine");
export const getBookById = (id: number) => api.get(`/books/${id}`);
export const searchBooks = (title: string) => api.get(`/books/search?title=${encodeURIComponent(title)}`);
export const getBooksByCategory = (categoryName: string) => api.get(`/books/category/${encodeURIComponent(categoryName)}`);
export const addBook = (data: BookRequest) => api.post("/books", data);
export const updateBook = (id: number, data: BookRequest) => api.put(`/books/${id}`, data);
export const deleteBook = (id: number) => api.delete(`/books/${id}`);
export const updateBookContent = (id: number, content: string) => api.patch(`/books/${id}/content`, { content });
export const askAiAboutBook = (bookId: number, question: string, selectedText?: string) =>
  api.post(`/books/${bookId}/ai/ask`, { question, selectedText });
