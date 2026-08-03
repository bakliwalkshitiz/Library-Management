import api from "../api/axios";

export const getPaymentConfig = () => api.get<{ upiId: string; payeeName: string }>("/payment/config");
