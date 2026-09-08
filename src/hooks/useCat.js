import {
  getBudget,
  createCat,
  updateCat,
  getCurrMonthExpenses,
} from "@/services/catApi";
import { useState } from "react";

export const useCat = () => {
  const [loading, setLoading] = useState(false);
  const handleGetBudget = async () => {
    setLoading(true);
    try {
      const data = await getBudget();
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
  const handleCreateCat = async (payload) => {
    setLoading(true);
    try {
      const data = await createCat(payload);
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
  const handleUpdateCat = async (id, payload) => {
    setLoading(true);
    try {
      const data = await updateCat(id, payload);
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
  const handleGetCurrMonthExpenses = async () => {
    setLoading(true);
    try {
      const data = await getCurrMonthExpenses();
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

  return {
    handleGetBudget,
    handleCreateCat,
    handleUpdateCat,
    handleGetCurrMonthExpenses,
    loading,
  };
};
