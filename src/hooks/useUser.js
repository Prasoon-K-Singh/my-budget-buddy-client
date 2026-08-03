import { userInfo, userUpdate, passwordUpdate } from "@/services/userApi";
import { useState } from "react";

export const useUser = () => {
  const [data, setData] = useState(null);
  const [apiError, serApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const getUserInfo = async () => {
    setLoading(true);
    try {
      const data = await userInfo();
      setData(data);
    } catch (err) {
      console.log("err: ", err);
    } finally {
      setLoading(false);
    }
  };
  const updateUser = async (payload) => {
    setLoading(true);
    try {
      const data = await userUpdate(payload);
      setData(data);
    } catch (err) {
      console.log("err: ", err);
    } finally {
      setLoading(false);
    }
  };
  const updatePassword = async (payload) => {
    try {
      const data = await passwordUpdate(payload);
      setData(data);
    } catch (err) {
      serApiError(err?.response?.data);
      throw err;
    }
  };
  return { data, apiError, loading, getUserInfo, updateUser, updatePassword };
};
