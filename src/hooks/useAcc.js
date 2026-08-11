import { createAcc } from "@/services/accApi";
import { useState } from "react";

export const useAcc = () => {
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [apiError, setApiError] = useState(null);
  const handleAdd = async (payload) => {
    setLoading(true);
    try {
      const data = await createAcc(payload);
      setApiData(data);
    } catch (err) {
      setApiError(err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return { loading, apiData, apiError, handleAdd };
};
