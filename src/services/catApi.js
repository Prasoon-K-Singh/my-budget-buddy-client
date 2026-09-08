import { API_URL } from "@/config/config";
import axios from "axios";

const api = axios.create({
  baseURL: API_URL.catUrl,
  withCredentials: true,
});

export async function getBudget() {
  try {
    const response = await api.get("/getBudget");
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getCurrMonthExpenses() {
  try {
    const response = await api.get("/currMonthExpenses");
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function createCat(payload) {
  try {
    const response = await api.post("/add", payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function updateCat(id, payload) {
  try {
    const response = await api.post(`/update/${id}`, payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}
