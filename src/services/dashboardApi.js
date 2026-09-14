import { API_URL } from "@/config/config";
import axios from "axios";

const api = axios.create({
  baseURL: API_URL.dashboardUrl,
  withCredentials: true,
});

export async function getDashboardOverview() {
  try {
    const response = await api.get("/dashboardOverview");
    return response.data;
  } catch (err) {
    throw err;
  }
}
