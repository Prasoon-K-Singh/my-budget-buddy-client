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
    const response = await api.get(
      `/list?page=${payload?.page}&limit=${payload?.limit}`,
    );
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
