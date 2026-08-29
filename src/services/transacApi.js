import { API_URL } from "@/config/config";
import axios from "axios";

const api = axios.create({
  baseURL: API_URL.tranUrl,
  withCredentials: true,
});

export async function tranAdd(payload) {
  try {
    const response = await api.post("/add", payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function tranList(payload) {
  try {
    const params = new URLSearchParams({
      page: payload?.page || 1,
      limit: payload?.limit || 10,
      fromDate: payload?.fromDate || "",
      toDate: payload?.toDate || "",
      account: payload?.account || "",
      category: payload?.category || "",
      method: payload?.method || "",
      type: payload?.type || "",
    });
    const response = await api.get(`/list?${params.toString()}`);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function tranDel(payload) {
  try {
    const response = await api.post(`/delete/${payload}`);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function tranEdit(id, payload) {
  try {
    const response = await api.post(`/edit/${id}`, payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}
