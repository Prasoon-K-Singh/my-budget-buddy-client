import { API_URL } from "@/config/config";
import axios from "axios";

const api = axios.create({
  baseURL: API_URL.authUrl,
  withCredentials: true,
});

export async function register(payload) {
  try {
    const response = await api.post("register", payload);
    return response.data;
  } catch (err) {
    console.log("err: ", err);
  }
}

export async function login(payload) {
  try {
    const response = await api.post("login", payload);
    return response.data;
  } catch (err) {
    console.log("err: ", err);
  }
}

export async function logout() {
  try {
    await api.get("logout");
  } catch (err) {
    console.log("err: ", err);
  }
}
