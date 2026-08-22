import { tranAdd, tranList } from "@/services/transacApi";
import { useState } from "react";

export const useTransac = () => {
  const [tranLoading, setLoading] = useState(false);
  const [tranApiData, setApiData] = useState(null);
  const [tranApiError, setApiError] = useState(null);
  const addTran = async (payload) => {
    setLoading(true);
    try {
      const data = await tranAdd(payload);
      setApiData(data);
    } catch (err) {
      setApiError(err?.response?.data);
    } finally {
      setLoading(false);
    }
  };
  const getTranList = async () => {
    setLoading(true);
    try {
      const data = await tranList();
      setApiData(data);
    } catch (err) {
      setApiError(err?.response?.data);
    } finally {
      setLoading(false);
    }
  };
  return { addTran, getTranList, tranLoading, tranApiData, tranApiError };
};
