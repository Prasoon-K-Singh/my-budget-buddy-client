import { createAcc, deleteAcc } from "@/services/accApi";
import { useState } from "react";

export const useAcc = () => {
  const [loading, setLoading] = useState(false);
  const handleAdd = async (payload) => {
    setLoading(true);
    try {
      const data = await createAcc(payload);
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
  const handleDelete = async (payload) => {
    setLoading(true);
    try {
      const data = await deleteAcc(payload);
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

  return { handleAdd, handleDelete, loading };
};
