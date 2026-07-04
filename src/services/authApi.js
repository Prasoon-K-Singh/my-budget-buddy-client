import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/user/",
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

export async function getMe() {
  try {
    const response = await api.get("get-me");
    return response.data;
  } catch (err) {
    console.log("err: ", err);
  }
}
