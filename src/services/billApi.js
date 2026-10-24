import { API_URL } from "@/config/config";
import axios from "axios";

const api = axios.create({
  baseURL: API_URL.billUrl,
  withCredentials: true,
});

export async function billCreate(payload) {
  try {
    const response = await api.post("/create", payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function bills() {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function billById(id) {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function billDel(id) {
  try {
    const response = await api.post(`/delete/${id}`);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function billEdit(id, payload) {
  try {
    const response = await api.post(`/update/${id}`, payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function billMarkPaid(id) {
  try {
    const response = await api.post(`/mark-paid/${id}`);
    return response.data;
  } catch (err) {
    throw err;
  }
}
