import { tranAdd, tranList, tranDel } from "@/services/transacApi";
import { useState } from "react";

export const useTransac = () => {
  const [tranLoading, setLoading] = useState(false);
  const addTran = async (payload) => {
    setLoading(true);
    try {
      const data = await tranAdd(payload);
      return data;
    } catch (err) {
      return (
        err?.response?.data || {
          success: false,
          message: "Something went wrong",
        }
      );
    } finally {
      setLoading(false);
    }
  };
  const getTranList = async () => {
    setLoading(true);
    try {
      const data = await tranList();
      return data;
    } catch (err) {
      return (
        err?.response?.data || {
          success: false,
          message: "Something went wrong",
        }
      );
    } finally {
      setLoading(false);
    }
  };
  const delTran = async (tranId) => {
    setLoading(true);
    try {
      const data = await tranDel(tranId);
      return data;
    } catch (err) {
      return (
        err?.response?.data || {
          success: false,
          message: "Something went wrong",
        }
      );
    } finally {
      setLoading(false);
    }
  };
  return { addTran, getTranList, delTran, tranLoading };
};
