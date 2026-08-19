import { apiUrl } from "@/config/config";
import axios from "axios";

const api = axios.create({
  baseURL: apiUrl.accUrl,
  withCredentials: true,
});

export async function createAcc(payload) {
  try {
    const response = await api.post("/add", payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function deleteAcc(payload) {
  try {
    const response = await api.post("/delete", payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}
