import { apiUrl } from "@/config/config";
import axios from "axios";

const api = axios.create({
  baseURL: apiUrl.tranUrl,
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

export async function tranList() {
  try {
    const response = await api.get("/list");
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
