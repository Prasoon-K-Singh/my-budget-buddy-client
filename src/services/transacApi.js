import { apiUrl } from "@/config/config";
import axios from "axios";

const api = axios.create({
  baseURL: apiUrl.tranUrl,
  withCredentials: true,
});

export async function tranList() {
  try {
    const response = await api.get("/list");
    return response.data;
  } catch (err) {
    throw err;
  }
}
