import { apiUrl } from "@/config/config";
import axios from "axios";

const api = axios.create({
  baseURL: apiUrl.userUrl,
  withCredentials: true,
});

export async function getMe() {
  try {
    const response = await api.get("get-me");
    return response.data;
  } catch (err) {
    console.log("err: ", err);
  }
}

export async function userInfo() {
  try {
    const response = await api.get("info");
    return response.data;
  } catch (err) {
    console.log("err: ", err);
  }
}

export async function userUpdate(payload) {
  try {
    const response = await api.post(`update`, payload);
    return response.data;
  } catch (err) {
    console.log("err: ", err);
  }
}

export async function passwordUpdate(payload) {
  try {
    const response = await api.post("password-update", payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function profileImgUpload(payload) {
  try {
    const response = await api.post("upload-profile", payload);
    return response.data;
  } catch (err) {
    throw err;
  }
}
