import api from "../api/axios";
import type { BorrowRequest } from "../types/borrow";

export const getBorrows = () => api.get("/borrow");

export const addBorrow = (data: BorrowRequest) => api.post("/borrow", data);

export const deleteBorrow = (id: number) => api.delete(`/borrow/${id}`);
