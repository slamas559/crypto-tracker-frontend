import instance from "./axios";

export const getPortfolio = () => instance.get("/portfolio");
export const addCoin = (data) => instance.post("/portfolio", data);
export const updateCoin = (id, data) => instance.put(`/portfolio/${id}`, data);
export const deleteCoin = (id) => instance.delete(`/portfolio/${id}`);
